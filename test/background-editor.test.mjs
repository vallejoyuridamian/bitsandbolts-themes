import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { backgroundEditorMarkup } from '../components/background-editor.js';

test('Background editor owns scope, theme, and background presentation', async () => {
  const css = await readFile(new URL('../components/background-editor.css', import.meta.url), 'utf8');
  const markup = backgroundEditorMarkup({
    id: 'sceneBackground',
    itemScopeLabel: 'Scene',
    presentation: 'window',
    showScope: true
  });

  assert.match(markup, /class="bb-background-editor__scope bb-segmented-control"/);
  assert.match(markup, /data-bb-background-editor-scope="project">Project<\/button>/);
  assert.match(markup, /data-bb-background-editor-scope="surface">Scene<\/button>/);
  assert.match(markup, /data-bb-background-editor-role="theme-control"/);
  assert.match(markup, />Background<\/label>/);
  assert.match(markup, /<option value="transparent">Transparent<\/option>/);
  assert.equal((markup.match(/data-bb-background-editor-when="paint"/g) ?? []).length, 3);
  assert.match(css, /\.bb-background-editor__color-row \{[\s\S]*?grid-template-columns: minmax\(66px, 1fr\) 36px minmax\(66px, 1fr\)/);
});
