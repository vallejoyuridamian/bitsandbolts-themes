import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { formFieldMarkup, formFieldsMarkup } from '../components/form-field.js';

test('property Name fields inherit canonical form markup, escaped values, and associated field errors', () => {
  const field = { id: 'name', name: 'name', type: 'text', label: 'Name', value: 'A "name" <b>',
    errorId: 'nameError', attributes: { 'data-tool': 'elementName' } };
  const markup = formFieldMarkup(field);
  assert.ok(formFieldsMarkup({ fields: [field] }).includes(markup));
  assert.match(markup, /value="A &quot;name&quot; &lt;b&gt;"/);
  assert.match(markup, /aria-describedby="nameError"/);
  assert.match(markup, /id="nameError" class="bb-field__error" role="alert" hidden/);
  const invalid = formFieldMarkup({ ...field, state: 'error', message: 'Name is required.' });
  assert.match(invalid, /bb-field bb-field--error/);
  assert.match(invalid, /role="alert">Name is required\./);
  assert.throws(() => formFieldMarkup({ ...field, attributes: { onclick: 'invalid()' } }), /Invalid field attribute/);
});

test('property editors own hidden sections and inherit one shared checkbox layout', async () => {
  const css = await readFile(new URL('../components/property-editor.css', import.meta.url), 'utf8');
  const layout = await readFile(new URL('../components/layout-text-editor.css', import.meta.url), 'utf8');
  assert.match(css, /\.bb-property-editor\[hidden\],[\s\S]*?\.bb-property-editor \[hidden\] \{\s*display: none;/);
  assert.match(css, /:is\(\.bb-layout-text-editor, \.bb-property-editor\) \.bb-checkbox-field__label/);
  assert.doesNotMatch(layout, /\.bb-layout-text-editor \.bb-layout-text-editor__checkbox \{/);
  assert.match(css, /\.bb-property-editor \.bb-field--error \.bb-field__input \{\s*border-color: var\(--bb-v2-color-status-danger-border\);/);
});
