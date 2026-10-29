import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { floatingWindowStack } from '../components/floating-window-stack.js';

function documentFixture() {
  const createElement = () => ({ style: {}, children: [],
    append(node) { this.children.push(node); node.parentElement = this; },
    remove() { this.parentElement.children.splice(this.parentElement.children.indexOf(this), 1); }
  });
  return { body: createElement(), createElement };
}

test('standalone window order depends on current windows and never moves a retained node', () => {
  const document = documentFixture(), stack = floatingWindowStack(document);
  const a = document.createElement(), b = document.createElement();
  stack.mount(a); stack.mount(b);
  stack.raise(a); stack.raise(b);
  const parent = a.parentElement;
  for (let index = 0; index < 500; index += 1) stack.raise(a);
  assert.deepEqual(parent.children, [a, b], 'DOM order and retained focus nodes are preserved');
  assert.deepEqual(stack.describe(a), { layer: 'floating-window', rank: 2, openWindowCount: 2 });
  assert.equal(a.style.zIndex, '2'); assert.equal(b.style.zIndex, '1');
  stack.close(a);
  assert.deepEqual(stack.describe(b), { layer: 'floating-window', rank: 1, openWindowCount: 1 });
  a.hidden = true; stack.raise(a);
  assert.equal(stack.rank(a), 0, 'closed windows cannot return through a stale activation');
  assert.equal(floatingWindowStack(document), stack);
  stack.unmount(a); stack.unmount(b);
  assert.equal(document.body.children.length, 0);
});

test('the canonical window layer contains all local ranks below detached menu recipes', async () => {
  const windowCss = await readFile(new URL('../components/floating-window.css', import.meta.url), 'utf8');
  const menuCss = await readFile(new URL('../components/selection-controls.css', import.meta.url), 'utf8');
  const layer = windowCss.match(/\.bb-floating-window-layer\s*\{([^}]*)\}/)?.[1];
  assert.match(layer, /position:\s*fixed/); assert.match(layer, /pointer-events:\s*none/);
  const z = Number(layer.match(/z-index:\s*(\d+)/)?.[1]);
  const menu = Number(menuCss.match(/\.bb-select__menu\s*\{[^}]*z-index:\s*(\d+)/)?.[1]);
  assert.ok(z > 0 && z < menu);
  assert.match(windowCss, /\.bb-floating-window\s*\{[^}]*pointer-events:\s*auto/);
  assert.doesNotMatch(windowCss, /\.bb-floating-window-layer\s*\{[^}]*(?:transform|contain|opacity):/);
});
