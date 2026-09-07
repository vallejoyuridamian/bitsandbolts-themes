import { semanticActionButtonMarkup } from './button.js';

export function audioSettingsMarkup({ canChooseAsset = false, hasAsset = true } = {}) {
  if (canChooseAsset && !hasAsset) return `<div class="bb-property-editor" data-audio-settings>
    ${semanticActionButtonMarkup({ iconRole: 'add', label: 'Add backing track', iconOnly: false, attributes: { 'data-audio-setting': 'choose' } })}
  </div>`;
  return `<div class="bb-property-editor bb-audio-settings" data-audio-settings>
    ${semanticActionButtonMarkup({ iconRole: 'play_arrow', label: 'Play audio', recipe: 'workspace', attributes: { 'data-audio-setting': 'play' } })}
    <label><span class="bb-audio-settings__label">Volume <span data-audio-setting-value="volume">100%</span></span><input data-audio-setting="volume" class="range-control" type="range" min="0" max="1" step="0.01" aria-label="Audio volume"></label>
    ${canChooseAsset ? `<div class="bb-audio-settings__actions">
      ${semanticActionButtonMarkup({ iconRole: 'folder_open', label: 'Replace backing track', attributes: { 'data-audio-setting': 'choose' } })}
      ${semanticActionButtonMarkup({ iconRole: 'delete', label: 'Remove backing track', attributes: { 'data-audio-setting': 'remove' } })}
    </div>` : ''}
  </div>`;
}
