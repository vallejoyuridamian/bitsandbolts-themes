import { semanticActionButtonMarkup } from './button.js';
import { colorPaletteSectionMarkup, layoutTextEditorSectionMarkup } from './layout-text-editor.js';
export { orderedAnimationEntries, indexedAnimationLabel } from './animation-order.js';

const orderSyncByRoot = new WeakMap();

function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}
function attributesMarkup(attributes = {}) {
  return Object.entries(attributes).map(([name, value]) => {
    if (!/^[a-z][a-z0-9-]*$/.test(name)) throw new TypeError('Invalid animation attribute');
    return ` ${name}="${escapeHtml(value)}"`;
  }).join('');
}

export function animationCardMarkup({ id = '', summary = '', contentMarkup = '', attributes = {}, removeAttributes = {}, className = '' } = {}) {
  return `<div class="animation-item${className ? ` ${escapeHtml(className)}` : ''}"${attributesMarkup({ ...attributes, 'data-animation-card-id': id, tabindex: '-1', role: 'group', 'aria-label': summary || 'Animation' })}>
    <div class="animation-item-header"><strong>${escapeHtml(summary)}</strong>
      ${semanticActionButtonMarkup({ iconRole: 'delete', label: 'Remove animation', attributes: removeAttributes })}
    </div>${contentMarkup}</div>`;
}

// Call after the owning render/fit lifecycle. Consumers supply stable card IDs
// and their existing scroll owner; no animation subtype owns addition feedback.
export function animationTypeOptionsMarkup(options = [], { placeholder = false } = {}) {
  return `${placeholder ? `<option value="" disabled selected>${escapeHtml(typeof placeholder === 'string' ? placeholder : 'Select type')}</option>` : ''}${options.map(({ value, label, disabled }) =>
    `<option value="${escapeHtml(value)}"${disabled ? ' disabled' : ''}>${escapeHtml(label)}</option>`).join('')}`;
}

export function syncAnimationCardOrder(root, orderedIds = [], { changedId = '' } = {}) {
  const list = root?.querySelector?.('.animation-list');
  if (!list) return { orderChanged: false };
  const cards = [...list.children].filter((card) => card.dataset?.animationCardId && !card.hasAttribute('data-animation-draft'));
  const byId = new Map(cards.map((card) => [card.dataset.animationCardId, card]));
  const nodes = orderedIds.map((id) => byId.get(String(id)));
  if (nodes.some((node) => !node)) return { orderChanged: false };
  const orderChanged = nodes.some((node, index) => cards[index] !== node);
  const activeElement = list.ownerDocument?.activeElement;
  const preserveFocusedDescendant = Boolean(activeElement && list.contains(activeElement));
  const draft = list.querySelector('[data-animation-draft]');
  if (orderChanged) nodes.forEach((node) => list.insertBefore(node, draft));
  const focusDisplaced = preserveFocusedDescendant && list.ownerDocument.activeElement !== activeElement;
  const cardRefocused = orderChanged && orderSyncByRoot.get(root)?.({ changedId });
  if (!cardRefocused && focusDisplaced && activeElement.isConnected !== false) activeElement.focus({ preventScroll: true });
  return { orderChanged, preserveFocusedDescendant, focusDisplaced,
    focusRestored: focusDisplaced && list.ownerDocument.activeElement === activeElement };
}

export function createAnimationEditorController({ root, eventRouter, reveal, getTypes = () => [], getDraftBeforeId = () => '', selectType, enhanceSelect, onItemsChanged = () => {}, onError } = {}) {
  let cardIds = null;
  let highlighted = null;
  let nextDraftId = 0;
  let selectingDraft = '';
  let changingCardId = '';
  const drafts = new Map();
  const draftSelections = new Map();
  const pendingDrafts = new Map();
  const presetDrafts = new Set();
  const draftOptions = new WeakMap();
  const clearHighlight = () => {
    highlighted?.classList.remove('bb-animation-card-added');
    highlighted = null;
  };
  const onAnimationFinished = (event) => {
    if (event.target === highlighted && event.animationName === 'bb-animation-card-added') clearHighlight();
  };
  eventRouter.bind(root, 'animationend', onAnimationFinished);
  eventRouter.bind(root, 'animationcancel', onAnimationFinished);
  eventRouter.bind(root, 'change', (event) => {
    changingCardId = event.target?.closest?.('[data-animation-card-id]')?.dataset.animationCardId || '';
  }, { capture: true });
  function focusCard(card) {
    if (!card || !root.contains(card)) return false;
    if (highlighted !== card) clearHighlight();
    reveal(card);
    card.focus({ preventScroll: true });
    highlighted = card;
    card.classList.add('bb-animation-card-added');
    const pulse = card.getAnimations?.().find((animation) => animation.animationName === 'bb-animation-card-added');
    if (pulse) pulse.currentTime = 0;
    return true;
  }
  function renderDrafts({ reset = false } = {}) {
    if (reset) {
      [...drafts.keys()].forEach((id) => removeDraft(id, { notify: false }));
    }
    if (!drafts.size) return;
    const list = root.querySelector('.animation-list');
    drafts.forEach((card, id) => {
      if (id === selectingDraft) return;
      const beforeId = presetDrafts.has(id) ? getDraftBeforeId() : '';
      const before = beforeId ? [...list.children].find((node) => node.dataset?.animationCardId === beforeId) : null;
      if (before) list.insertBefore(card, before);
      else if (card.parentElement !== list) list.append(card);
      const select = card.querySelector('[data-animation-draft-type]');
      const options = animationTypeOptionsMarkup(getTypes(), { placeholder: true });
      if (draftOptions.get(select) !== options) {
        select.innerHTML = options;
        draftOptions.set(select, options);
      }
      const pending = pendingDrafts.get(id);
      const selection = draftSelections.get(id);
      const type = getTypes().find((entry) => entry.value === selection?.type);
      const choice = type?.choice;
      let choiceField = card.querySelector('[data-animation-draft-choice-field]');
      if (choice && !choiceField) {
        card.insertAdjacentHTML('beforeend', `<label data-animation-draft-choice-field><span></span><select data-animation-draft-choice="${id}"></select></label>`);
        choiceField = card.querySelector('[data-animation-draft-choice-field]');
      }
      if (choiceField && !choice) choiceField.remove();
      if (choice) {
        choiceField.querySelector('span').textContent = choice.label;
        const choiceSelect = choiceField.querySelector('select');
        const choiceOptions = animationTypeOptionsMarkup(choice.options, { placeholder: choice.placeholder });
        if (draftOptions.get(choiceSelect) !== choiceOptions) {
          choiceSelect.innerHTML = choiceOptions;
          draftOptions.set(choiceSelect, choiceOptions);
        }
        enhanceSelect?.(choiceSelect);
      }
      if (selection) select.value = selection.type;
      if (pending) { select.value = pending.type; select.disabled = true; }
      enhanceSelect?.(select);
    });
  }
  function addDraft({ type = '', options = {} } = {}) {
    const list = root.querySelector('.animation-list');
    if (!list || !getTypes().length) return false;
    const preset = type ? getTypes().find((entry) => entry.value === type && !entry.disabled) : null;
    if (type && !preset) return false;
    const id = `animation-draft-${++nextDraftId}`;
    const template = root.ownerDocument.createElement('template');
    template.innerHTML = animationCardMarkup({ id, summary: preset?.label || '', attributes: { 'data-animation-draft': id },
      removeAttributes: { 'data-animation-draft-remove': id },
      contentMarkup: `<label>Type<select data-animation-draft-type="${id}">${animationTypeOptionsMarkup(getTypes(), { placeholder: true })}</select></label>` });
    drafts.set(id, template.content.firstElementChild);
    if (preset) presetDrafts.add(id);
    renderDrafts();
    onItemsChanged();
    return preset ? chooseType(id, preset.value, options) : true;
  }
  function removeDraft(id, { notify = true } = {}) {
    const card = drafts.get(id);
    if (!card) return false;
    drafts.delete(id);
    draftSelections.delete(id);
    presetDrafts.delete(id);
    const pending = pendingDrafts.get(id);
    pendingDrafts.delete(id);
    pending?.cancel?.();
    card.remove();
    if (notify) onItemsChanged();
    return true;
  }
  eventRouter.bind(root, 'click', (event) => {
    const add = event.target?.closest?.('[data-animation-editor-action="add"]');
    if (add && root.contains(add)) { addDraft(); return; }
    const remove = event.target?.closest?.('[data-animation-draft-remove]');
    if (remove && root.contains(remove)) removeDraft(remove.dataset.animationDraftRemove);
  });
  function chooseType(id, value, options = {}) {
    const card = drafts.get(id);
    if (!card || pendingDrafts.has(id)) return false;
    const select = card.querySelector('[data-animation-draft-type]');
    const type = getTypes().find((entry) => entry.value === value && !entry.disabled);
    if (!type) { select.value = ''; return false; }
    const choice = type.choice;
    if (choice && !choice.options.some((entry) => !entry.disabled && entry.value === options[choice.key])) {
      draftSelections.set(id, { type: type.value, options });
      renderDrafts();
      onItemsChanged();
      return true;
    }
    draftSelections.delete(id);
    selectingDraft = id;
    try {
      const result = selectType?.(type.value, options);
      if (result?.completion && typeof result.cancel === 'function') {
        const pending = { ...result, type: type.value };
        pendingDrafts.set(id, pending);
        const finish = () => {
          if (pendingDrafts.get(id) !== pending) return;
          pendingDrafts.delete(id);
          removeDraft(id);
        };
        Promise.resolve(result.completion).then(finish, (error) => { finish(); onError?.(error); });
        return true;
      }
      if (result === true) removeDraft(id, { notify: false });
      else if (presetDrafts.has(id)) removeDraft(id, { notify: false });
      else select.value = '';
      return result === true;
    } finally {
      selectingDraft = '';
      renderDrafts();
      onItemsChanged();
    }
  }
  eventRouter.bind(root, 'change', (event) => {
    try {
      const choiceId = event.target?.dataset?.animationDraftChoice;
      const selection = draftSelections.get(choiceId);
      if (selection) {
        const choice = getTypes().find((entry) => entry.value === selection.type)?.choice;
        if (choice) chooseType(choiceId, selection.type, { ...selection.options, [choice.key]: event.target.value });
      } else chooseType(event.target?.dataset?.animationDraftType, event.target?.value);
    } finally { changingCardId = ''; }
  });
  function sync({ reset = false, changedId = changingCardId } = {}) {
    const cards = [...root.querySelectorAll('.animation-list > [data-animation-card-id]')];
    const nextIds = new Set(cards.map((card) => card.dataset.animationCardId));
    const added = !reset && cardIds
      ? cards.filter((card) => !cardIds.has(card.dataset.animationCardId)).at(-1) : null;
    // Completing a draft is an edit of that visible card. A new model ID alone
    // must not replay attention when the replacement stays in the same place.
    const replacesDraft = added && selectingDraft && cardIds?.has(selectingDraft);
    const draftOrder = replacesDraft ? [...cardIds].filter((id) => id === selectingDraft || nextIds.has(id)) : [];
    const replacementOrder = replacesDraft ? cards.filter((card) => card === added
      || (card.dataset.animationCardId !== selectingDraft && cardIds.has(card.dataset.animationCardId))) : [];
    const addedMoved = !replacesDraft || draftOrder.indexOf(selectingDraft) !== replacementOrder.indexOf(added);
    const previousOrder = [...(cardIds ?? [])].filter((id) => nextIds.has(id));
    const retainedCards = cards.filter((card) => cardIds?.has(card.dataset.animationCardId));
    const moved = !reset && changedId
      ? retainedCards.find((card, index) => card.dataset.animationCardId === changedId
        && previousOrder[index] !== changedId) : null;
    cardIds = nextIds;
    if (reset || (highlighted && !cards.includes(highlighted))) clearHighlight();
    const attentionTarget = (addedMoved && added) || moved;
    if (!attentionTarget) return false;
    return focusCard(attentionTarget);
  }
  function destroy() {
    clearHighlight();
    renderDrafts({ reset: true });
    cardIds = null;
    orderSyncByRoot.delete(root);
    eventRouter.destroy();
  }
  orderSyncByRoot.set(root, sync);
  return { sync, destroy, focusCard, renderDrafts, addDraft, draftCount: () => drafts.size - Number(drafts.has(selectingDraft)) };
}

export function animationEditorMarkup({ itemsMarkup = '', addAttributes = {}, canAdd = true, toolbarActions = [], headerMarkup = '', presentation = 'window' } = {}) {
  const content = `${headerMarkup}<div class="animation-toolbar">
    ${canAdd ? semanticActionButtonMarkup({ iconRole: 'add', label: 'Add animation', attributes: { ...addAttributes, 'data-animation-editor-action': 'add' } }) : ''}
    ${toolbarActions.map((action) => semanticActionButtonMarkup(action)).join('')}
    </div><div class="animation-list" data-floating-window-items>${itemsMarkup}</div>`;
  return presentation === 'sidebar'
    ? layoutTextEditorSectionMarkup({ label: 'Animation', attributes: { 'data-animation-editor-root': '' }, contentMarkup: `<div class="animation-tools bb-animation-editor">${content}</div>` })
    : `<div class="bb-animation-editor bb-property-editor bb-interface-controls" data-animation-editor-root>${content}</div>`;
}

export function animationRegionControlMarkup({ label = '', attributes = {} } = {}) {
  return `<div class="bb-animation-editor__region">
    ${semanticActionButtonMarkup({ iconRole: 'safe_area', label: 'Draw zone', iconOnly: false, attributes })}
    <span>${escapeHtml(label)}</span></div>`;
}

export function animationEffectParametersMarkup({ parameters = [], values = {}, attributes = {}, toolAttribute = '', namePrefix = 'effect', renderColorPalette } = {}) {
  return parameters.map((parameter) => parameter.type === 'color'
    ? colorPaletteSectionMarkup({ label: parameter.label, attributes: { ...attributes, 'data-animation-effect-color': parameter.name },
      paletteMarkup: renderColorPalette(parameter, values[parameter.name] ?? parameter.default) })
    : `<label>${escapeHtml(parameter.label)}
    <select name="${escapeHtml(`${namePrefix}-${parameter.name}`)}"${attributesMarkup({ ...attributes, [toolAttribute]: `effect:${parameter.name}` })}>
      ${parameter.options.map(([value, label]) => `<option value="${escapeHtml(value)}"${String(values[parameter.name] ?? parameter.default) === value ? ' selected' : ''}>${escapeHtml(label)}</option>`).join('')}
    </select></label>`).join('');
}
