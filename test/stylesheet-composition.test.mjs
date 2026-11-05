import assert from 'node:assert/strict';
import test from 'node:test';
import { composeDocumentStyles, assertComposedDocumentStyles } from '../lib/stylesheet-composition.mjs';
import { requireDocumentStylesheet } from '../components/stylesheet-admission.js';

const page = links => `<html><head>${links.map(href => `<link rel="stylesheet" href="${href}">`).join('')}</head><body></body></html>`;
function compose(sources, links, options = {}) {
  return composeDocumentStyles({ html: page(links), documentPath: '/page/index.html',
    readStylesheet: async pathname => sources[pathname], ...options });
}

test('overlap keeps last cascade positions, imports and assets have one authoritative read', async () => {
  const sources = {
    '/a.css': '@import "shared.css"; .x{color:red!important}',
    '/shared.css': '.x{color:blue!important;background:url("icons/x.svg")} @font-face{font-family:X;src:url(fonts/a.woff2)}',
    '/b.css': '@import "shared.css"; .x{color:green!important}'
  };
  const reads = [];
  const result = await compose(sources, ['/a.css', '/b.css', '/shared.css'], {
    readStylesheet: async key => { reads.push(key); return sources[key]; }
  });
  assert.deepEqual(reads, ['/a.css', '/shared.css', '/b.css']);
  assert.deepEqual(result.manifest.dependencies, ['/a.css', '/b.css', '/shared.css']);
  assert.equal(result.manifest.removed, 2);
  assert.equal((result.css.match(/color:blue/g) || []).length, 1);
  assert.ok(result.css.indexOf('color:green') < result.css.indexOf('color:blue'));
  assert.match(result.css, /url\("\/icons\/x.svg"\)/);
  assert.match(result.css, /url\("\/fonts\/a.woff2"\)/);
  assert.doesNotMatch(result.html, /@import|<link/);
  // A standalone consumer still receives the declared prerequisite.
  const single = await compose(sources, ['/a.css']);
  assert.deepEqual(single.manifest.dependencies, ['/shared.css', '/a.css']);
  assert.ok(single.css.indexOf('color:blue') < single.css.indexOf('color:red'));
});

test('cycles skip only the ancestral edge; repeated roots retain their final body order', async () => {
  const result = await compose({ '/a.css': '@import "b.css";.a{color:red}',
    '/b.css': '@import "a.css";.b{color:blue}' }, ['/a.css', '/b.css']);
  assert.deepEqual(result.manifest.dependencies, ['/a.css', '/b.css']);
  assert.equal(result.manifest.cycleEdges, 2);
  assert.equal(result.manifest.removed, 2);
});

test('inline styles retain precedence and asset document bases; non-style markup is unchanged', async () => {
  const result = await compose({ '/a.css': '.x{color:red}' }, [], {
    html: '<head><link href="/a.css" rel="stylesheet"><style>.x{color:blue;background:url(./x.png)}</style></head><body id="keep">authored</body>'
  });
  assert.match(result.css, /url\("\/page\/x.png"\)/);
  assert.ok(result.css.indexOf('color:red') < result.css.indexOf('color:blue'));
  assert.match(result.html, /<body id="keep">authored<\/body>$/);
});

test('unsupported semantics and missing prerequisites fail before document publication', async () => {
  for (const css of ['@import "b.css" screen;', '@import "b.css" layer(x);',
    '@layer a {.x{color:red}}', '@namespace url(x);', '.x{} @import "b.css";']) {
    await assert.rejects(compose({ '/a.css': css }, ['/a.css']), /Stylesheet composition/);
  }
  await assert.rejects(compose({}, ['/missing.css']), /missing dependency/);
  await assert.rejects(compose({}, ['/.env']), /non-CSS dependency/);
  for (const html of [
    '<head><link rel="stylesheet" href="/a.css" media="screen"></head>',
    '<head><base href="/other/"><link rel="stylesheet" href="/a.css"></head>',
    '<head><link rel="stylesheet" href="/a.css"><script>run()</script><link rel="stylesheet" href="/b.css"></head>'
  ]) await assert.rejects(compose({}, [], { html }), /Stylesheet composition/);
});

test('runtime prerequisites consume composition identity or standalone links and never install CSS', () => {
  function document({ composed = '', links = [] } = {}) {
    return { baseURI: 'https://example.test/studio', querySelectorAll(selector) {
      return selector === '[data-bb-stylesheets]'
        ? [{ getAttribute: () => composed }] : links.map(href => ({ getAttribute: () => href }));
    } };
  }
  requireDocumentStylesheet(document({ composed: '/theme/icons.css /theme/range.css' }), '/theme/range.css');
  requireDocumentStylesheet(document({ links: ['/theme/range.css'] }), '/theme/range.css');
  assert.throws(() => requireDocumentStylesheet(document(), '/theme/range.css'), /prerequisite missing/);
});

test('final delivery rejects duplicate identity, imports and newly added parallel styles', async () => {
  const result = await compose({ '/a.css': '.x{color:red}' }, ['/a.css']);
  assertComposedDocumentStyles(result.html);
  for (const candidate of [
    result.html.replace('/a.css"', '/a.css /a.css"'),
    result.html.replace('.x{', '@import "/b.css";.x{'),
    result.html.replace('</head>', '<link rel="stylesheet" href="/a.css"></head>'),
    result.html.replace('</head>', '<style>.x{color:blue}</style></head>')
  ]) assert.throws(() => assertComposedDocumentStyles(candidate), /Stylesheet composition/);
});
