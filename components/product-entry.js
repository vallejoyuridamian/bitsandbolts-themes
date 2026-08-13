import { installSelectController } from './select.js';

const installedDocuments = new WeakSet();

export function applyProductEntryTheme(familyId, root = globalThis.document) {
  const normalizedFamilyId = String(familyId || '').trim();
  const links = [...(root?.querySelectorAll?.('[data-bb-page-theme-family][data-bb-page-theme-mode]') || [])];
  if (!normalizedFamilyId || !links.some((link) => link.dataset.bbPageThemeFamily === normalizedFamilyId)) return false;

  links.forEach((link) => {
    link.disabled = link.dataset.bbPageThemeFamily !== normalizedFamilyId;
  });
  if (root.documentElement) root.documentElement.dataset.bbPageThemeFamily = normalizedFamilyId;
  return true;
}

export function installProductEntryController(root = globalThis.document) {
  if (!root?.addEventListener || installedDocuments.has(root)) return;
  installedDocuments.add(root);
  installSelectController(root);

  root.querySelectorAll?.('[data-bb-product-theme-select]').forEach((select) => {
    applyProductEntryTheme(select.value, root);
  });
  root.addEventListener('change', (event) => {
    const select = event.target?.closest?.('[data-bb-product-theme-select]');
    if (select) applyProductEntryTheme(select.value, root);
  });
}

if (typeof document !== 'undefined') installProductEntryController(document);
