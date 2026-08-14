import { installSelectController } from './select.js';
import { themeLinkReady, waitForThemeFonts } from './theme-readiness.js';

const installedDocuments = new WeakSet();
const themeTransitionStates = new WeakMap();

function productEntryThemeLinks(root) {
  return [...(root?.querySelectorAll?.('[data-bb-page-theme-family][data-bb-page-theme-mode]') || [])];
}

function primeProductEntryThemeLinks(root, activeFamilyId) {
  productEntryThemeLinks(root).forEach((link) => {
    const active = link.dataset.bbPageThemeFamily === activeFamilyId;
    if (active) link.removeAttribute?.('media');
    else link.media = 'not all';
    link.disabled = false;
  });
}

function synchronizeThemeSelectors(root, familyId) {
  root?.querySelectorAll?.('[data-bb-product-theme-select]').forEach((select) => {
    if (![...select.options].some((option) => option.value === familyId)) return;
    select.value = familyId;
    const value = select.closest?.('[data-bb-select]')?.querySelector?.('.bb-select__value');
    const option = select.options[select.selectedIndex];
    if (value && option) value.textContent = option.label || option.textContent || option.value;
  });
}

function commitProductEntryTheme(root, links, familyId) {
  links.filter((link) => link.dataset.bbPageThemeFamily === familyId).forEach((link) => {
    link.disabled = false;
    link.removeAttribute?.('media');
  });
  links.filter((link) => link.dataset.bbPageThemeFamily !== familyId).forEach((link) => {
    link.media = 'not all';
    link.disabled = false;
  });
  if (root.documentElement) root.documentElement.dataset.bbPageThemeFamily = familyId;
}

export function applyProductEntryTheme(familyId, root = globalThis.document) {
  const normalizedFamilyId = String(familyId || '').trim();
  const links = productEntryThemeLinks(root);
  if (!normalizedFamilyId || !links.some((link) => link.dataset.bbPageThemeFamily === normalizedFamilyId)) return false;

  const currentFamilyId = String(root.documentElement?.dataset?.bbPageThemeFamily || '');
  primeProductEntryThemeLinks(root, currentFamilyId);
  if (normalizedFamilyId === currentFamilyId) return true;

  const transitionState = themeTransitionStates.get(root) ?? { requestId: 0 };
  transitionState.requestId += 1;
  themeTransitionStates.set(root, transitionState);
  const requestId = transitionState.requestId;
  const targetLinks = links.filter((link) => link.dataset.bbPageThemeFamily === normalizedFamilyId);
  Promise.all(targetLinks.map(themeLinkReady)).then(async (results) => {
    if (themeTransitionStates.get(root)?.requestId !== requestId) return;
    if (!results.every(Boolean)) {
      synchronizeThemeSelectors(root, currentFamilyId);
      return;
    }
    const targetMode = String(root.documentElement?.dataset?.theme || '');
    const targetModeLinks = targetLinks.filter((link) => link.dataset.bbPageThemeMode === targetMode);
    if (!(await waitForThemeFonts(targetModeLinks, root))) {
      if (themeTransitionStates.get(root)?.requestId === requestId) {
        synchronizeThemeSelectors(root, currentFamilyId);
      }
      return;
    }
    if (themeTransitionStates.get(root)?.requestId !== requestId) return;
    commitProductEntryTheme(root, links, normalizedFamilyId);
  });
  return true;
}

export function installProductEntryController(root = globalThis.document) {
  if (!root?.addEventListener || installedDocuments.has(root)) return;
  installedDocuments.add(root);
  installSelectController(root);
  primeProductEntryThemeLinks(root, String(root.documentElement?.dataset?.bbPageThemeFamily || ''));

  root.querySelectorAll?.('[data-bb-product-theme-select]').forEach((select) => {
    applyProductEntryTheme(select.value, root);
  });
  root.addEventListener('change', (event) => {
    const select = event.target?.closest?.('[data-bb-product-theme-select]');
    if (select) applyProductEntryTheme(select.value, root);
  });
}

if (typeof document !== 'undefined') installProductEntryController(document);
