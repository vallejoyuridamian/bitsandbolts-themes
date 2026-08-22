import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { workspaceItemInfoMarkup } from '../components/workspace-item-info.js';

test('workspace item info uses canonical field and informative-value recipes', async () => {
  const css = await readFile(
    new URL('../components/workspace-item-info.css', import.meta.url),
    'utf8'
  );
  const markup = workspaceItemInfoMarkup({
    id: 'sceneInfo',
    itemNameLabel: 'Scene name'
  });

  assert.match(markup, /class="bb-workspace-item-info bb-interface-controls"/);
  assert.equal((markup.match(/class="bb-field"/g) ?? []).length, 3);
  assert.equal((markup.match(/class="bb-field__input"/g) ?? []).length, 2);
  assert.match(markup, /data-bb-workspace-item-info-role="project-name"/);
  assert.match(markup, /data-bb-workspace-item-info-role="resolution"/);
  assert.match(markup, /data-bb-workspace-item-info-role="item-name"/);
  assert.match(markup, />Scene name<\/label>/);
  assert.match(css, /\.bb-workspace-item-info \{[\s\S]*?gap: var\(--bb-spacing-3\)/);
  assert.match(css, /\.bb-workspace-item-info__value \{[\s\S]*?font-size: var\(--bb-font-size-sm\)/);
});
