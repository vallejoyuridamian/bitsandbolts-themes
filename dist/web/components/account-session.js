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

export function accountSessionMarkup({
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
      </div>
    </section>
    <p class="bb-workspace-settings__message bb-workspace-settings__message--danger" role="alert" data-account-session-error hidden></p>
  </div>`;
}
