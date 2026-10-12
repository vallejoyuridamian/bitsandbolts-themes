export function bindAccountPasswordVisibility(router, form) {
  form.querySelectorAll?.('[data-account-funnel-password-toggle]').forEach((button) => {
    router.bind(button, 'click', (event) => {
      event.preventDefault?.();
      const input = button.closest?.('.bb-field__input-wrap')?.querySelector?.('input');
      if (!input) return;
      const nextVisible = input.type !== 'text';
      input.type = nextVisible ? 'text' : 'password';
      button.querySelector?.('[data-account-funnel-password-icon="show"]')?.toggleAttribute?.('hidden', nextVisible);
      button.querySelector?.('[data-account-funnel-password-icon="hide"]')?.toggleAttribute?.('hidden', !nextVisible);
      button.setAttribute?.('aria-pressed', String(nextVisible));
      const label = `${nextVisible ? 'Hide' : 'Show'} ${input.closest?.('.bb-field')?.querySelector?.('.bb-field__label')?.textContent || 'password'}`;
      button.setAttribute?.('aria-label', label);
      button.setAttribute?.('title', label);
    });
  });
}

export function showError(form, message = '') {
  const error = form?.querySelector?.('[data-account-funnel-error]');
  if (!error) return;
  error.textContent = String(message || '');
  error.hidden = !message;
}
export function clearFieldError(input) {
  const field = input?.closest?.('[data-account-funnel-field]');
  const error = field?.querySelector?.('[data-account-funnel-field-error]');
  field?.classList?.remove?.('bb-field--error');
  input?.removeAttribute?.('aria-invalid');
  if (error) { error.textContent = ''; error.hidden = true; }
}
export function showFieldError(form, name, message) {
  const input = form?.querySelector?.(`[name="${name}"]`);
  const field = input?.closest?.('[data-account-funnel-field]');
  const error = field?.querySelector?.('[data-account-funnel-field-error]');
  if (!input || !field || !error) return false;
  field.classList?.add?.('bb-field--error');
  input.setAttribute?.('aria-invalid', 'true');
  error.textContent = String(message || ''); error.hidden = false;
  input.focus?.(); return true;
}
export function clearConsentError(form) {
  const field = form?.querySelector?.('[data-account-funnel-consent-field]');
  const input = field?.querySelector?.('[data-account-funnel-consent]');
  const error = field?.querySelector?.('[data-account-funnel-consent-error]');
  field?.classList?.remove?.('bb-checkbox-field--error');
  input?.removeAttribute?.('aria-invalid');
  if (error) { error.textContent = ''; error.hidden = true; }
}
export function showConsentError(form, message) {
  const field = form?.querySelector?.('[data-account-funnel-consent-field]');
  const input = field?.querySelector?.('[data-account-funnel-consent]');
  const error = field?.querySelector?.('[data-account-funnel-consent-error]');
  if (!field || !input || !error) return false;
  field.classList?.add?.('bb-checkbox-field--error');
  input.setAttribute?.('aria-invalid', 'true');
  error.textContent = String(message || ''); error.hidden = false;
  input.focus?.(); return true;
}
export function clearValidationErrors(form) {
  form?.querySelectorAll?.('[data-account-funnel-field] input').forEach(clearFieldError);
  clearConsentError(form); showError(form);
}
export function setPending(form, pending, pendingLabel = 'Continuing') {
  if (!form) return;
  form.setAttribute?.('aria-busy', String(Boolean(pending)));
  form.querySelectorAll?.('button, input').forEach(control => { control.disabled = Boolean(pending); });
  const submit = form.querySelector?.('[data-account-funnel-submit]');
  if (!submit) return;
  submit.dataset.accountFunnelLabel ||= submit.textContent;
  submit.textContent = pending ? pendingLabel : submit.dataset.accountFunnelLabel;
}
export function bindAccountFieldErrors(events, form) {
  form.querySelectorAll?.('[data-account-funnel-field] input').forEach(input => {
    events.bind(input, 'input', () => { clearFieldError(input); showError(form); });
  });
}
