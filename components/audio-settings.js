import { rangeControlMarkup } from './range-control.js';
import { semanticActionButtonMarkup } from './button.js';
import { layoutTextEditorNumericFieldMarkup } from './layout-text-editor.js';

export function audioAssetActionsMarkup({
  hasAsset = false, assetLabel = '', addLabel = 'Add audio',
  replaceLabel = 'Replace audio', removeLabel = 'Remove audio',
  chooseAttributes = {}, removeAttributes = {}
} = {}) {
  if (!hasAsset) return semanticActionButtonMarkup({
    iconRole: 'add', label: addLabel, iconOnly: false, attributes: chooseAttributes
  });
  return `<div class="bb-audio-settings__actions${assetLabel ? ' bb-audio-settings__actions--named' : ''}">
    ${semanticActionButtonMarkup({ iconRole: 'folder_open', label: assetLabel || replaceLabel,
      ariaLabel: assetLabel ? `${replaceLabel}: ${assetLabel}` : replaceLabel,
      iconOnly: !assetLabel, attributes: chooseAttributes })}
    ${semanticActionButtonMarkup({ iconRole: 'delete', label: removeLabel, attributes: removeAttributes })}
  </div>`;
}

export function audioVolumeMarkup({ inline = false } = {}) {
  return `<label class="bb-toolbar-popover__field bb-audio-settings__volume${inline ? ' bb-audio-settings__volume--inline' : ''}"><span class="bb-toolbar-popover__field-label bb-audio-settings__label">Volume <span data-audio-setting-value="volume">100%</span></span>${rangeControlMarkup(`<input data-audio-setting="volume" class="range-control" type="range" min="0" max="1" step="0.01" aria-label="Audio volume">`)}</label>`;
}

export function audioTimingMarkup(timingControls = []) {
  return timingControls.length ? `<div class="bb-property-editor bb-audio-settings__timing" data-audio-timing-controls>${timingControls.map(({ field, label, ...limits }) => layoutTextEditorNumericFieldMarkup({
    ...limits, inline: true, label, attributes: { 'data-audio-timing': field }
  })).join('')}</div>` : '';
}

export function audioSettingsMarkup({ canChooseAsset = false, canRemove = false, timingControls = [], hasAsset = true } = {}) {
  const assetActions = () => audioAssetActionsMarkup({
    hasAsset, addLabel: 'Add backing track', replaceLabel: 'Replace backing track', removeLabel: 'Remove backing track',
    chooseAttributes: { 'data-audio-setting': 'choose' }, removeAttributes: { 'data-audio-setting': 'remove' }
  });
  if (canChooseAsset && !hasAsset) return `<div class="bb-property-editor" data-audio-settings>
    ${assetActions()}
  </div>`;
  return `<div class="bb-property-editor bb-audio-settings" data-audio-settings>
    ${semanticActionButtonMarkup({ iconRole: 'play_arrow', label: 'Play audio', recipe: 'workspace', attributes: { 'data-audio-setting': 'play' } })}
    ${audioVolumeMarkup()}
    ${audioTimingMarkup(timingControls)}
    ${canChooseAsset ? assetActions() : canRemove ? `<div class="bb-audio-settings__actions">${semanticActionButtonMarkup({
      iconRole: 'delete', label: 'Remove audio', attributes: { 'data-audio-setting': 'remove' }
    })}</div>` : ''}
  </div>`;
}
