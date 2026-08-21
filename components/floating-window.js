import { semanticIconMarkup } from './semantic-icons.js';

function escapeHtml(value = '') {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function floatingWindowHeadingMarkup({ description = '', id, title }) {
  const titleId = escapeHtml(`${id}Title`);
  const descriptionId = escapeHtml(`${id}Description`);
  const descriptionMarkup = description
    ? `<p id="${descriptionId}" class="bb-floating-window-content__copy">${escapeHtml(description)}</p>`
    : '';
  return {
    describedBy: description ? ` aria-describedby="${descriptionId}"` : '',
    descriptionMarkup,
    headingMarkup: `<header class="bb-floating-window-content__head"><h2 id="${titleId}" class="bb-floating-window-content__title">${escapeHtml(title)}</h2></header>`,
    titleId
  };
}

export function floatingWindowPanelMarkup({
  contentMarkup = '',
  description = '',
  id = 'bbFloatingPanel',
  size = 'default',
  title = 'Window'
} = {}) {
  const heading = floatingWindowHeadingMarkup({ description, id, title });
  const sizeAttribute = size === 'content' ? ' data-floating-window-size="content"' : '';
  return `<div class="bb-floating-window-content bb-floating-panel"${sizeAttribute} aria-labelledby="${heading.titleId}"${heading.describedBy}>${heading.headingMarkup}${heading.descriptionMarkup}<div class="bb-floating-window-content__body" data-bb-floating-window-content-body>${contentMarkup}</div></div>`;
}

export function floatingWindowFormMarkup({
  backLabel = 'Back',
  cancelDanger = false,
  cancelLabel = 'Cancel',
  confirmDanger = false,
  confirmLabel = 'Confirm',
  description = '',
  fieldsMarkup = '',
  id = 'bbFloatingForm',
  showBack = false,
  specimen = false,
  title = 'Complete form'
} = {}) {
  const heading = floatingWindowHeadingMarkup({ description, id, title });
  const tabIndex = specimen ? ' tabindex="-1"' : '';
  const backMarkup = showBack
    ? `<button class="bb-floating-form__back bb-workspace-control-button bb-workspace-control-button--plain-icon" type="button" aria-label="${escapeHtml(backLabel)}" title="${escapeHtml(backLabel)}" data-bb-floating-form-back${tabIndex}><span class="bb-workspace-control-icon" aria-hidden="true">${semanticIconMarkup('arrow_back')}</span></button>`
    : '';
  const cancelClass = cancelDanger ? ' bb-workspace-control-button--danger' : '';
  const confirmClass = confirmDanger ? ' bb-workspace-control-button--danger' : '';
  const headingMarkup = heading.headingMarkup.replace(
    '<header class="bb-floating-window-content__head">',
    `<header class="bb-floating-window-content__head bb-floating-form__head">${backMarkup}`
  );
  return `<form class="bb-floating-window-content bb-floating-form" data-floating-window-size="content" data-bb-floating-form aria-labelledby="${heading.titleId}"${heading.describedBy}>${headingMarkup}${heading.descriptionMarkup}<div class="bb-floating-window-content__body bb-floating-form__fields" data-bb-floating-form-fields>${fieldsMarkup}</div><div class="bb-floating-form__error" data-bb-floating-form-error role="alert" hidden></div><div class="bb-floating-window-content__actions" role="group" aria-label="Form actions"><button class="bb-workspace-control-button${cancelClass}" type="button" data-bb-floating-form-cancel${tabIndex}>${escapeHtml(cancelLabel)}</button><button class="bb-workspace-control-button${confirmClass}" type="${specimen ? 'button' : 'submit'}" data-bb-floating-form-submit${tabIndex}>${escapeHtml(confirmLabel)}</button></div></form>`;
}

export function floatingWindowConfirmationMarkup({
  cancelLabel = 'Cancel',
  confirmDanger = false,
  confirmLabel = 'Confirm',
  description = '',
  id = 'bbFloatingConfirmation',
  secondaryDanger = false,
  secondaryLabel = '',
  specimen = false,
  title = 'Confirm action'
} = {}) {
  const heading = floatingWindowHeadingMarkup({ description, id, title });
  const danger = confirmDanger ? ' bb-workspace-control-button--danger' : '';
  const secondaryDangerClass = secondaryDanger ? ' bb-workspace-control-button--danger' : '';
  const tabIndex = specimen ? ' tabindex="-1"' : '';
  const confirmType = specimen ? 'button' : 'submit';
  const secondaryMarkup = secondaryLabel
    ? `<button class="bb-workspace-control-button${secondaryDangerClass}" type="button" data-bb-confirm-secondary${tabIndex}>${escapeHtml(secondaryLabel)}</button>`
    : '';
  const headingMarkup = heading.headingMarkup
    .replace('bb-floating-window-content__head', 'bb-floating-window-content__head bb-floating-confirm__head')
    .replace('bb-floating-window-content__title', 'bb-floating-window-content__title bb-floating-confirm__title');
  const descriptionMarkup = heading.descriptionMarkup.replace(
    'bb-floating-window-content__copy',
    'bb-floating-window-content__copy bb-floating-confirm__copy'
  );
  return `<form class="bb-floating-window-content bb-floating-confirm" data-floating-window-size="content" data-bb-confirm aria-labelledby="${heading.titleId}"${heading.describedBy}>${headingMarkup}${descriptionMarkup}<div class="bb-floating-window-content__actions bb-floating-confirm__actions" role="group" aria-label="Confirmation actions"><button class="bb-workspace-control-button" type="button" data-bb-confirm-cancel${tabIndex}>${escapeHtml(cancelLabel)}</button>${secondaryMarkup}<button class="bb-workspace-control-button${danger}" type="${confirmType}" data-bb-confirm-submit${tabIndex}>${escapeHtml(confirmLabel)}</button></div></form>`;
}
