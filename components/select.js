const DATA_ATTRIBUTE_PATTERN = /^data-[a-z0-9-]+$/;
const installedControllers = new WeakMap();

function escapeHtml(value = '') {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
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

export function installSelectController(root = globalThis.document) {
  if (!root?.addEventListener) return null;
  if (installedControllers.has(root)) return installedControllers.get(root);

  let activeSelect = null;

  function close({ restoreFocus = false } = {}) {
    if (!activeSelect) return;
    const { document: rootDocument, menu, trigger, view, wrapper, handleOutside, handleViewport } = activeSelect;
    rootDocument?.removeEventListener?.('pointerdown', handleOutside, true);
    rootDocument?.removeEventListener?.('scroll', handleViewport, true);
    view?.removeEventListener?.('resize', handleViewport);
    menu?.remove?.();
    wrapper?.classList?.remove?.('is-open');
    trigger?.setAttribute?.('aria-expanded', 'false');
    trigger?.removeAttribute?.('aria-controls');
    activeSelect = null;
    if (restoreFocus) trigger?.focus?.();
  }

  function enabledMenuItems(menu) {
    return [...(menu?.querySelectorAll?.('[data-bb-select-option-index]:not(:disabled)') ?? [])];
  }

  function focusMenuItem(menu, current, offset) {
    const items = enabledMenuItems(menu);
    if (!items.length) return;
    const currentIndex = Math.max(0, items.indexOf(current));
    items[(currentIndex + offset + items.length) % items.length]?.focus?.();
  }

  function synchronizeValue(select) {
    const wrapper = select?.closest?.('[data-bb-select]');
    const value = wrapper?.querySelector?.('.bb-select__value');
    const option = select?.options?.[select.selectedIndex];
    if (value && option) value.textContent = option.label || option.textContent || option.value;
  }

  function open(trigger, { focus = 'selected' } = {}) {
    const wrapper = trigger?.closest?.('[data-bb-select]');
    const select = wrapper?.querySelector?.('select');
    const rootDocument = root.ownerDocument ?? root;
    if (!wrapper || !select || !rootDocument?.body || select.disabled) return false;
    if (activeSelect?.trigger === trigger) return true;
    close();

    const menu = rootDocument.createElement('div');
    const menuId = `${select.id}Menu`;
    menu.id = menuId;
    menu.className = 'bb-menu bb-select__menu';
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('aria-labelledby', select.getAttribute('aria-labelledby') || '');
    const items = Array.from(select.options).map((option, optionIndex) => {
      const item = rootDocument.createElement('button');
      const selected = optionIndex === select.selectedIndex;
      item.type = 'button';
      item.className = 'bb-menu__item bb-interface-action';
      item.disabled = Boolean(option.disabled);
      item.dataset.bbSelectOptionIndex = String(optionIndex);
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      const label = rootDocument.createElement('span');
      label.className = 'bb-menu__label';
      label.textContent = option.label || option.textContent || option.value;
      item.appendChild(label);
      return item;
    });
    menu.replaceChildren(...items);
    menu.style.visibility = 'hidden';
    rootDocument.body.appendChild(menu);

    const triggerRect = trigger.getBoundingClientRect();
    const view = rootDocument.defaultView ?? globalThis.window;
    const viewportWidth = Number(view?.innerWidth) || rootDocument.documentElement?.clientWidth || 0;
    const viewportHeight = Number(view?.innerHeight) || rootDocument.documentElement?.clientHeight || 0;
    const menuWidth = Math.max(triggerRect.width, menu.offsetWidth, 180);
    const menuHeight = menu.offsetHeight;
    const left = Math.max(8, Math.min(triggerRect.left, Math.max(8, viewportWidth - menuWidth - 8)));
    const belowTop = triggerRect.bottom + 4;
    const availableBelow = Math.max(0, viewportHeight - belowTop - 8);
    const availableAbove = Math.max(0, triggerRect.top - 12);
    const opensBelow = menuHeight <= availableBelow
      || (menuHeight > availableAbove && availableBelow >= availableAbove);
    const top = opensBelow ? belowTop : triggerRect.top - menuHeight - 4;
    menu.style.left = `${Math.round(left)}px`;
    menu.style.top = `${Math.round(top)}px`;
    menu.style.minWidth = `${Math.round(menuWidth)}px`;
    menu.style.visibility = '';
    menu.dataset.bbSelectPlacement = opensBelow ? 'below' : 'above';

    const handleOutside = (event) => {
      if (!menu.contains(event.target) && !trigger.contains(event.target)) close();
    };
    const handleViewport = (event) => {
      if (event?.type === 'scroll' && menu.contains(event.target)) return;
      close();
    };
    activeSelect = { document: rootDocument, handleOutside, handleViewport, menu, select, trigger, view, wrapper };
    wrapper.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    trigger.setAttribute('aria-controls', menuId);
    rootDocument.addEventListener('pointerdown', handleOutside, true);
    rootDocument.addEventListener('scroll', handleViewport, true);
    view?.addEventListener?.('resize', handleViewport);

    menu.addEventListener('click', (event) => {
      const item = event.target?.closest?.('[data-bb-select-option-index]');
      if (!item || item.disabled) return;
      select.selectedIndex = Number(item.dataset.bbSelectOptionIndex);
      const EventConstructor = rootDocument.defaultView?.Event ?? globalThis.Event;
      select.dispatchEvent(new EventConstructor('change', { bubbles: true }));
    });
    menu.addEventListener('keydown', (event) => {
      const item = event.target?.closest?.('[data-bb-select-option-index]');
      if (event.key === 'Escape') {
        event.preventDefault();
        close({ restoreFocus: true });
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        focusMenuItem(menu, item, event.key === 'ArrowDown' ? 1 : -1);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        const enabled = enabledMenuItems(menu);
        enabled[event.key === 'Home' ? 0 : enabled.length - 1]?.focus?.();
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        item?.click?.();
      } else if (event.key === 'Tab') {
        close();
      }
    });

    const enabled = enabledMenuItems(menu);
    const selectedItem = menu.querySelector('[aria-selected="true"]:not(:disabled)');
    (focus === 'last' ? enabled.at(-1) : selectedItem ?? enabled[0])?.focus?.();
    return true;
  }

  root.addEventListener('click', (event) => {
    const trigger = event.target?.closest?.('[data-bb-select-trigger]');
    if (!trigger || !root.contains?.(trigger)) return;
    event.preventDefault?.();
    if (activeSelect?.trigger === trigger) close({ restoreFocus: true });
    else open(trigger);
  });
  root.addEventListener('keydown', (event) => {
    const trigger = event.target?.closest?.('[data-bb-select-trigger]');
    if (!trigger || !root.contains?.(trigger)) return;
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault?.();
      open(trigger, { focus: event.key === 'ArrowUp' ? 'last' : 'selected' });
    } else if (event.key === 'Escape' && activeSelect?.trigger === trigger) {
      event.preventDefault?.();
      close({ restoreFocus: true });
    }
  });
  root.addEventListener('change', (event) => {
    const select = event.target?.closest?.('[data-bb-select] select');
    if (!select || !root.contains?.(select)) return;
    const trigger = select.closest('[data-bb-select]')?.querySelector?.('[data-bb-select-trigger]');
    synchronizeValue(select);
    close();
    trigger?.focus?.();
  });

  const controller = Object.freeze({ close });
  installedControllers.set(root, controller);
  return controller;
}
