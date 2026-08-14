import { buttonMarkup } from './button.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function externalAttributes(model = {}) {
  return model.external ? ' target="_blank" rel="noopener noreferrer"' : '';
}

function vectorIcon(name, className = '', label = '') {
  const accessibility = label
    ? ` role="img" aria-label="${escapeHtml(label)}"`
    : ' aria-hidden="true"';
  return `<span class="bb-vector-icon${className ? ` ${className}` : ''}" data-bb-icon="${escapeHtml(name)}"${accessibility}></span>`;
}

function richMarkup(segments = []) {
  return segments.map((segment) => {
    if (typeof segment === 'string') return escapeHtml(segment);
    if (segment?.kind === 'strong') return `<strong>${escapeHtml(segment.text)}</strong>`;
    if (segment?.kind === 'emphasis') return `<em>${escapeHtml(segment.text)}</em>`;
    if (segment?.kind === 'code') return `<code>${escapeHtml(segment.text)}</code>`;
    if (segment?.kind === 'icon') {
      return vectorIcon(segment.icon, 'bb-content-section__inline-icon', segment.label);
    }
    if (segment?.kind === 'link') {
      const indicator = segment.indicator === 'external-link'
        ? vectorIcon('external-link', 'bb-inline-text-link__icon')
        : '';
      return `<a class="bb-inline-text-link" href="${escapeHtml(segment.href)}"${externalAttributes(segment)}>${escapeHtml(segment.text)}${indicator}</a>`;
    }
    return '';
  }).join('');
}

function mediaPosition(model, item, index) {
  if (item.mediaPosition === 'start' || item.mediaPosition === 'end') return item.mediaPosition;
  if (model.mediaFlow === 'alternate-end-first') return index % 2 === 0 ? 'end' : 'start';
  if (model.mediaFlow === 'alternate-start-first') return index % 2 === 0 ? 'start' : 'end';
  return 'start';
}

function mediaCopyItem(model, item, index) {
  const position = mediaPosition(model, item, index);
  const title = item.title ? `<h3>${escapeHtml(item.title)}</h3>` : '';
  const action = item.action
    ? `<div class="bb-content-section__action">${buttonMarkup(item.action)}</div>`
    : '';
  const panelClass = model.appearance === 'panel' ? ' bb-information-panel' : '';
  return `<article class="bb-media-copy bb-media-copy--${escapeHtml(model.appearance)}${position === 'end' ? ' bb-media-copy--media-end' : ''}">
            <div class="bb-media-copy__row">
              <div class="bb-media-copy__media">
                <img src="${escapeHtml(item.media.src)}" alt="${escapeHtml(item.media.alt)}" loading="lazy" />
              </div>
              <div class="bb-media-copy__copy${panelClass}">
                ${title}
                <p>${richMarkup(item.body)}</p>
              </div>
            </div>
            ${action}
          </article>`;
}

export function mediaCopyListMarkup(model = {}) {
  let itemIndex = 0;
  const groups = (model.groups ?? []).map((group) => {
    const items = (group.items ?? []).map((item) => {
      const markup = mediaCopyItem(model, item, itemIndex);
      itemIndex += 1;
      return markup;
    }).join('\n          ');
    return `<div class="bb-media-copy-list__group">
          ${items}
        </div>`;
  }).join('\n        ');
  return `<section class="bb-media-copy-list bb-media-copy-list--${escapeHtml(model.appearance)}" aria-label="${escapeHtml(model.label ?? 'Media and copy')}">
        ${groups}
      </section>`;
}

const MILESTONE_ICONS = Object.freeze({
  idea: Object.freeze([384, 512, 'M272 384c9.6-31.9 29.5-59.1 49.2-86.2c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4c19.8 27.1 39.7 54.4 49.2 86.2l160 0zM192 512c44.2 0 80-35.8 80-80l0-16-160 0 0 16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z']),
  call: Object.freeze([512, 512, 'M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z']),
  agreement: Object.freeze([640, 512, 'M323.4 85.2l-96.8 78.4c-16.1 13-19.2 36.4-7 53.1c12.9 17.8 38 21.3 55.3 7.8l99.3-77.2c7-5.4 17-4.2 22.5 2.8s4.2 17-2.8 22.5l-20.9 16.2L512 316.8 512 128l-.7 0-3.9-2.5L434.8 79c-15.3-9.8-33.2-15-51.4-15c-21.8 0-43 7.5-60 21.2zm22.8 124.4l-51.7 40.2C263 274.4 217.3 268 193.7 235.6c-22.2-30.5-16.6-73.1 12.7-96.8l83.2-67.3c-11.6-4.9-24.1-7.4-36.8-7.4C234 64 215.7 69.6 200 80l-72 48 0 224 28.2 0 91.4 83.4c19.6 17.9 49.9 16.5 67.8-3.1c5.5-6.1 9.2-13.2 11.1-20.6l17 15.6c19.5 17.9 49.9 16.6 67.8-2.9c4.5-4.9 7.8-10.6 9.9-16.5c19.4 13 45.8 10.3 62.1-7.5c17.9-19.5 16.6-49.9-2.9-67.8l-134.2-123zM16 128c-8.8 0-16 7.2-16 16L0 352c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-224-80 0zM48 320a16 16 0 1 1 0 32 16 16 0 1 1 0-32zM544 128l0 224c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-208c0-8.8-7.2-16-16-16l-80 0zm32 208a16 16 0 1 1 32 0 16 16 0 1 1-32 0z']),
  analysis: Object.freeze([512, 512, 'M184 0c30.9 0 56 25.1 56 56l0 400c0 30.9-25.1 56-56 56c-28.9 0-52.7-21.9-55.7-50.1c-5.2 1.4-10.7 2.1-16.3 2.1c-35.3 0-64-28.7-64-64c0-7.4 1.3-14.6 3.6-21.2C21.4 367.4 0 338.2 0 304c0-31.9 18.7-59.5 45.8-72.3C37.1 220.8 32 207 32 192c0-30.7 21.6-56.3 50.4-62.6C80.8 123.9 80 118 80 112c0-29.9 20.6-55.1 48.3-62.1C131.3 21.9 155.1 0 184 0zM328 0c28.9 0 52.6 21.9 55.7 49.9c27.8 7 48.3 32.1 48.3 62.1c0 6-.8 11.9-2.4 17.4c28.8 6.2 50.4 31.9 50.4 62.6c0 15-5.1 28.8-13.8 39.7C493.3 244.5 512 272.1 512 304c0 34.2-21.4 63.4-51.6 74.8c2.3 6.6 3.6 13.8 3.6 21.2c0 35.3-28.7 64-64 64c-5.6 0-11.1-.7-16.3-2.1c-3 28.2-26.8 50.1-55.7 50.1c-30.9 0-56-25.1-56-56l0-400c0-30.9 25.1-56 56-56z']),
  settings: Object.freeze([512, 512, 'M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z']),
  design: Object.freeze([576, 512, 'M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z']),
  build: Object.freeze([576, 512, 'M413.5 237.5c-28.2 4.8-58.2-3.6-80-25.4l-38.1-38.1C280.4 159 272 138.8 272 117.6l0-12.1L192.3 62c-5.3-2.9-8.6-8.6-8.3-14.7s3.9-11.5 9.5-14l47.2-21C259.1 4.2 279 0 299.2 0l18.1 0c36.7 0 72 14 98.7 39.1l44.6 42c24.2 22.8 33.2 55.7 26.6 86L503 183l8-8c9.4-9.4 24.6-9.4 33.9 0l24 24c9.4 9.4 9.4 24.6 0 33.9l-88 88c-9.4 9.4-24.6 9.4-33.9 0l-24-24c-9.4-9.4-9.4-24.6 0-33.9l8-8-17.5-17.5zM27.4 377.1L260.9 182.6c3.5 4.9 7.5 9.6 11.8 14l38.1 38.1c6 6 12.4 11.2 19.2 15.7L134.9 484.6c-14.5 17.4-36 27.4-58.6 27.4C34.1 512 0 477.8 0 435.7c0-22.6 10.1-44.1 27.4-58.6z']),
  firmware: Object.freeze([512, 512, 'M176 24c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c-35.3 0-64 28.7-64 64l-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0 0 56-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0 0 56-40 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l40 0c0 35.3 28.7 64 64 64l0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40 56 0 0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40 56 0 0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40c35.3 0 64-28.7 64-64l40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0 0-56 40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0 0-56 40 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-40 0c0-35.3-28.7-64-64-64l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40-56 0 0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40-56 0 0-40zM160 128l192 0c17.7 0 32 14.3 32 32l0 192c0 17.7-14.3 32-32 32l-192 0c-17.7 0-32-14.3-32-32l0-192c0-17.7 14.3-32 32-32zm192 32l-192 0 0 192 192 0 0-192z']),
  mobile: Object.freeze([384, 512, 'M16 64C16 28.7 44.7 0 80 0L304 0c35.3 0 64 28.7 64 64l0 384c0 35.3-28.7 64-64 64L80 512c-35.3 0-64-28.7-64-64L16 64zM144 448c0 8.8 7.2 16 16 16l64 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-64 0c-8.8 0-16 7.2-16 16zM304 64L80 64l0 320 224 0 0-320z']),
  launch: Object.freeze([512, 512, 'M156.6 384.9L125.7 354c-8.5-8.5-11.5-20.8-7.7-32.2c3-8.9 7-20.5 11.8-33.8L24 288c-8.6 0-16.6-4.6-20.9-12.1s-4.2-16.7 .2-24.1l52.5-88.5c13-21.9 36.5-35.3 61.9-35.3l82.3 0c2.4-4 4.8-7.7 7.2-11.3C289.1-4.1 411.1-8.1 483.9 5.3c11.6 2.1 20.6 11.2 22.8 22.8c13.4 72.9 9.3 194.8-111.4 276.7c-3.5 2.4-7.3 4.8-11.3 7.2l0 82.3c0 25.4-13.4 49-35.3 61.9l-88.5 52.5c-7.4 4.4-16.6 4.5-24.1 .2s-12.1-12.2-12.1-20.9l0-107.2c-14.1 4.9-26.4 8.9-35.7 11.9c-11.2 3.6-23.4 .5-31.8-7.8zM384 168a40 40 0 1 0 0-80 40 40 0 1 0 0 80z']),
  global: Object.freeze([512, 512, 'M57.7 193l9.4 16.4c8.3 14.5 21.9 25.2 38 29.8L163 255.7c17.2 4.9 29 20.6 29 38.5l0 39.9c0 11 6.2 21 16 25.9s16 14.9 16 25.9l0 39c0 15.6 14.9 26.9 29.9 22.6c16.1-4.6 28.6-17.5 32.7-33.8l2.8-11.2c4.2-16.9 15.2-31.4 30.3-40l8.1-4.6c15-8.5 24.2-24.5 24.2-41.7l0-8.3c0-12.7-5.1-24.9-14.1-33.9l-3.9-3.9c-9-9-21.2-14.1-33.9-14.1L257 256c-11.1 0-22.1-2.9-31.8-8.4l-34.5-19.7c-4.3-2.5-7.6-6.5-9.2-11.2c-3.2-9.6 1.1-20 10.2-24.5l5.9-3c6.6-3.3 14.3-3.9 21.3-1.5l23.2 7.7c8.2 2.7 17.2-.4 21.9-7.5c4.7-7 4.2-16.3-1.2-22.8l-13.6-16.3c-10-12-9.9-29.5 .3-41.3l15.7-18.3c8.8-10.3 10.2-25 3.5-36.7l-2.4-4.2c-3.5-.2-6.9-.3-10.4-.3C163.1 48 84.4 108.9 57.7 193zM464 256c0-36.8-9.6-71.4-26.4-101.5L412 164.8c-15.7 6.3-23.8 23.8-18.5 39.8l16.9 50.7c3.5 10.4 12 18.3 22.6 20.9l29.1 7.3c1.2-9 1.8-18.2 1.8-27.5zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z']),
  delivery: Object.freeze([640, 512, 'M112 0C85.5 0 64 21.5 64 48l0 48L16 96c-8.8 0-16 7.2-16 16s7.2 16 16 16l48 0 208 0c8.8 0 16 7.2 16 16s-7.2 16-16 16L64 160l-16 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l16 0 176 0c8.8 0 16 7.2 16 16s-7.2 16-16 16L64 224l-48 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l48 0 144 0c8.8 0 16 7.2 16 16s-7.2 16-16 16L64 288l0 128c0 53 43 96 96 96s96-43 96-96l128 0c0 53 43 96 96 96s96-43 96-96l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64 0-32 0-18.7c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7L416 96l0-48c0-26.5-21.5-48-48-48L112 0zM544 237.3l0 18.7-128 0 0-96 50.7 0L544 237.3zM160 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm272 48a48 48 0 1 1 96 0 48 48 0 1 1-96 0z']),
  support: Object.freeze([512, 512, 'M352 320c88.4 0 160-71.6 160-160c0-15.3-2.2-30.1-6.2-44.2c-3.1-10.8-16.4-13.2-24.3-5.3l-76.8 76.8c-3 3-7.1 4.7-11.3 4.7L336 192c-8.8 0-16-7.2-16-16l0-57.4c0-4.2 1.7-8.3 4.7-11.3l76.8-76.8c7.9-7.9 5.4-21.2-5.3-24.3C382.1 2.2 367.3 0 352 0C263.6 0 192 71.6 192 160c0 19.1 3.4 37.5 9.5 54.5L19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L297.5 310.5c17 6.2 35.4 9.5 54.5 9.5zM80 408a24 24 0 1 1 0 48 24 24 0 1 1 0-48z']),
  data: Object.freeze([448, 512, 'M448 80l0 48c0 44.2-100.3 80-224 80S0 172.2 0 128L0 80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6L448 288c0 44.2-100.3 80-224 80S0 332.2 0 288L0 186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6l0 85.9c0 44.2-100.3 80-224 80S0 476.2 0 432l0-85.9z']),
  growth: Object.freeze([512, 512, 'M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64L0 400c0 44.2 35.8 80 80 80l400 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 416c-8.8 0-16-7.2-16-16L64 64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z'])
});

function milestoneIcon(role, className = '') {
  const [width, height, path] = MILESTONE_ICONS[role] ?? MILESTONE_ICONS.idea;
  return `<svg class="bb-milestone-timeline__icon${className ? ` ${className}` : ''}" viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false"><path fill="currentColor" d="${path}" /></svg>`;
}

export function milestoneTimelineMarkup(model = {}) {
  const items = model.items ?? [];
  const stages = items.map((item, index) => `<article class="bb-milestone-timeline__item${index % 2 === 0 ? ' bb-milestone-timeline__item--end' : ''}">
          <div class="bb-information-panel">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${richMarkup(item.body)}</p>
          </div>
        </article>`).join('\n        ');
  const milestoneIndexes = new Set(items.flatMap((item, index) => item.iconRoles.map((role, roleIndex) => (index * 9) + 2 + (roleIndex * 2))));
  const roles = items.flatMap((item) => item.iconRoles);
  let roleIndex = 0;
  const dots = Array.from({ length: items.length * 9 }, (_, index) => {
    if (!milestoneIndexes.has(index)) {
      return '<span class="bb-milestone-timeline__dot"><span></span></span>';
    }
    const role = roles[roleIndex];
    roleIndex += 1;
    return `<span class="bb-milestone-timeline__dot bb-milestone-timeline__milestone">${milestoneIcon(role)}</span>`;
  }).join('\n          ');
  return `<section class="bb-milestone-timeline" aria-label="${escapeHtml(model.label ?? 'Milestones')}">
        <div class="bb-milestone-timeline__markers" aria-hidden="true">
          ${dots}
        </div>
        <div class="bb-milestone-timeline__spacer"></div>
        ${stages}
        <div class="bb-milestone-timeline__bottom"></div>
      </section>`;
}

export function proseMarkup(model = {}) {
  const paragraphs = (model.paragraphs ?? [])
    .map((paragraph) => `<p>${richMarkup(paragraph)}</p>`)
    .join('\n        ');
  return `<div class="bb-prose-block bb-prose-block--${escapeHtml(model.flow ?? 'paragraph')}">
        ${paragraphs}
      </div>`;
}

export function questionListMarkup(model = {}) {
  const questions = (model.items ?? []).map((item) => {
    const steps = item.steps?.length
      ? `<div class="bb-question-list__steps">
              ${item.steps.map((step) => `<p class="bb-question-list__step">${milestoneIcon(step.icon, 'bb-question-list__step-icon')}<span>${richMarkup(step.content)}</span></p>`).join('\n              ')}
            </div>`
      : '';
    return `<div class="bb-question-list__item">
          <dt>${escapeHtml(item.question)}</dt>
          <dd>${richMarkup(item.answer)}${steps}</dd>
        </div>`;
  }).join('\n        ');
  return `<dl class="bb-question-list" aria-label="${escapeHtml(model.label ?? 'Questions and answers')}">
        ${questions}
      </dl>`;
}
