import { semanticActionButtonMarkup } from './button.js';
import { colorPaletteSectionMarkup, layoutTextEditorSectionMarkup } from './layout-text-editor.js';
export { orderedAnimationEntries, indexedAnimationLabel } from './animation-order.js';

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
  return `${placeholder ? '<option value="" disabled selected>Select type</option>' : ''}${options.map(({ value, label, disabled }) =>
    `<option value="${escapeHtml(value)}"${disabled ? ' disabled' : ''}>${escapeHtml(label)}</option>`).join('')}`;
}

export function syncAnimationCardOrder(root, orderedIds = []) {
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
  if (focusDisplaced && activeElement.isConnected !== false) activeElement.focus({ preventScroll: true });
  return { orderChanged, preserveFocusedDescendant, focusDisplaced,
    focusRestored: focusDisplaced && list.ownerDocument.activeElement === activeElement };
}

export function createAnimationEditorController({ root, eventRouter, reveal, getTypes = () => [], selectType, enhanceSelect, onItemsChanged = () => {} } = {}) {
  let cardIds = null;
  let highlighted = null;
  let nextDraftId = 0;
  let selectingDraft = '';
  const drafts = new Map();
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
      drafts.forEach((card) => card.remove());
      drafts.clear();
    }
    if (!drafts.size) return;
    const list = root.querySelector('.animation-list');
    drafts.forEach((card, id) => {
      if (id === selectingDraft) return;
      if (card.parentElement !== list) list.append(card);
      const select = card.querySelector('[data-animation-draft-type]');
      const options = animationTypeOptionsMarkup(getTypes(), { placeholder: true });
      if (draftOptions.get(select) !== options) {
        select.innerHTML = options;
        draftOptions.set(select, options);
      }
      enhanceSelect?.(select);
    });
  }
  function addDraft() {
    const list = root.querySelector('.animation-list');
    if (!list || !getTypes().length) return false;
    const id = `animation-draft-${++nextDraftId}`;
    const template = root.ownerDocument.createElement('template');
    template.innerHTML = animationCardMarkup({ id, attributes: { 'data-animation-draft': id },
      removeAttributes: { 'data-animation-draft-remove': id },
      contentMarkup: `<label>Type<select data-animation-draft-type="${id}">${animationTypeOptionsMarkup(getTypes(), { placeholder: true })}</select></label>` });
    drafts.set(id, template.content.firstElementChild);
    renderDrafts();
    onItemsChanged();
    return true;
  }
  function removeDraft(id, { notify = true } = {}) {
    const card = drafts.get(id);
    if (!card) return false;
    drafts.delete(id);
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
  eventRouter.bind(root, 'change', (event) => {
    const select = event.target;
    const id = select?.dataset?.animationDraftType;
    if (!drafts.has(id)) return;
    const type = getTypes().find(({ value, disabled }) => value === select.value && !disabled);
    if (!type) { select.value = ''; return; }
    selectingDraft = id;
    try {
      if (selectType?.(type.value) === true) removeDraft(id, { notify: false });
      else select.value = '';
    } finally {
      selectingDraft = '';
      renderDrafts();
      onItemsChanged();
    }
  });
  function sync({ reset = false } = {}) {
    const cards = [...root.querySelectorAll('.animation-list > [data-animation-card-id]')];
    const nextIds = new Set(cards.map((card) => card.dataset.animationCardId));
    const added = !reset && cardIds
      ? cards.filter((card) => !cardIds.has(card.dataset.animationCardId)).at(-1) : null;
    cardIds = nextIds;
    if (reset || (highlighted && !cards.includes(highlighted))) clearHighlight();
    if (!added) return false;
    return focusCard(added);
  }
  function destroy() {
    clearHighlight();
    renderDrafts({ reset: true });
    cardIds = null;
    eventRouter.destroy();
  }
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
