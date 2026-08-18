import { semanticIconMarkup } from './semantic-icons.js';

function escapeHtml(value = '') {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function headingMarkup({ backLabel = 'Back', description = '', id, showBack = false, title }) {
  const titleId = escapeHtml(`${id}Title`);
  const descriptionId = escapeHtml(`${id}Description`);
  const back = showBack
    ? `<button class="bb-account-funnel__back bb-workspace-control-button bb-workspace-control-button--plain-icon" type="button" aria-label="${escapeHtml(backLabel)}" title="${escapeHtml(backLabel)}" data-account-funnel-back><span class="bb-workspace-control-icon" aria-hidden="true">${semanticIconMarkup('arrow_back')}</span></button>`
    : '';
  return {
    describedBy: description ? ` aria-describedby="${descriptionId}"` : '',
    descriptionMarkup: description
      ? `<p id="${descriptionId}" class="bb-floating-window-content__copy bb-account-funnel__description">${escapeHtml(description)}</p>`
      : '',
    headingMarkup: `<header class="bb-floating-window-content__head bb-account-funnel__head">${back}<h2 id="${titleId}" class="bb-floating-window-content__title">${escapeHtml(title)}</h2></header>`,
    titleId
  };
}

function fieldMarkup(field = {}) {
  const id = escapeHtml(field.id);
  const errorId = `${id}Error`;
  const type = ['email', 'password', 'text'].includes(field.type) ? field.type : 'text';
  const autocomplete = field.autocomplete ? ` autocomplete="${escapeHtml(field.autocomplete)}"` : '';
  const required = field.required === false ? '' : ' required';
  const minimum = Number.isInteger(field.minLength) ? ` minlength="${field.minLength}"` : '';
  const input = `<input id="${id}" name="${escapeHtml(field.name || field.id)}" class="bb-field__input" type="${type}" aria-describedby="${errorId}"${autocomplete}${minimum}${required}>`;
  const control = type === 'password'
    ? `<span class="bb-field__input-wrap">${input}<button class="bb-field__eye" type="button" aria-label="Show ${escapeHtml(field.label)}" title="Show ${escapeHtml(field.label)}" aria-pressed="false" data-account-funnel-password-toggle><span aria-hidden="true" data-account-funnel-password-icon="show">${semanticIconMarkup('visibility')}</span><span aria-hidden="true" data-account-funnel-password-icon="hide" hidden>${semanticIconMarkup('visibility_off')}</span></button></span>`
    : input;
  const hint = field.hint ? `<p class="bb-field__hint">${escapeHtml(field.hint)}</p>` : '';
  return `<div class="bb-field" data-account-funnel-field="${id}"><label class="bb-field__label" for="${id}">${escapeHtml(field.label)}</label>${control}${hint}<p id="${errorId}" class="bb-field__error" role="alert" data-account-funnel-field-error hidden></p></div>`;
}

function footerMarkup({ cancelLabel = 'Keep editing', primaryLabel = 'Continue' } = {}) {
  return `<div class="bb-floating-window-content__actions bb-account-funnel__actions" role="group" aria-label="Account actions"><button class="bb-workspace-control-button" type="button" data-account-funnel-cancel>${escapeHtml(cancelLabel)}</button><button class="bb-workspace-control-button bb-account-funnel__primary" type="submit" data-account-funnel-submit>${escapeHtml(primaryLabel)}</button></div>`;
}

export function accountFunnelAccessMarkup({
  backLabel = 'Back',
  cancelLabel = 'Keep editing',
  consentLabel = '',
  creationActionLabel = '',
  creationPrompt = '',
  description = '',
  fields = [],
  googleLabel = '',
  googleLogoSrc = '',
  id = 'bbAccountFunnel',
  primaryLabel = 'Continue',
  recoveryLabel = '',
  showBack = false,
  step = 'access',
  title = 'Continue to your account'
} = {}) {
  const heading = headingMarkup({ backLabel, description, id, showBack, title });
  const google = googleLabel && googleLogoSrc
    ? `<button class="bb-google-btn" type="button" data-account-funnel-google><img class="bb-google-btn__icon" src="${escapeHtml(googleLogoSrc)}" alt=""><span class="bb-google-btn__label">${escapeHtml(googleLabel)}</span></button><div class="bb-divider"><span>or</span></div>`
    : '';
  const fieldsMarkup = fields.length
    ? `<div class="bb-form-fields">${fields.map(fieldMarkup).join('')}</div>`
    : '';
  const recovery = recoveryLabel
    ? `<button class="bb-link bb-account-funnel__recovery" type="button" data-account-funnel-recovery>${escapeHtml(recoveryLabel)}</button>`
    : '';
  const consent = consentLabel
    ? `<div class="bb-checkbox-field" data-account-funnel-consent-field><label class="bb-checkbox-field__label"><input class="bb-checkbox-field__control" type="checkbox" name="consent" aria-describedby="${escapeHtml(`${id}ConsentError`)}" data-account-funnel-consent><span class="bb-checkbox-field__text">${escapeHtml(consentLabel)}</span></label><p id="${escapeHtml(`${id}ConsentError`)}" class="bb-field__error" role="alert" data-account-funnel-consent-error hidden></p></div>`
    : '';
  const switchMarkup = creationPrompt && creationActionLabel
    ? `<p class="bb-account-funnel__switch"><span>${escapeHtml(creationPrompt)} </span><button class="bb-link bb-account-funnel__switch-action" type="button" data-account-funnel-create><strong>${escapeHtml(creationActionLabel)}</strong></button><span>.</span></p>`
    : '';
  return `<form class="bb-floating-window-content bb-account-funnel" data-floating-window-size="content" data-bb-account-funnel data-account-funnel-step="${escapeHtml(step)}" aria-labelledby="${heading.titleId}"${heading.describedBy} novalidate>${heading.headingMarkup}${heading.descriptionMarkup}<div class="bb-floating-window-content__body bb-account-funnel__body">${google}${fieldsMarkup}${recovery}${consent}${switchMarkup}</div><p class="bb-floating-form__error bb-account-funnel__error" role="alert" data-account-funnel-error hidden></p>${footerMarkup({ cancelLabel, primaryLabel })}</form>`;
}

export function accountFunnelPlanMarkup({
  backLabel = 'Back',
  cancelLabel = 'Keep editing',
  description = '',
  id = 'bbAccountPlan',
  plans = [],
  primaryLabel = 'Continue',
  selectedPlan = '',
  title = 'Choose your plan'
} = {}) {
  const heading = headingMarkup({ backLabel, description, id, showBack: true, title });
  const options = plans.map((plan) => {
    const value = escapeHtml(plan.value);
    const checked = String(plan.value) === String(selectedPlan) ? ' checked' : '';
    const badge = plan.badge ? `<span class="bb-account-funnel__plan-badge">${escapeHtml(plan.badge)}</span>` : '';
    return `<label class="bb-account-funnel__plan"><input type="radio" name="plan" value="${value}"${checked}><span class="bb-account-funnel__plan-copy"><span class="bb-account-funnel__plan-head"><strong>${escapeHtml(plan.label)}</strong><span>${escapeHtml(plan.price)}</span></span><span class="bb-account-funnel__plan-summary">${escapeHtml(plan.summary)}</span>${badge}</span></label>`;
  }).join('');
  return `<form class="bb-floating-window-content bb-account-funnel" data-floating-window-size="content" data-bb-account-funnel data-account-funnel-step="plan" aria-labelledby="${heading.titleId}"${heading.describedBy} novalidate>${heading.headingMarkup}${heading.descriptionMarkup}<div class="bb-floating-window-content__body bb-account-funnel__body"><div class="bb-account-funnel__plans" role="radiogroup" aria-label="Available plans">${options}</div></div><p class="bb-floating-form__error bb-account-funnel__error" role="alert" data-account-funnel-error hidden></p>${footerMarkup({ cancelLabel, primaryLabel })}</form>`;
}

export function accountFunnelStatusMarkup({
  actionLabel = 'Return to Studio',
  description = '',
  id = 'bbAccountStatus',
  kind = 'success',
  title = 'Account ready'
} = {}) {
  const heading = headingMarkup({ description, id, title });
  const iconRole = kind === 'processing' ? 'progress' : kind === 'error' ? 'warning' : 'check';
  return `<div class="bb-floating-window-content bb-account-funnel bb-account-funnel--status" data-floating-window-size="content" data-bb-account-funnel data-account-funnel-step="status" data-account-funnel-status="${escapeHtml(kind)}" aria-labelledby="${heading.titleId}"${heading.describedBy}>${heading.headingMarkup}${heading.descriptionMarkup}<div class="bb-floating-window-content__body bb-account-funnel__body"><div class="bb-account-funnel__status" role="status"><span class="bb-account-funnel__status-icon" aria-hidden="true">${semanticIconMarkup(iconRole)}</span></div></div><div class="bb-floating-window-content__actions bb-account-funnel__actions"><button class="bb-workspace-control-button bb-account-funnel__primary" type="button" data-account-funnel-finish>${escapeHtml(actionLabel)}</button></div></div>`;
}

export function accountFunnelMarkup(model = {}) {
  if (model.step === 'plan') return accountFunnelPlanMarkup(model);
  if (model.step === 'status') return accountFunnelStatusMarkup(model);
  return accountFunnelAccessMarkup(model);
}
