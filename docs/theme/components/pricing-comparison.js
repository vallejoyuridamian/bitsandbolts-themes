import { buttonMarkup } from './button.js';
import { semanticIconMarkup } from './semantic-icons.js';
import { createInteractionRouter } from './page-event-scope.js';
const controllers = new WeakMap();

function escapeHtml(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

// The model contract is shared by markup admission and managed-site validation.
export function assertPricingComparisonModel(model) {
  const object = (value, allowed) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)
      || Object.keys(value).some(key => !allowed.includes(key))) {
      throw new TypeError('Pricing comparison contains an invalid object or unsupported field.');
    }
  };
  const text = value => {
    if (typeof value !== 'string' || !value.trim()) throw new TypeError('Pricing comparison requires nonempty text.');
  };
  const identifier = value => {
    text(value);
    if (!/^[a-z][a-z0-9-]*$/.test(value)) throw new TypeError('Pricing comparison has an invalid identifier.');
  };
  const selection = value => {
    object(value, ['id', 'label']); identifier(value.id); text(value.label);
  };
  object(model, ['component', 'id', 'billing', 'cards', 'notes']);
  if (model.component !== 'pricing-comparison') throw new TypeError('Unsupported pricing comparison component.');
  identifier(model.id);
  object(model.billing, ['label', 'value', 'options']);
  text(model.billing.label);
  if (!Array.isArray(model.billing.options) || model.billing.options.length < 2) throw new TypeError('Pricing comparison requires billing choices.');
  const choices = new Set();
  for (const option of model.billing.options) {
    object(option, ['id', 'label']); identifier(option.id); text(option.label);
    if (choices.has(option.id)) throw new TypeError('Duplicate billing choice.');
    choices.add(option.id);
  }
  if (!choices.has(model.billing.value)) throw new TypeError('Initial billing choice is unavailable.');
  if (!Array.isArray(model.cards) || model.cards.length !== 3) throw new TypeError('Pricing comparison requires three offers.');
  const ids = new Set();
  let variableOffers = 0;
  for (const card of model.cards) {
    object(card, ['id', 'title', 'price', 'support', 'cadence', 'variants', 'recommended', 'features', 'action']);
    identifier(card.id); text(card.title);
    if (ids.has(card.id)) throw new TypeError('Duplicate offer identifier.');
    ids.add(card.id);
    if (card.cadence !== undefined) text(card.cadence);
    if (card.recommended !== undefined && typeof card.recommended !== 'boolean') throw new TypeError('Invalid offer emphasis.');
    if (card.variants) {
      if (card.price !== undefined || card.support !== undefined) throw new TypeError('Billing variants exclusively own offer prices and disclosures.');
      object(card.variants, [...choices]);
      for (const choice of choices) {
        object(card.variants[choice], ['price', 'support', 'selection']);
        if (card.variants[choice].selection !== undefined) selection(card.variants[choice].selection);
        text(card.variants[choice].price); text(card.variants[choice].support);
      }
      variableOffers++;
    } else { text(card.price); text(card.support); }
    if (!Array.isArray(card.features) || !card.features.length) throw new TypeError('Offer benefits are required.');
    card.features.forEach(text);
    object(card.action, ['label', 'href', 'disabled', 'emphasis', 'noticeId', 'selection']);
    text(card.action.label);
    if (card.action.selection !== undefined) selection(card.action.selection);
    if (!['primary', 'secondary'].includes(card.action.emphasis)) throw new TypeError('Invalid CTA hierarchy.');
    if (card.action.href !== undefined) {
      if (card.action.disabled !== undefined || !/^\/(?!\/)[a-z0-9/_-]*$/.test(card.action.href)) throw new TypeError('Offer actions require a safe site path.');
    } else if (card.action.disabled !== true) throw new TypeError('Unavailable offer actions must be disabled.');
    if (card.action.noticeId !== undefined) identifier(card.action.noticeId);
  }
  if (!variableOffers) throw new TypeError('The billing selector requires an offer with variants.');
  if (!Array.isArray(model.notes)) throw new TypeError('Pricing notes must be an array.');
  const noteIds = new Set();
  for (const note of model.notes) {
    object(note, ['id', 'text']); text(note.text);
    if (note.id !== undefined) {
      identifier(note.id);
      if (noteIds.has(note.id)) throw new TypeError('Duplicate pricing note.');
      noteIds.add(note.id);
    }
  }
  if (model.cards.some(card => card.action.noticeId && !noteIds.has(card.action.noticeId))) throw new TypeError('CTA availability notice is missing.');
  return model;
}

// Consumers own offer/content data. This is a site-page component, not an app control.
export function pricingComparisonMarkup(input) {
  const { id, billing, cards, notes } = assertPricingComparisonModel(input);
  const variants = {};
  const selections = {};
  const variantIds = cards.filter(card => card.variants).map(card => `${id}-${card.id}`);
  const cardMarkup = cards.map(card => {
    if (card.variants) {
      variants[card.id] = card.variants;
    }
    const offer = card.variants ? card.variants[billing.value] : card;
    const variable = Boolean(card.variants);
    if (card.action.selection) selections[card.id] = card.action.selection;
    const preview = Boolean(card.action.selection || offer.selection);
    const primary = card.action.emphasis === 'primary';
    const action = buttonMarkup({
      label: card.action.label, href: card.action.href, disabled: card.action.disabled,
      appearance: primary ? 'filled' : 'neutral', bold: primary,
      preserveDisabledEmphasis: primary,
      attributes: { ...(card.action.noticeId ? { 'aria-describedby': card.action.noticeId } : {}),
        ...(preview ? { 'data-pricing-preview-action': card.id } : {}) }
    });
    return `<article class="bb-price-card bb-price-card--neutral${card.recommended ? ' bb-price-card--recommended' : ''}" id="${escapeHtml(id)}-${escapeHtml(card.id)}" data-pricing-card="${escapeHtml(card.id)}">
      <div class="bb-price-card__headline">
        <h3>${escapeHtml(card.title)}</h3>
        <div class="bb-price-card__price"${variable ? ' aria-live="polite" aria-atomic="true"' : ''}>
          <div class="bb-price bb-price--inline"><strong${variable ? ' data-pricing-price' : ''}>${escapeHtml(offer.price)}</strong>${card.cadence ? `<span>${escapeHtml(card.cadence)}</span>` : ''}</div>
          <p class="bb-price-card__support"${variable ? ' data-pricing-disclosure' : ''}>${escapeHtml(offer.support)}</p>
        </div>
      </div>
      <ul class="bb-price-card__benefits">${card.features.map(feature => `<li>${semanticIconMarkup('check')}<span>${escapeHtml(feature)}</span></li>`).join('')}</ul>
      <div class="bb-price-card__action">${action}</div>
    </article>`;
  }).join('\n');
  return `<div class="bb-pricing-comparison" data-bb-pricing-comparison data-billing="${escapeHtml(billing.value)}">
    <div class="bb-pricing-comparison__billing">
      <div class="bb-segmented-control bb-segmented-control--large" role="group" aria-label="${escapeHtml(billing.label)}">
        ${billing.options.map(option => `<button type="button" class="bb-segmented-control__item${option.id === billing.value ? ' active' : ''}" data-pricing-billing="${escapeHtml(option.id)}" aria-pressed="${option.id === billing.value}" aria-controls="${escapeHtml(variantIds.join(' '))}">${escapeHtml(option.label)}</button>`).join('\n')}
      </div>
    </div>
    <div class="bb-pricing-grid">${cardMarkup}</div>
    <div class="bb-pricing-comparison__notes">${notes.map(note => `<p class="bb-note"${note.id ? ` id="${escapeHtml(note.id)}"` : ''}>${escapeHtml(note.text)}</p>`).join('\n')}</div>
    <script type="application/json" data-pricing-offers>${JSON.stringify({ value: billing.value, variants, selections }).replaceAll('<', '\\u003c')}</script>
  </div>`;
}

export function createPricingComparisonController({ root, onSelect = () => {} }) {
  if (controllers.has(root)) {
    const existing = controllers.get(root); existing.subscribe(onSelect); return existing;
  }
  const listeners = new Set([onSelect]);
  const { value, variants, selections = {} } = JSON.parse(root.querySelector('[data-pricing-offers]').textContent);
  const buttons = [...root.querySelectorAll('[data-pricing-billing]')];
  const targets = Object.entries(variants).map(([id, offers]) => {
    const card = root.querySelector(`[data-pricing-card="${id}"]`);
    return { offers, price: card.querySelector('[data-pricing-price]'), disclosure: card.querySelector('[data-pricing-disclosure]') };
  });
  if (root.dataset.billing !== value || !targets.length) {
    throw new TypeError('Pricing comparison requires its initial billing model.');
  }
  const selectBilling = billing => {
    if (!targets.every(target => Object.hasOwn(target.offers, billing)) || root.dataset.billing === billing) return;
    const startedAt = performance.now();
    root.dataset.billing = billing;
    for (const target of targets) {
      target.price.textContent = target.offers[billing].price;
      target.disclosure.textContent = target.offers[billing].support;
    }
    for (const item of buttons) {
      const selected = item.dataset.pricingBilling === billing;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    }
    for (const listener of listeners) listener({ billing, durationMs: Math.round((performance.now() - startedAt) * 10) / 10 });
  };
  const events = createInteractionRouter({ label: 'pricing-comparison' });
  events.bind(root, 'click', event => {
    const button = event.target.closest('[data-pricing-billing]');
    if (button && root.contains(button)) selectBilling(button.dataset.pricingBilling);
  });
  const selectionFor = cardId => variants[cardId]?.[root.dataset.billing]?.selection || selections[cardId] || null;
  const selectionById = id => {
    for (const [cardId, selection] of Object.entries(selections)) if (selection.id === id) return { ...selection, cardId };
    for (const [cardId, offers] of Object.entries(variants)) {
      for (const [billing, offer] of Object.entries(offers)) if (offer.selection?.id === id) return { ...offer.selection, cardId, billing };
    }
    return null;
  };
  const controller = { selectBilling, selectionFor, selectionById,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    dispose() { events.destroy(); listeners.clear(); controllers.delete(root); }
  };
  controllers.set(root, controller);
  return controller;
}
