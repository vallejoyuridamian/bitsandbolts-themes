import { semanticActionButtonMarkup } from './button.js';

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

export function audioSettingsMarkup({ canChooseAsset = false, hasAsset = true } = {}) {
  const assetActions = () => audioAssetActionsMarkup({
    hasAsset, addLabel: 'Add backing track', replaceLabel: 'Replace backing track', removeLabel: 'Remove backing track',
    chooseAttributes: { 'data-audio-setting': 'choose' }, removeAttributes: { 'data-audio-setting': 'remove' }
  });
  if (canChooseAsset && !hasAsset) return `<div class="bb-property-editor" data-audio-settings>
    ${assetActions()}
  </div>`;
  return `<div class="bb-property-editor bb-audio-settings" data-audio-settings>
    ${semanticActionButtonMarkup({ iconRole: 'play_arrow', label: 'Play audio', recipe: 'workspace', attributes: { 'data-audio-setting': 'play' } })}
    <label><span class="bb-audio-settings__label">Volume <span data-audio-setting-value="volume">100%</span></span><input data-audio-setting="volume" class="range-control" type="range" min="0" max="1" step="0.01" aria-label="Audio volume"></label>
    ${canChooseAsset ? assetActions() : ''}
  </div>`;
}
