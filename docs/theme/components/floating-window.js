function escapeHtml(value = '') {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export function floatingWindowConfirmationMarkup({
  cancelLabel = 'Cancel',
  confirmDanger = false,
  confirmLabel = 'Confirm',
  description = '',
  id = 'bbFloatingConfirmation',
  specimen = false,
  title = 'Confirm action'
} = {}) {
  const titleId = escapeHtml(`${id}Title`);
  const descriptionId = escapeHtml(`${id}Description`);
  const danger = confirmDanger ? ' bb-workspace-control-button--danger' : '';
  const tabIndex = specimen ? ' tabindex="-1"' : '';
  const confirmType = specimen ? 'button' : 'submit';
  return `<form class="bb-floating-confirm" data-floating-window-size="content" data-bb-confirm aria-labelledby="${titleId}" aria-describedby="${descriptionId}"><header class="bb-floating-confirm__head"><h2 id="${titleId}" class="bb-floating-confirm__title">${escapeHtml(title)}</h2></header><p id="${descriptionId}" class="bb-floating-confirm__copy">${escapeHtml(description)}</p><div class="bb-floating-confirm__actions" role="group" aria-label="Confirmation actions"><button class="bb-workspace-control-button" type="button" data-bb-confirm-cancel${tabIndex}>${escapeHtml(cancelLabel)}</button><button class="bb-workspace-control-button${danger}" type="${confirmType}" data-bb-confirm-submit${tabIndex}>${escapeHtml(confirmLabel)}</button></div></form>`;
}
