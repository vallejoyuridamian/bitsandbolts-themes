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
  assert.match(markup, /data-bb-background-editor-role="theme-name"/);
  assert.match(markup, /data-bb-background-editor-role="theme-mode"/);
  assert.match(markup, />Background<\/label>/);
  assert.match(css, /\.bb-background-editor__theme-row \{[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
});
