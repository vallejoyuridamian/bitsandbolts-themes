import { semanticIconMarkup } from './semantic-icons.js';
import { layoutTextEditorRangeFieldMarkup } from './layout-text-editor.js';
import { workspaceSectionMarkup } from './workspace-section.js';

export const buttonFeedbackFields = Object.freeze([
  { key: 'blur', label: 'Glow radius', min: 0, max: 16, step: 0.5, unit: ' px' },
  { key: 'strength', label: 'Glow strength', min: 0, max: 100, step: 1, unit: '%' },
  { key: 'halo', label: 'Outer halo', min: 0, max: 100, step: 1, unit: '%' },
  { key: 'tint', label: 'Glyph color', min: 0, max: 100, step: 1, unit: '%' }
]);

export const buttonFeedbackPresets = Object.freeze([
  { id: 'tight', label: 'Tight', hover: { blur: 2, strength: 45, halo: 0, tint: 0 }, selected: { blur: 3, strength: 80, halo: 10, tint: 25 } },
  { id: 'soft', label: 'Soft', hover: { blur: 4, strength: 45, halo: 15, tint: 0 }, selected: { blur: 6, strength: 75, halo: 30, tint: 15 } },
  { id: 'bright', label: 'Bright', hover: { blur: 3, strength: 70, halo: 30, tint: 20 }, selected: { blur: 5, strength: 100, halo: 60, tint: 40 } },
  { id: 'color', label: 'Color only', hover: { blur: 0, strength: 0, halo: 0, tint: 55 }, selected: { blur: 0, strength: 0, halo: 0, tint: 100 } }
]);

export function normalizeButtonFeedbackSettings(value = {}) {
  const defaults = buttonFeedbackPresets.find(({ id }) => id === 'soft');
  const settings = { version: 1, color: ['primary', 'secondary', 'foreground'].includes(value.color) ? value.color : 'primary' };
  for (const state of ['hover', 'selected']) {
    settings[state] = Object.fromEntries(buttonFeedbackFields.map(({ key, min, max, step }) => {
      const input = Number(value[state]?.[key] ?? defaults[state][key]);
      return [key, Number.isFinite(input) ? Math.min(max, Math.max(min, Math.round(input / step) * step)) : defaults[state][key]];
    }));
  }
  return settings;
}

export function buttonFeedbackStyleProperties(settings) {
  const normalized = normalizeButtonFeedbackSettings(settings);
  const colors = { primary: 'var(--bb-v2-identity-primary)', secondary: 'var(--bb-v2-identity-secondary)', foreground: 'var(--bb-interface-control-foreground)' };
  const properties = { '--bb-feedback-color': colors[normalized.color] };
  for (const state of ['hover', 'selected']) {
    for (const { key, unit } of buttonFeedbackFields) properties[`--bb-feedback-${state}-${key}`] = `${normalized[state][key]}${unit.trim()}`;
  }
  return properties;
}

function icon(role) {
  return `<span class="bb-workspace-control-icon">${semanticIconMarkup(role)}</span>`;
}

function sampleButton({ label, role = '', iconOnly = false, state = '', current = false, pressed = false }) {
  const content = `${role ? icon(role) : ''}${iconOnly ? '' : `<span class="bb-workspace-control-label">${label}</span>`}`;
  const classes = `bb-workspace-control-button ${iconOnly ? 'bb-workspace-control-button--icon' : 'bb-workspace-control-button--icon-label'}`;
  return `<button type="button" class="${classes}${current ? '' : ' bb-feedback-button'}" aria-label="${label}" title="${label}" aria-pressed="${state === 'selected' || pressed}"${state === 'disabled' ? ' disabled' : ''}${state ? ` data-feedback-state="${state}" tabindex="-1"` : ' data-feedback-live'}${current && state === 'hover' ? ' data-specimen-state="hover"' : ''}>
    ${current ? content : `<span class="bb-feedback-button__content">${content}</span>`}
  </button>`;
}

function samples(state, current = false) {
  return `<div class="bb-feedback-playground__samples">
    ${sampleButton({ label: 'Play', role: 'play_arrow', iconOnly: true, state, current })}
    ${sampleButton({ label: 'Video', state, current })}
    ${sampleButton({ label: 'Save', role: 'save', state, current })}
  </div>`;
}

export function buttonFeedbackPlaygroundMarkup() {
  const settings = normalizeButtonFeedbackSettings();
  return `<header class="bb-feedback-playground__header">
    <div><h1>Button feedback</h1><p>Compare glow on the glyphs, then copy your settings.</p></div>
    <div class="bb-feedback-playground__actions" role="group" aria-label="Color mode">
      <button class="bb-workspace-control-button" type="button" data-feedback-mode="dark" aria-pressed="true">Dark</button>
      <button class="bb-workspace-control-button" type="button" data-feedback-mode="light" aria-pressed="false">Light</button>
    </div>
  </header>
  <main class="bb-feedback-playground__layout">
    <section class="bb-feedback-playground__preview" aria-label="Button samples">
      <section><h2>Try it</h2><p>Hover, click to select, or use Tab and Space.</p>
        <div class="bb-feedback-playground__live">
          <div class="bb-feedback-playground__actions" role="group" aria-label="Icon buttons">
            ${[['Add', 'add'], ['Open', 'folder_open'], ['Save', 'save'], ['Audio', 'media_audio'], ['Play', 'play_arrow'], ['Delete', 'delete']].map(([label, role]) => sampleButton({ label, role, iconOnly: true, pressed: role === 'media_audio' })).join('')}
          </div>
          <div class="bb-feedback-playground__actions" role="group" aria-label="Text buttons">
            ${['Screens', 'Video', 'Audio', 'Vault', 'Themes'].map((label) => sampleButton({ label, pressed: label === 'Video' })).join('')}
          </div>
          <div class="bb-feedback-playground__actions" role="group" aria-label="Icons with text">
            ${[['Save', 'save'], ['Preview', 'play_arrow'], ['Export', 'download']].map(([label, role]) => sampleButton({ label, role })).join('')}
          </div>
        </div>
      </section>
      <section><h2>States side by side</h2>
        <div class="bb-feedback-playground__states">
          ${[['rest', 'Rest'], ['hover', 'Hover'], ['selected', 'Selected'], ['disabled', 'Disabled']].map(([state, label]) => `<section><h3>${label}</h3>${samples(state)}</section>`).join('')}
        </div>
      </section>
      <section><h2>Current theme treatment</h2>
        <div class="bb-feedback-playground__reference">
          <section><h3>Hover</h3>${samples('hover', true)}</section>
          <section><h3>Selected</h3>${samples('selected', true)}</section>
        </div>
      </section>
    </section>
    <aside class="bb-feedback-playground__controls bb-property-editor" aria-label="Feedback settings">
      <section><h2>Starting point</h2>
        <div class="bb-feedback-playground__actions" role="group" aria-label="Glow presets">
          ${buttonFeedbackPresets.map(({ id, label }) => `<button class="bb-workspace-control-button" type="button" data-feedback-preset="${id}" aria-pressed="${id === 'soft'}">${label}</button>`).join('')}
        </div>
      </section>
      <label>Glow color<select data-feedback-color aria-label="Glow color"><option value="primary">Theme primary</option><option value="secondary">Theme secondary</option><option value="foreground">Text color</option></select></label>
      ${['hover', 'selected'].map((state) => `<section><h2>${state === 'hover' ? 'Hover' : 'Selected'}</h2><div class="bb-property-editor">
        ${buttonFeedbackFields.map(({ key, label, ...field }) => layoutTextEditorRangeFieldMarkup({ ...field, label, value: settings[state][key], attributes: { 'data-feedback-state-control': state, 'data-feedback-field': key, 'aria-label': `${state} ${label.toLowerCase()}` } })).join('')}
      </div></section>`).join('')}
      <p>Glyph color: 0% keeps the original text color; 100% uses the glow color.</p>
      <div class="bb-feedback-playground__actions">
        <button class="bb-workspace-control-button bb-workspace-control-button--icon-label" type="button" data-feedback-copy>${icon('content_copy')}<span class="bb-workspace-control-label">Copy settings</span></button>
        <button class="bb-workspace-control-button" type="button" data-feedback-reset>Reset</button>
      </div>
      <p class="bb-feedback-playground__status" data-feedback-status role="status" aria-live="polite"></p>
      ${workspaceSectionMarkup({ id: 'feedback-settings', label: 'Exact settings', content: '<label>Settings<textarea class="bb-field__input" data-feedback-output readonly rows="12" aria-label="Exact button feedback settings" spellcheck="false"></textarea></label>' })}
    </aside>
  </main>`;
}
