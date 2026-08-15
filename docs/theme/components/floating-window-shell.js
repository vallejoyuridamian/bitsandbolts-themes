import { semanticIconMarkup } from './semantic-icons.js';

const WINDOW_CLASS = 'bb-floating-window';
const DRAG_BAR_CLASS = 'bb-floating-window__drag-bar';
const GRIP_CLASS = 'bb-floating-window__grip';
const CLOSE_CLASS = 'bb-floating-window__close bb-workspace-control-button bb-workspace-control-button--plain-icon';
const BODY_CLASS = 'bb-floating-window__body';

function escapeHtml(value = '') {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function closeContentMarkup(iconMarkup = semanticIconMarkup('close')) {
  return `<span class="bb-workspace-control-icon" aria-hidden="true">${iconMarkup}</span>`;
}

export function applyFloatingWindowRecipe({
  body,
  closeButton,
  closeIconMarkup = semanticIconMarkup('close'),
  closeLabel = 'Close window',
  dragBar,
  grip,
  node
}) {
  node.className = WINDOW_CLASS;
  dragBar.className = DRAG_BAR_CLASS;
  grip.className = GRIP_CLASS;
  closeButton.className = CLOSE_CLASS;
  closeButton.setAttribute('aria-label', closeLabel);
  closeButton.setAttribute('title', closeLabel);
  closeButton.innerHTML = closeContentMarkup(closeIconMarkup);
  body.className = BODY_CLASS;
}

export function floatingWindowShellMarkup({
  ariaLabel = 'Floating window',
  bodyMarkup = '',
  closeIconMarkup = semanticIconMarkup('close'),
  closeLabel = 'Close window',
  specimen = false
} = {}) {
  const specimenClass = specimen ? ' bb-floating-window--specimen' : '';
  const specimenAttributes = specimen
    ? ' data-floating-window-size="content" data-bb-floating-window-specimen'
    : '';
  const closeTabIndex = specimen ? ' tabindex="-1"' : '';
  return `<section class="${WINDOW_CLASS}${specimenClass}" aria-label="${escapeHtml(ariaLabel)}"${specimenAttributes}><div class="${DRAG_BAR_CLASS}"><span class="${GRIP_CLASS}" aria-hidden="true"></span><button class="${CLOSE_CLASS}" type="button" aria-label="${escapeHtml(closeLabel)}" title="${escapeHtml(closeLabel)}"${closeTabIndex}>${closeContentMarkup(closeIconMarkup)}</button></div><div class="${BODY_CLASS}">${bodyMarkup}</div></section>`;
}
