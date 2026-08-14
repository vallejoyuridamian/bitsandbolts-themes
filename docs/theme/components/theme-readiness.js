const installedDocuments = new WeakMap();

const FONT_FAMILY_PROPERTIES = Object.freeze([
  '--bb-font-family-display',
  '--bb-font-family-body',
  '--bb-font-family-mono',
  '--bb-font-family-terminal',
  '--bb-marketing-chrome-meta-font'
]);

const FONT_WEIGHT_PROPERTIES = Object.freeze([
  '--bb-font-weight-regular',
  '--bb-font-weight-medium',
  '--bb-font-weight-semibold',
  '--bb-font-weight-bold'
]);

function stylesheetRules(owner) {
  try {
    return [...(owner?.cssRules || [])];
  } catch {
    return [];
  }
}

function collectRuleValues(owner, families, weights) {
  stylesheetRules(owner).forEach((rule) => {
    if (rule?.style?.getPropertyValue) {
      FONT_FAMILY_PROPERTIES.forEach((property) => {
        const value = String(rule.style.getPropertyValue(property) || '')
          .trim()
          .replace(/^(['"])(.*)\1$/, '$2');
        if (value) families.add(value);
      });
      FONT_WEIGHT_PROPERTIES.forEach((property) => {
        const value = String(rule.style.getPropertyValue(property) || '').trim();
        if (/^[1-9]00$/.test(value)) weights.add(value);
      });
    }
    collectRuleValues(rule, families, weights);
  });
}

export function themeFontProfile(links = []) {
  const families = new Set();
  const weights = new Set();
  links.forEach((link) => collectRuleValues(link?.sheet, families, weights));
  return Object.freeze({
    families: Object.freeze([...families]),
    weights: Object.freeze([...weights])
  });
}

export function themeLinkReady(link) {
  if (link?.sheet) return Promise.resolve(true);
  if (!link?.addEventListener) return Promise.resolve(false);
  return new Promise((resolve) => {
    let settled = false;
    const finish = (ready) => {
      if (settled) return;
      settled = true;
      link.removeEventListener?.('load', handleLoad);
      link.removeEventListener?.('error', handleError);
      resolve(ready);
    };
    const handleLoad = () => finish(true);
    const handleError = () => finish(false);
    link.addEventListener('load', handleLoad, { once: true });
    link.addEventListener('error', handleError, { once: true });
    queueMicrotask(() => {
      if (link.sheet) finish(true);
    });
  });
}

export async function waitForThemeFonts(links, root = globalThis.document) {
  const fontSet = root?.fonts;
  if (!fontSet?.load) return true;
  const { families, weights } = themeFontProfile(links);
  if (families.length === 0 || weights.length === 0) return false;

  try {
    const results = await Promise.all(families.flatMap((family) => (
      weights.map((weight) => fontSet.load(`${weight} 1em ${JSON.stringify(family)}`))
    )));
    if (!results.every((faces) => faces.length > 0)) return false;
    await fontSet.ready;
    return true;
  } catch {
    return false;
  }
}

function currentThemeLinks(root) {
  const familyId = String(root?.documentElement?.dataset?.bbPageThemeFamily || '');
  const mode = String(root?.documentElement?.dataset?.theme || '');
  return [...(root?.querySelectorAll?.('[data-bb-page-theme-family][data-bb-page-theme-mode]') || [])]
    .filter((link) => (
      link.dataset.bbPageThemeFamily === familyId
      && link.dataset.bbPageThemeMode === mode
    ));
}

function typographyLinks(root) {
  return [...(root?.querySelectorAll?.('link[rel="stylesheet"][href*="/components/typography.css"]') || [])];
}

export function installThemeReadiness(root = globalThis.document) {
  if (!root?.documentElement) return Promise.resolve(false);
  const installed = installedDocuments.get(root);
  if (installed) return installed;

  const ready = (async () => {
    const themeLinks = currentThemeLinks(root);
    const stylesReady = await Promise.all([...typographyLinks(root), ...themeLinks].map(themeLinkReady));
    if (!stylesReady.every(Boolean)) return false;
    if (!(await waitForThemeFonts(themeLinks, root))) return false;
    root.documentElement.dataset.bbThemeReadiness = 'ready';
    return true;
  })();
  installedDocuments.set(root, ready);
  return ready;
}

if (typeof document !== 'undefined') installThemeReadiness(document);
