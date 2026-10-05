import { accountFunnelAccessMarkup } from './account-funnel.js';

function escapeHtml(value = '') {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function accountSessionActionMarkup({
  buttonLabel = 'Sign out',
  detail = '',
  label = 'Sign out'
} = {}) {
  return `<div class="bb-workspace-settings__row">
    <div class="bb-workspace-settings__row-copy">
      <strong class="bb-workspace-settings__row-label">${escapeHtml(label)}</strong>
      ${detail ? `<span class="bb-workspace-settings__row-detail">${escapeHtml(detail)}</span>` : ''}
    </div>
    <button class="bb-v2-button bb-v2-button--secondary bb-v2-button--small" type="button" data-account-logout>${escapeHtml(buttonLabel)}</button>
  </div>`;
}

export function accountSessionDeleteActionMarkup({
  buttonLabel = 'Delete account',
  detail = 'Permanently remove this account and its private content.',
  disabled = false,
  label = 'Delete account'
} = {}) {
  return `<div class="bb-workspace-settings__row">
    <div class="bb-workspace-settings__row-copy">
      <strong class="bb-workspace-settings__row-label">${escapeHtml(label)}</strong>
      ${detail ? `<span class="bb-workspace-settings__row-detail">${escapeHtml(detail)}</span>` : ''}
    </div>
    <button class="bb-v2-button bb-v2-button--destructive bb-v2-button--small" type="button" data-account-delete${disabled ? ' disabled' : ''}>${escapeHtml(buttonLabel)}</button>
  </div>`;
}

export function accountSessionMarkup({
  deleteAction = null,
  description = '',
  identityLabel = 'Signed in as',
  identityValue = '',
  title = 'Account'
} = {}) {
  return `<div class="bb-workspace-settings__inner">
    <header class="bb-workspace-settings__header">
      <h1 class="bb-workspace-settings__title">${escapeHtml(title)}</h1>
      ${description ? `<p class="bb-workspace-settings__description">${escapeHtml(description)}</p>` : ''}
    </header>
    <section class="bb-workspace-settings__section" aria-label="Account session">
      <div class="bb-workspace-settings__rows">
        <div class="bb-workspace-settings__row">
          <div class="bb-workspace-settings__row-copy"><strong class="bb-workspace-settings__row-label">${escapeHtml(identityLabel)}</strong></div>
          <span class="bb-workspace-settings__value">${escapeHtml(identityValue)}</span>
        </div>
        ${accountSessionActionMarkup()}
        ${deleteAction ? accountSessionDeleteActionMarkup(deleteAction) : ''}
      </div>
    </section>
    <p class="bb-workspace-settings__message bb-workspace-settings__message--danger" role="alert" data-account-session-error hidden></p>
  </div>`;
}

export function accountDeletionWindowMarkup({
  googleLogoSrc = '/theme/icons/google-logo.svg',
  methods = [],
  productName = 'this product'
} = {}) {
  const password = methods.includes('email_password');
  const google = methods.includes('google');
  if (!password && !google) throw new TypeError('Account deletion requires a linked sign-in method.');
  return accountFunnelAccessMarkup({
    cancelLabel: 'Cancel',
    description: 'Your projects, Themes, private assets and account will be permanently deleted. This cannot be undone.',
    fields: password ? [{ id: 'accountDeletionPassword', name: 'password', label: 'Password',
      type: 'password', autocomplete: 'current-password' }] : [],
    googleLabel: google ? 'Delete account with Google' : '', googleLogoSrc,
    id: 'accountDeletion', primaryDanger: true, primaryLabel: password ? 'Delete account' : '',
    step: 'deletion', title: `Delete your ${productName} account?`
  });
}
