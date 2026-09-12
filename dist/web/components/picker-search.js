import { formFieldMarkup } from './form-field.js';
import { semanticActionButtonMarkup } from './button.js';

export function pickerSearchMarkup({ id = 'pickerSearch', browseMarkup = '' } = {}) {
  return `<div class="bb-picker-search" data-picker-search>
    <div class="bb-picker-search__controls" role="search">
      ${formFieldMarkup({ id, name: 'picker-search', type: 'text', label: 'Search',
        autocomplete: 'off', attributes: { 'data-picker-search-input': '', 'aria-label': 'Search' } })}
      ${semanticActionButtonMarkup({ label: 'Clear search', iconRole: 'close', recipe: 'workspace',
        ariaLabel: 'Clear search', help: 'Clear search',
        attributes: { 'data-picker-search-clear': '', hidden: true } })}
    </div>
    <div data-picker-search-browse>${browseMarkup}</div>
    <div data-picker-search-results hidden></div>
    <p class="bb-picker-search__empty" data-picker-search-empty role="status" hidden>No matches</p>
  </div>`;
}
