const DATA_ATTRIBUTE_PATTERN = /^data-[a-z0-9-]+$/;
const MAX_MENU_HEIGHT = 360;
const MENU_GAP = 4;
const MIN_MENU_WIDTH = 180;
const VIEWPORT_GAP = 8;
const installedControllers = new WeakMap();

function escapeHtml(value = '') {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function optionLabel(option) {
  return String(option?.label || option?.textContent || option?.value || '').trim();
}

function selectIdentity(select) {
  return String(select?.id || select?.name || select?.getAttribute?.('aria-label') || 'anonymous-select');
}

function labelTextForSelect(select) {
  const explicit = String(select?.getAttribute?.('aria-label') || '').trim();
  if (explicit) return explicit;
  const label = select?.labels?.[0];
  if (!label) return '';
  const clone = label.cloneNode(true);
  clone.querySelectorAll('select, input, textarea, button').forEach((control) => control.remove());
  return String(clone.textContent || '').replace(/\s+/g, ' ').trim();
}

function optionsSignature(select) {
  return Array.from(select?.options ?? []).map((option) => [
    option.value,
    optionLabel(option),
    option.disabled,
    option.hidden,
    option.parentElement?.tagName === 'OPTGROUP' ? option.parentElement.label : ''
  ].join('\u0001')).join('\u0002');
}

function eventSummary(event = null) {
  if (!event) return null;
  return {
    type: String(event.type || ''),
    key: String(event.key || ''),
    button: Number.isFinite(Number(event.button)) ? Number(event.button) : null
  };
}

function rectValue(rect, name, fallback = 0) {
  const value = Number(rect?.[name]);
  return Number.isFinite(value) ? value : fallback;
}

export function resolveSelectMenuPosition({
  containerAvailableHeight = Number.POSITIVE_INFINITY,
  menuHeight = 0,
  menuWidth = 0,
  triggerRect = {},
  viewportWidth = 0
} = {}) {
  const triggerLeft = rectValue(triggerRect, 'left');
  const triggerWidth = Math.max(0, rectValue(triggerRect, 'width'));
  const triggerRight = rectValue(triggerRect, 'right', triggerLeft + triggerWidth);
  const triggerTop = rectValue(triggerRect, 'top');
  const triggerHeight = Math.max(0, rectValue(triggerRect, 'height'));
  const triggerBottom = rectValue(triggerRect, 'bottom', triggerTop + triggerHeight);
  const resolvedMenuWidth = Math.max(0, Number(menuWidth) || 0);
  const resolvedMenuHeight = Math.max(0, Number(menuHeight) || 0);
  const resolvedViewportWidth = Math.max(0, Number(viewportWidth) || 0);
  const resolvedContainerAvailableHeight = Number.isFinite(Number(containerAvailableHeight))
    ? Math.max(0, Number(containerAvailableHeight))
    : Number.POSITIVE_INFINITY;
  const top = triggerBottom + MENU_GAP;
  const fitsLeftAligned = triggerLeft + resolvedMenuWidth <= resolvedViewportWidth - VIEWPORT_GAP;
  const fitsRightAligned = triggerRight - resolvedMenuWidth >= VIEWPORT_GAP;
  const left = fitsLeftAligned || !fitsRightAligned
    ? triggerLeft
    : triggerRight - resolvedMenuWidth;

  return Object.freeze({
    left: Math.round(left),
    maxHeight: Math.round(Math.min(MAX_MENU_HEIGHT, resolvedMenuHeight, resolvedContainerAvailableHeight)),
    placement: 'below',
    top: Math.round(top)
  });
}

export function selectionControlsMarkup({ ariaLabel = '', controls = [] } = {}) {
  const controlMarkup = controls.map((control) => {
    const dataAttribute = String(control?.dataAttribute || '');
    if (!DATA_ATTRIBUTE_PATTERN.test(dataAttribute)) {
      throw new TypeError(`Selection control data attribute is invalid: ${dataAttribute}`);
    }
    const selectedValue = String(control?.value ?? '');
    const selectedOption = (control?.options || []).find((option) => String(option?.value ?? '') === selectedValue)
      ?? control?.options?.[0]
      ?? { label: 'Select', value: '' };
    const controlId = String(control?.id || '');
    const labelId = `${controlId}Label`;
    return `
      <div class="bb-selection-control">
        <span id="${escapeHtml(labelId)}">${escapeHtml(control?.label)}</span>
        <div class="bb-select" data-bb-select>
          <select
            id="${escapeHtml(controlId)}"
            class="bb-select__native"
            name="${escapeHtml(control?.name)}"
            aria-labelledby="${escapeHtml(labelId)}"
            data-bb-native-select
            ${dataAttribute}
          >
          ${(control?.options || []).map((option) => {
            const value = String(option?.value ?? '');
            return `<option value="${escapeHtml(value)}"${value === selectedValue ? ' selected' : ''}>${escapeHtml(option?.label)}</option>`;
          }).join('')}
          </select>
          <button
            class="bb-select__trigger bb-interface-action"
            type="button"
            aria-expanded="false"
            aria-haspopup="listbox"
            aria-labelledby="${escapeHtml(labelId)} ${escapeHtml(controlId)}Value"
            data-bb-select-trigger="${escapeHtml(controlId)}"
          >
            <span id="${escapeHtml(controlId)}Value" class="bb-select__value">${escapeHtml(selectedOption?.label)}</span>
            <span class="bb-select__caret" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  return `<div class="bb-selection-controls" aria-label="${escapeHtml(ariaLabel)}">${controlMarkup}</div>`;
}

export function selectHasFocus(select, rootDocument = globalThis.document) {
  const wrapper = select?.closest?.('[data-bb-select]');
  return Boolean(wrapper?.contains?.(rootDocument?.activeElement));
}

export function installSelectController(root = globalThis.document, {
  enhanceNativeSelects = false,
  eventRouter = null,
  logInteraction = null
} = {}) {
  if (!root?.addEventListener) return null;
  if (installedControllers.has(root)) return installedControllers.get(root);

  const rootDocument = root.ownerDocument ?? root;
  const view = rootDocument.defaultView ?? globalThis.window;
  const records = new Set();
  const recordsBySelect = new WeakMap();
  const recordsByTrigger = new WeakMap();
  const disposers = [];
  let activeRecord = null;
  let anchorFrame = null;
  let menuSequence = 0;

  function log(event, payload = {}) {
    logInteraction?.(event, {
      category: 'ui',
      level: payload.level ?? 'detailed',
      source: 'custom-select',
      ...payload
    });
  }

  function listen(target, eventName, handler, options) {
    if (!target?.addEventListener) return;
    if (eventRouter?.bind) {
      eventRouter.bind(target, eventName, handler, options);
      return;
    }
    const wrapped = (event) => {
      try {
        handler(event);
      } catch (error) {
        log('custom-select-router-error', {
          level: 'error',
          listenerFile: 'bitsandbolts-themes/components/select.js',
          listenerName: 'installSelectController',
          routerEventName: eventName,
          message: String(error?.message || error || 'unknown error')
        });
      }
    };
    target.addEventListener(eventName, wrapped, options);
    disposers.push(() => target.removeEventListener(eventName, wrapped, options));
  }

  function selectedOption(record) {
    return record.select.options[record.select.selectedIndex] ?? null;
  }

  function enabledMenuItems(menu) {
    return [...(menu?.querySelectorAll?.('[data-bb-select-option-index]:not(:disabled)') ?? [])];
  }

  function syncRecord(record, { rebuild = false } = {}) {
    const { select, trigger, valueNode, wrapper } = record;
    if (!select?.isConnected || !wrapper?.isConnected) return false;
    const selected = selectedOption(record);
    const value = optionLabel(selected) || String(select.value || '').trim() || 'Select';
    valueNode.textContent = value;
    trigger.disabled = Boolean(select.disabled);
    wrapper.hidden = Boolean(select.hidden);
    wrapper.classList.toggle('is-disabled', Boolean(select.disabled));
    const accessibleLabel = labelTextForSelect(select);
    if (!trigger.hasAttribute('aria-labelledby')) {
      trigger.setAttribute('aria-label', accessibleLabel ? `${accessibleLabel}: ${value}` : value);
    }
    trigger.title = select.title || '';
    if (rebuild || record.optionsSignature !== optionsSignature(select)) {
      record.optionsSignature = optionsSignature(select);
      if (record.menu) renderOptions(record);
    } else if (record.menu) {
      record.menu.querySelectorAll('[data-bb-select-option-index]').forEach((item) => {
        const optionIndex = Number(item.dataset.bbSelectOptionIndex);
        const isSelected = optionIndex === select.selectedIndex;
        item.setAttribute('aria-selected', String(isSelected));
        item.tabIndex = isSelected ? 0 : -1;
      });
    }
    return true;
  }

  function queueSync(record, options = {}) {
    if (record.syncQueued) {
      record.rebuildQueued ||= Boolean(options.rebuild);
      return;
    }
    record.syncQueued = true;
    record.rebuildQueued = Boolean(options.rebuild);
    queueMicrotask(() => {
      record.syncQueued = false;
      const rebuild = record.rebuildQueued;
      record.rebuildQueued = false;
      syncRecord(record, { rebuild });
    });
  }

  function instrumentValueProperty(record) {
    const { select } = record;
    const prototype = view?.HTMLSelectElement?.prototype;
    const descriptor = prototype && Object.getOwnPropertyDescriptor(prototype, 'value');
    if (!descriptor?.get || !descriptor?.set) return;
    record.originalValueDescriptor = Object.getOwnPropertyDescriptor(select, 'value') ?? null;
    try {
      Object.defineProperty(select, 'value', {
        configurable: true,
        enumerable: descriptor.enumerable,
        get() {
          return descriptor.get.call(this);
        },
        set(value) {
          descriptor.set.call(this, value);
          queueSync(record);
        }
      });
      record.valueInstrumented = true;
    } catch (error) {
      log('custom-select-value-sync-failed', {
        level: 'error',
        listenerFile: 'bitsandbolts-themes/components/select.js',
        listenerName: 'instrumentValueProperty',
        selectId: selectIdentity(select),
        message: String(error?.message || error || 'unknown error')
      });
    }
  }

  function renderOptions(record) {
    const { menu, select } = record;
    if (!menu) return;
    const nodes = [];
    let previousGroup = null;
    Array.from(select.options).forEach((option, optionIndex) => {
      if (option.hidden) return;
      const group = option.parentElement?.tagName === 'OPTGROUP' ? option.parentElement : null;
      if (group && group !== previousGroup) {
        const groupLabel = rootDocument.createElement('div');
        groupLabel.className = 'bb-menu__info';
        groupLabel.setAttribute('role', 'presentation');
        groupLabel.textContent = group.label;
        nodes.push(groupLabel);
      }
      previousGroup = group;
      const item = rootDocument.createElement('button');
      const isSelected = optionIndex === select.selectedIndex;
      item.type = 'button';
      item.className = 'bb-menu__item bb-interface-action';
      item.disabled = Boolean(option.disabled || group?.disabled);
      item.dataset.bbSelectOptionIndex = String(optionIndex);
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', String(isSelected));
      item.tabIndex = isSelected ? 0 : -1;
      const label = rootDocument.createElement('span');
      label.className = 'bb-menu__label';
      label.textContent = optionLabel(option);
      item.appendChild(label);
      nodes.push(item);
    });
    menu.replaceChildren(...nodes);
    record.anchorSignature = '';
    record.menuNaturalHeight = 0;
  }

  function anchorContainerFor(trigger) {
    let ancestor = trigger?.parentElement;
    while (ancestor && ancestor !== rootDocument.body && ancestor !== rootDocument.documentElement) {
      const style = view?.getComputedStyle?.(ancestor);
      const overflow = `${style?.overflowY || ''} ${style?.overflow || ''}`;
      if (/\b(auto|scroll|overlay|hidden|clip)\b/.test(overflow)) return ancestor;
      ancestor = ancestor.parentElement;
    }
    return null;
  }

  function viewportRect() {
    const width = Number(view?.innerWidth) || rootDocument.documentElement?.clientWidth || 0;
    const height = Number(view?.innerHeight) || rootDocument.documentElement?.clientHeight || 0;
    return { bottom: height, left: 0, right: width, top: 0 };
  }

  function anchorContainerRect(record) {
    return record.anchorContainer?.getBoundingClientRect?.() ?? viewportRect();
  }

  function anchorContainerAvailableHeight(record, triggerRect) {
    if (record.anchorContainer) {
      const containerRect = record.anchorContainer.getBoundingClientRect();
      const triggerBottomInContent = record.anchorContainer.scrollTop
        + triggerRect.bottom
        - containerRect.top;
      return Math.max(
        0,
        record.anchorContainer.scrollHeight - triggerBottomInContent - VIEWPORT_GAP
      );
    }
    const scrollTop = Number(view?.scrollY)
      || rootDocument.documentElement?.scrollTop
      || rootDocument.body?.scrollTop
      || 0;
    const scrollHeight = Math.max(
      rootDocument.documentElement?.scrollHeight || 0,
      rootDocument.body?.scrollHeight || 0,
      viewportRect().bottom
    );
    return Math.max(0, scrollHeight - scrollTop - triggerRect.bottom - VIEWPORT_GAP);
  }

  function triggerIsVisible(record, triggerRect = record.trigger?.getBoundingClientRect?.()) {
    const { select, trigger, wrapper } = record;
    if (!select?.isConnected || !trigger?.isConnected || !wrapper?.isConnected || select.hidden || wrapper.hidden) {
      return false;
    }
    const style = view?.getComputedStyle?.(trigger);
    if (style?.display === 'none' || style?.visibility === 'hidden' || style?.visibility === 'collapse') {
      return false;
    }
    if (!triggerRect || triggerRect.width <= 0 || triggerRect.height <= 0) return false;
    const containerRect = anchorContainerRect(record);
    const visibleRect = viewportRect();
    const left = Math.max(containerRect.left, visibleRect.left);
    const right = Math.min(containerRect.right, visibleRect.right);
    const top = Math.max(containerRect.top, visibleRect.top);
    const bottom = Math.min(containerRect.bottom, visibleRect.bottom);
    return triggerRect.right > left
      && triggerRect.left < right
      && triggerRect.bottom > top
      && triggerRect.top < bottom;
  }

  function positionMenu(record) {
    const { menu, trigger } = record;
    if (!menu?.isConnected || !trigger?.isConnected) return null;
    const viewportWidth = Number(view?.innerWidth) || rootDocument.documentElement?.clientWidth || 0;
    const triggerRect = trigger.getBoundingClientRect();
    if (!triggerIsVisible(record, triggerRect)) {
      close('anchor-hidden');
      return null;
    }
    menu.style.minWidth = `${Math.ceil(Math.max(triggerRect.width, MIN_MENU_WIDTH))}px`;
    if (!record.menuNaturalHeight) {
      menu.style.maxHeight = 'none';
      record.menuNaturalHeight = Math.ceil(menu.getBoundingClientRect().height);
    }
    const menuRect = menu.getBoundingClientRect();
    const position = resolveSelectMenuPosition({
      containerAvailableHeight: anchorContainerAvailableHeight(record, triggerRect),
      menuHeight: record.menuNaturalHeight,
      menuWidth: menuRect.width,
      triggerRect,
      viewportWidth
    });
    const signature = `${position.left}:${position.top}:${position.maxHeight}`;
    if (signature !== record.anchorSignature) {
      record.anchorSignature = signature;
      menu.style.left = `${position.left}px`;
      menu.style.top = `${position.top}px`;
      menu.style.maxHeight = `${position.maxHeight}px`;
    }
    menu.style.visibility = '';
    menu.dataset.bbSelectPlacement = position.placement;
    return {
      ...position,
      height: Math.min(record.menuNaturalHeight, position.maxHeight),
      naturalHeight: record.menuNaturalHeight,
      width: Math.round(menuRect.width)
    };
  }

  function stopAnchorTracking() {
    if (anchorFrame === null) return;
    view?.cancelAnimationFrame?.(anchorFrame);
    anchorFrame = null;
  }

  function trackAnchor(record) {
    anchorFrame = null;
    if (activeRecord !== record) return;
    positionMenu(record);
    if (activeRecord === record) {
      anchorFrame = view?.requestAnimationFrame?.(() => trackAnchor(record)) ?? null;
    }
  }

  function startAnchorTracking(record) {
    stopAnchorTracking();
    anchorFrame = view?.requestAnimationFrame?.(() => trackAnchor(record)) ?? null;
  }

  function close(reason = 'unspecified', event = null, { restoreFocus = false } = {}) {
    const record = activeRecord;
    if (!record) return false;
    activeRecord = null;
    stopAnchorTracking();
    record.wrapper.classList.remove('is-open');
    record.trigger.setAttribute('aria-expanded', 'false');
    record.trigger.removeAttribute('aria-controls');
    record.menu?.remove();
    record.menu = null;
    record.anchorContainer = null;
    record.anchorSignature = '';
    record.menuNaturalHeight = 0;
    if (restoreFocus && record.trigger.isConnected) record.trigger.focus();
    log('custom-select-hidden', {
      listenerFile: 'bitsandbolts-themes/components/select.js',
      listenerName: 'close',
      selectId: selectIdentity(record.select),
      reason,
      focusOutcome: rootDocument.activeElement === record.trigger ? 'trigger-focused' : 'focus-not-restored',
      presentationOutcome: 'menu-removed',
      inputEvent: eventSummary(event)
    });
    return true;
  }

  function open(record, event = null, { focus = 'selected' } = {}) {
    if (!record || record.select.disabled) return false;
    if (activeRecord === record) return true;
    close('replaced', event);
    record.anchorContainer = anchorContainerFor(record.trigger);
    if (!triggerIsVisible(record)) return false;
    const menu = rootDocument.createElement('div');
    menu.id = `${record.select.id || 'bbSelect'}Menu${menuSequence += 1}`;
    menu.className = 'bb-menu bb-select__menu';
    menu.dataset.floatingWindowPortal = 'true';
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('aria-label', labelTextForSelect(record.select) || selectIdentity(record.select));
    record.menu = menu;
    renderOptions(record);
    menu.style.visibility = 'hidden';
    rootDocument.body.appendChild(menu);
    activeRecord = record;
    record.wrapper.classList.add('is-open');
    record.trigger.setAttribute('aria-controls', menu.id);
    record.trigger.setAttribute('aria-expanded', 'true');
    const position = positionMenu(record);
    if (!position || activeRecord !== record) return false;
    const enabled = enabledMenuItems(menu);
    const selectedItem = menu.querySelector('[aria-selected="true"]:not(:disabled)');
    const focusTarget = focus === 'last' ? enabled.at(-1) : selectedItem ?? enabled[0];
    focusTarget?.focus?.({ preventScroll: true });
    focusTarget?.scrollIntoView?.({ block: 'nearest' });
    startAnchorTracking(record);
    log('custom-select-opened', {
      listenerFile: 'bitsandbolts-themes/components/select.js',
      listenerName: 'open',
      selectId: selectIdentity(record.select),
      resolution: 'themes-canonical-control',
      optionCount: enabled.length,
      selectedIndex: record.select.selectedIndex,
      focusOutcome: focusTarget ? 'option-focused' : 'no-enabled-option',
      presentationOutcome: menu.isConnected ? 'menu-presented' : 'menu-missing',
      position,
      inputEvent: eventSummary(event)
    });
    return true;
  }

  function commit(record, optionIndex, event = null) {
    const option = record?.select?.options?.[optionIndex];
    if (!option || option.disabled || option.parentElement?.disabled) return false;
    const previousValue = record.select.value;
    record.select.value = option.value;
    const EventConstructor = view?.Event ?? globalThis.Event;
    record.select.dispatchEvent(new EventConstructor('input', { bubbles: true }));
    record.select.dispatchEvent(new EventConstructor('change', { bubbles: true }));
    syncRecord(record);
    log('custom-select-option-selected', {
      listenerFile: 'bitsandbolts-themes/components/select.js',
      listenerName: 'commit',
      selectId: selectIdentity(record.select),
      optionIndex,
      previousValue,
      selectedValue: record.select.value,
      selectedLabel: optionLabel(option),
      action: 'native-select-value-commit',
      downstreamOwner: 'native-select-input-change-events',
      presentationOutcome: 'trigger-value-synchronized',
      inputEvent: eventSummary(event)
    });
    close('option-selected', event, { restoreFocus: true });
    return true;
  }

  function moveFocus(menu, direction) {
    const items = enabledMenuItems(menu);
    if (!items.length) return;
    const currentIndex = items.indexOf(rootDocument.activeElement);
    const nextIndex = direction === 'first'
      ? 0
      : direction === 'last'
        ? items.length - 1
        : Math.max(0, Math.min(items.length - 1, currentIndex + direction));
    items[nextIndex]?.focus?.({ preventScroll: true });
    items[nextIndex]?.scrollIntoView?.({ block: 'nearest' });
  }

  function generatedMarkup(select) {
    const wrapper = rootDocument.createElement('span');
    const trigger = rootDocument.createElement('button');
    const valueNode = rootDocument.createElement('span');
    const caret = rootDocument.createElement('span');
    const iconName = String(select.dataset.bbSelectIcon || '').trim();
    wrapper.className = 'bb-select';
    wrapper.dataset.bbSelect = '';
    wrapper.dataset.bbSelectGenerated = 'true';
    trigger.type = 'button';
    trigger.className = 'bb-select__trigger bb-interface-action';
    trigger.dataset.bbSelectTrigger = selectIdentity(select);
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    valueNode.className = 'bb-select__value';
    caret.className = 'bb-select__caret';
    caret.setAttribute('aria-hidden', 'true');
    if (iconName) {
      const iconNode = rootDocument.createElement('span');
      iconNode.className = 'bb-select__icon ms';
      iconNode.setAttribute('aria-hidden', 'true');
      iconNode.textContent = iconName;
      wrapper.classList.add('bb-select--icon-only');
      trigger.append(iconNode, valueNode);
    } else {
      trigger.append(valueNode, caret);
    }
    select.before(wrapper);
    wrapper.append(select, trigger);
    return { generated: true, trigger, valueNode, wrapper };
  }

  function existingMarkup(select) {
    const wrapper = select.closest?.('[data-bb-select]');
    const trigger = wrapper?.querySelector?.('[data-bb-select-trigger]');
    const valueNode = trigger?.querySelector?.('.bb-select__value');
    return wrapper && trigger && valueNode
      ? { generated: false, trigger, valueNode, wrapper }
      : null;
  }

  function enhance(select) {
    if (!select?.matches?.('select') || recordsBySelect.has(select)) return false;
    const markup = existingMarkup(select);
    if (!markup && !enhanceNativeSelects) return false;
    if (select.multiple || Number(select.size) > 1 || select.dataset.nativeSelect === 'true') {
      log('custom-select-enhancement-skipped', {
        listenerFile: 'bitsandbolts-themes/components/select.js',
        listenerName: 'enhance',
        selectId: selectIdentity(select),
        reason: select.dataset.nativeSelect === 'true' ? 'explicit-native-opt-out' : 'multi-select'
      });
      return false;
    }
    const { generated, trigger, valueNode, wrapper } = markup ?? generatedMarkup(select);
    const record = {
      anchorContainer: null,
      anchorSignature: '',
      generated,
      menu: null,
      menuNaturalHeight: 0,
      optionsSignature: '',
      originalAriaHidden: select.getAttribute('aria-hidden'),
      originalNativeClass: select.classList.contains('bb-select__native'),
      originalTabIndex: select.getAttribute('tabindex'),
      originalValueDescriptor: null,
      previousWrapperHidden: wrapper.hidden,
      rebuildQueued: false,
      select,
      syncQueued: false,
      trigger,
      valueInstrumented: false,
      valueNode,
      wrapper
    };
    select.classList.add('bb-select__native');
    select.setAttribute('aria-hidden', 'true');
    select.tabIndex = -1;
    records.add(record);
    recordsBySelect.set(select, record);
    recordsByTrigger.set(trigger, record);
    instrumentValueProperty(record);
    syncRecord(record, { rebuild: true });
    return true;
  }

  function teardownRecord(record) {
    if (activeRecord === record) close('select-removed');
    record.menu?.remove?.();
    if (record.valueInstrumented) {
      try {
        if (record.originalValueDescriptor) {
          Object.defineProperty(record.select, 'value', record.originalValueDescriptor);
        } else {
          delete record.select.value;
        }
      } catch {}
    }
    if (!record.originalNativeClass) record.select.classList.remove('bb-select__native');
    if (record.originalAriaHidden === null) record.select.removeAttribute('aria-hidden');
    else record.select.setAttribute('aria-hidden', record.originalAriaHidden);
    if (record.originalTabIndex === null) record.select.removeAttribute('tabindex');
    else record.select.setAttribute('tabindex', record.originalTabIndex);
    record.wrapper.hidden = record.previousWrapperHidden;
    records.delete(record);
  }

  function pruneRemovedRecords() {
    records.forEach((record) => {
      if (!record.select.isConnected || !record.wrapper.isConnected) teardownRecord(record);
    });
  }

  function selectsWithin(node) {
    if (node?.nodeType !== 1) return [];
    const selects = [];
    if (node.matches?.('select')) selects.push(node);
    node.querySelectorAll?.('select').forEach((select) => selects.push(select));
    return selects;
  }

  listen(root, 'click', (event) => {
    const item = event.target?.closest?.('[data-bb-select-option-index]');
    if (item && activeRecord?.menu?.contains(item)) {
      event.preventDefault();
      event.stopPropagation();
      commit(activeRecord, Number(item.dataset.bbSelectOptionIndex), event);
      return;
    }
    const trigger = event.target?.closest?.('[data-bb-select-trigger]');
    const record = recordsByTrigger.get(trigger);
    if (!record) return;
    event.preventDefault();
    event.stopPropagation();
    if (activeRecord === record) close('trigger-toggle', event, { restoreFocus: true });
    else open(record, event);
  });
  listen(root, 'pointerdown', (event) => {
    if (!activeRecord) return;
    if (activeRecord.wrapper.contains(event.target) || activeRecord.menu?.contains(event.target)) return;
    close('outside-pointerdown', event);
  }, true);
  listen(root, 'keydown', (event) => {
    const trigger = event.target?.closest?.('[data-bb-select-trigger]');
    const triggerRecord = recordsByTrigger.get(trigger);
    if (triggerRecord && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      open(triggerRecord, event, { focus: event.key === 'ArrowUp' ? 'last' : 'selected' });
      return;
    }
    if (!activeRecord) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close('escape-key', event, { restoreFocus: true });
    } else if (event.key === 'Tab') {
      close('tab-key', event);
    } else if (activeRecord.menu?.contains(event.target) && event.key === 'ArrowDown') {
      event.preventDefault();
      moveFocus(activeRecord.menu, 1);
    } else if (activeRecord.menu?.contains(event.target) && event.key === 'ArrowUp') {
      event.preventDefault();
      moveFocus(activeRecord.menu, -1);
    } else if (activeRecord.menu?.contains(event.target) && event.key === 'Home') {
      event.preventDefault();
      moveFocus(activeRecord.menu, 'first');
    } else if (activeRecord.menu?.contains(event.target) && event.key === 'End') {
      event.preventDefault();
      moveFocus(activeRecord.menu, 'last');
    } else if (activeRecord.menu?.contains(event.target) && ['Enter', ' '].includes(event.key)) {
      const item = event.target?.closest?.('[data-bb-select-option-index]');
      if (!item) return;
      event.preventDefault();
      commit(activeRecord, Number(item.dataset.bbSelectOptionIndex), event);
    }
  }, true);
  listen(root, 'focus', (event) => {
    const record = recordsBySelect.get(event.target);
    if (record) record.trigger.focus();
  }, true);
  listen(root, 'change', (event) => {
    const record = recordsBySelect.get(event.target);
    if (record) queueSync(record);
  }, true);
  listen(root, 'reset', () => {
    queueMicrotask(() => records.forEach((record) => syncRecord(record)));
  }, true);
  const handleViewportChange = (event) => {
    if (!activeRecord || activeRecord.menu?.contains(event?.target)) return;
    positionMenu(activeRecord);
  };
  listen(rootDocument, 'scroll', handleViewportChange, true);
  listen(view, 'resize', handleViewportChange);

  const rootObserver = new MutationObserver((mutations) => {
    let needsPrune = false;
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => selectsWithin(node).forEach(enhance));
        needsPrune ||= mutation.removedNodes.length > 0;
      }
      const targetElement = mutation.target?.nodeType === 1
        ? mutation.target
        : mutation.target?.parentElement;
      const select = targetElement?.matches?.('select')
        ? targetElement
        : targetElement?.closest?.('select');
      const record = recordsBySelect.get(select);
      if (record) queueSync(record, { rebuild: true });
    });
    if (needsPrune) pruneRemovedRecords();
  });
  rootObserver.observe(rootDocument.documentElement, {
    attributes: true,
    attributeFilter: ['disabled', 'hidden', 'label', 'selected', 'title', 'value'],
    childList: true,
    characterData: true,
    subtree: true
  });
  root.querySelectorAll?.('select').forEach(enhance);

  function destroy() {
    close('destroy');
    rootObserver.disconnect();
    eventRouter?.destroy?.();
    while (disposers.length) disposers.pop()?.();
    Array.from(records).forEach((record) => {
      const { generated, select, wrapper } = record;
      teardownRecord(record);
      if (generated && wrapper.isConnected) {
        wrapper.before(select);
        wrapper.remove();
      }
    });
    installedControllers.delete(root);
  }

  const controller = Object.freeze({
    close,
    destroy,
    enhance,
    sync(select) {
      const record = recordsBySelect.get(select);
      return record ? syncRecord(record, { rebuild: true }) : false;
    }
  });
  installedControllers.set(root, controller);
  return controller;
}
