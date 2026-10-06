import {
  compactThemeMode,
  nextCompactThemeMode,
  presentCompactThemeCardMode
} from './compact-theme-selector.js';
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

function synchronizeThemeCards(root, familyId) {
  root?.querySelectorAll?.('[data-bb-compact-theme-preview]').forEach((card) => {
    const selected = card.dataset.bbCompactThemeId === familyId;
    card.classList.toggle('is-selected', selected);
    card.querySelector('[data-bb-compact-theme-select]')?.setAttribute('aria-selected', String(selected));
  });
}

function commitProductEntryTheme(root, links, familyId, mode) {
  links.filter((link) => link.dataset.bbPageThemeFamily === familyId).forEach((link) => {
    link.disabled = false;
    link.removeAttribute?.('media');
  });
  links.filter((link) => link.dataset.bbPageThemeFamily !== familyId).forEach((link) => {
    link.media = 'not all';
    link.disabled = false;
  });
  if (root.documentElement) {
    root.documentElement.dataset.theme = mode;
    root.documentElement.dataset.bbPageThemeFamily = familyId;
  }
  synchronizeThemeCards(root, familyId);
}

export function applyProductEntryTheme(familyId, root = globalThis.document, mode) {
  const normalizedFamilyId = String(familyId || '').trim();
  const links = productEntryThemeLinks(root);
  if (!normalizedFamilyId || !links.some((link) => link.dataset.bbPageThemeFamily === normalizedFamilyId)) return false;

  const currentFamilyId = String(root.documentElement?.dataset?.bbPageThemeFamily || '');
  const currentMode = compactThemeMode(root.documentElement?.dataset?.theme);
  const targetMode = compactThemeMode(mode || currentMode);
  primeProductEntryThemeLinks(root, currentFamilyId);
  const transitionState = themeTransitionStates.get(root) ?? { requestId: 0 };
  transitionState.requestId += 1;
  themeTransitionStates.set(root, transitionState);
  if (normalizedFamilyId === currentFamilyId && targetMode === currentMode) return true;
  const requestId = transitionState.requestId;
  const targetLinks = links.filter((link) => link.dataset.bbPageThemeFamily === normalizedFamilyId);
  Promise.all(targetLinks.map(themeLinkReady)).then(async (results) => {
    if (themeTransitionStates.get(root)?.requestId !== requestId) return;
    if (!results.every(Boolean)) {
      return;
    }
    const targetModeLinks = targetLinks.filter((link) => link.dataset.bbPageThemeMode === targetMode);
    if (!(await waitForThemeFonts(targetModeLinks, root))) {
      return;
    }
    if (themeTransitionStates.get(root)?.requestId !== requestId) return;
    commitProductEntryTheme(root, links, normalizedFamilyId, targetMode);
  });
  return true;
}

export function installProductEntryController(root = globalThis.document) {
  if (!root?.addEventListener || installedDocuments.has(root)) return;
  installedDocuments.add(root);
  primeProductEntryThemeLinks(root, String(root.documentElement?.dataset?.bbPageThemeFamily || ''));
  let previewCatalog;
  root.addEventListener('click', (event) => {
    const modeToggle = event.target?.closest?.('[data-bb-compact-theme-card-mode]');
    if (modeToggle) {
      const card = modeToggle.closest('[data-bb-compact-theme-preview]');
      const template = root.querySelector('[data-bb-product-theme-catalog]');
      if (!card || !template) return;
      event.preventDefault();
      previewCatalog ||= JSON.parse(template.content.textContent);
      const theme = previewCatalog.themes.find((candidate) => candidate.id === card.dataset.bbCompactThemeId);
      if (!theme) return;
      presentCompactThemeCardMode(card, theme, nextCompactThemeMode(card.dataset.bbCompactThemeMode));
      return;
    }
    const select = event.target?.closest?.('[data-bb-compact-theme-select]');
    if (!select) return;
    event.preventDefault();
    const card = select.closest('[data-bb-compact-theme-preview]');
    if (card) applyProductEntryTheme(card.dataset.bbCompactThemeId, root, card.dataset.bbCompactThemeMode);
  });
}

if (typeof document !== 'undefined') installProductEntryController(document);
