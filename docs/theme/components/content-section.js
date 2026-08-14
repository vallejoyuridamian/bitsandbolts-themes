import { buttonMarkup } from './button.js';
import { semanticIconMarkup } from './semantic-icons.js';

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
      return '<span class="bb-milestone-timeline__dot"><span class="bb-milestone-timeline__point"></span></span>';
    }
    const role = roles[roleIndex];
    roleIndex += 1;
    return `<span class="bb-milestone-timeline__dot bb-milestone-timeline__milestone">${semanticIconMarkup(role, 'bb-milestone-timeline__icon')}</span>`;
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
              ${item.steps.map((step) => `<p class="bb-question-list__step">${semanticIconMarkup(step.icon, 'bb-question-list__step-icon')}<span>${richMarkup(step.content)}</span></p>`).join('\n              ')}
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
