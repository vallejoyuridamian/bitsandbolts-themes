import postcss from 'postcss';
import valueParser from 'postcss-value-parser';
import { parse } from 'parse5';

const origin = 'https://stylesheet.invalid';
function reject(message) {
  throw Object.assign(new Error(`Stylesheet composition: ${message}`), { code: 'stylesheet_composition_invalid' });
}
function localUrl(value, base) {
  if (/\\/.test(value)) reject('escaped dependency URLs require explicit support.');
  const url = new URL(value, base);
  if (url.origin !== origin || url.search || url.hash) reject(`unsupported dependency URL ${value}.`);
  return url;
}
function rewriteUrls(value, base) {
  const parsed = valueParser(value);
  parsed.walk(node => {
    if (node.type !== 'function' || node.value.toLowerCase() !== 'url') return;
    const parts = node.nodes.filter(part => !['space', 'comment'].includes(part.type));
    if (parts.length !== 1 || !['word', 'string'].includes(parts[0].type)) reject('unsupported asset URL.');
    const source = parts[0].value;
    if (!source || /^(?:#|data:|https?:|\/\/)/i.test(source)) return false;
    if (/\\/.test(source)) reject('escaped asset URLs require explicit support.');
    const url = new URL(source, base);
    node.nodes = [{ type: 'string', quote: '"', value: url.pathname + url.search + url.hash }];
    return false;
  });
  return parsed.toString();
}
function parseSheet(source, url) {
  const tree = postcss.parse(source, { from: url.pathname });
  const imports = [];
  let bodyStarted = false;
  for (const node of [...tree.nodes]) {
    if (node.type === 'comment') continue;
    const name = node.type === 'atrule' ? node.name.toLowerCase() : '';
    if (name === 'charset') { node.remove(); continue; }
    if (name !== 'import') { bodyStarted = true; continue; }
    if (bodyStarted) reject(`late import in ${url.pathname}.`);
    const parts = valueParser(node.params).nodes.filter(part => !['space', 'comment'].includes(part.type));
    if (parts.length !== 1) reject(`conditional/layer import in ${url.pathname} requires explicit support.`);
    const part = parts[0];
    let target;
    if (part.type === 'string') target = part.value;
    else if (part.type === 'function' && part.value.toLowerCase() === 'url') {
      const args = part.nodes.filter(item => !['space', 'comment'].includes(item.type));
      if (args.length === 1 && ['string', 'word'].includes(args[0].type)) target = args[0].value;
    }
    if (!target) reject(`invalid import in ${url.pathname}.`);
    imports.push(localUrl(target, url));
    node.remove();
  }
  tree.walkAtRules(node => {
    if (['import', 'namespace', 'layer'].includes(node.name.toLowerCase())) {
      reject(`@${node.name} in ${url.pathname} requires explicit support.`);
    }
    node.params = rewriteUrls(node.params, url);
  });
  tree.walkDecls(node => { node.value = rewriteUrls(node.value, url); });
  return { imports, css: tree.toString() };
}

/** One transaction per document. Reads/parses each canonical dependency once.
 * Last occurrence retains cascade precedence, including important declarations.
 * Repeated source imports remain intact for independent component consumers.
 */
export async function composeDocumentStyles({ html, documentPath, readStylesheet, report = () => {} }) {
  const started = performance.now();
  report('started', { documentPath });
  try {
    const documentUrl = localUrl(documentPath, origin);
    const document = parse(html, { sourceCodeLocationInfo: true });
    const entries = [];
    const executableScripts = [];
    function visit(node, inHead = false) {
      if (node.nodeName === 'base') reject('document base URLs require explicit support.');
      const attrs = Object.fromEntries((node.attrs || []).map(attr => [attr.name, attr.value]));
      if (attrs['data-bb-stylesheets'] !== undefined) reject('document already composed.');
      const isLink = node.nodeName === 'link' && /\bstylesheet\b/i.test(attrs.rel || '');
      if (node.nodeName === 'script' && !['importmap', 'application/json'].includes(attrs.type)) {
        executableScripts.push(node.sourceCodeLocation);
      }
      if (isLink || node.nodeName === 'style') {
        if (!inHead) reject('styles outside the document head require explicit support.');
        const allowed = isLink ? ['rel', 'href', 'type'] : ['type'];
        if (Object.keys(attrs).some(key => !allowed.includes(key))
          || (attrs.type && attrs.type !== 'text/css')
          || (isLink && !attrs.href)
          || (isLink && attrs.rel.toLowerCase() !== 'stylesheet')) {
          reject('stylesheet attributes/conditions require explicit support.');
        }
        entries.push({ location: node.sourceCodeLocation,
          url: isLink ? localUrl(attrs.href, documentUrl) : documentUrl,
          inline: isLink ? null : node.childNodes.map(child => child.value || '').join('') });
      }
      for (const child of node.childNodes || []) visit(child, inHead || node.nodeName === 'head');
    }
    visit(document);
    if (entries.length > 1 && executableScripts.some(location => location
      && location.startOffset > entries[0].location.startOffset
      && location.startOffset < entries.at(-1).location.endOffset)) {
      reject('executable script between stylesheet entries.');
    }
    const sheets = new Map(), occurrences = [], cycles = [];
    async function expand(url, ancestry, inline = null, inlineKey = '') {
      const key = inlineKey || url.pathname;
      if (!inlineKey && !url.pathname.endsWith('.css')) reject(`non-CSS dependency ${url.pathname}.`);
      if (ancestry.includes(key)) { cycles.push([...ancestry, key]); return; }
      if (!sheets.has(key)) {
        const source = inline ?? await readStylesheet(url.pathname);
        if (source == null) reject(`missing dependency ${url.pathname}.`);
        sheets.set(key, parseSheet(String(source), url));
      }
      const sheet = sheets.get(key);
      for (const dependency of sheet.imports) await expand(dependency, [...ancestry, key]);
      if (occurrences.length >= 10000) reject('document dependency expansion exceeds 10000 entries.');
      occurrences.push(key);
    }
    for (const [index, entry] of entries.entries()) {
      await expand(entry.url, [], entry.inline, entry.inline === null ? '' : `inline:${index}`);
    }
    const last = new Map(occurrences.map((key, index) => [key, index]));
    const order = occurrences.filter((key, index) => last.get(key) === index);
    const dependencies = order.filter(key => !key.startsWith('inline:'));
    const css = order.map(key => sheets.get(key).css).join('\n');
    if (/<\/style/i.test(css)) reject('CSS contains an HTML style terminator.');
    // Identity metadata survives minification and lets consumers require a
    // prerequisite without installing a second stylesheet at runtime.
    const identity = dependencies.join(' ').replaceAll('&', '&amp;').replaceAll('"', '&quot;');
    const replacement = `<style data-bb-stylesheets="${identity}">\n${css}\n</style>`;
    let output = html;
    for (let index = entries.length - 1; index >= 0; index--) {
      const { startOffset, endOffset } = entries[index].location;
      output = output.slice(0, startOffset) + (index === entries.length - 1 ? replacement : '') + output.slice(endOffset);
    }
    const manifest = { documentPath, dependencies, occurrences: occurrences.length,
      admitted: order.length, removed: occurrences.length - order.length, cycleEdges: cycles.length };
    report('finished', { ...manifest, durationMs: Math.round((performance.now() - started) * 10) / 10 });
    return { html: output, css, manifest };
  } catch (error) {
    report('failed', { documentPath, code: error.code || 'stylesheet_composition_failed',
      durationMs: Math.round((performance.now() - started) * 10) / 10 });
    throw error;
  }
}

// Delivery adapters run this after their other HTML transforms. An added link
// or import cannot quietly create a second evaluation path after composition.
export function assertComposedDocumentStyles(html) {
  let compositions = 0;
  function visit(node) {
    const attrs = Object.fromEntries((node.attrs || []).map(attr => [attr.name, attr.value]));
    if (node.nodeName === 'link' && /\bstylesheet\b/i.test(attrs.rel || '')) {
      reject('delivered document bypasses composition with a stylesheet link.');
    }
    if (node.nodeName === 'style') {
      if (!Object.hasOwn(attrs, 'data-bb-stylesheets')) reject('unadmitted inline stylesheet.');
      compositions++;
      const dependencies = attrs['data-bb-stylesheets'].split(/\s+/).filter(Boolean);
      if (dependencies.length !== new Set(dependencies).size) reject('duplicate delivered dependency identity.');
      const css = node.childNodes.map(child => child.value || '').join('');
      postcss.parse(css).walkAtRules('import', () => reject('delivered stylesheet contains an import.'));
    }
    for (const child of node.childNodes || []) visit(child);
  }
  visit(parse(html));
  if (compositions !== 1) reject(`expected one delivered composition, found ${compositions}.`);
}
