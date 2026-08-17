import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { MANAGED_WEB_COMPONENTS } from '../components/managed-components.js';
import {
  MediaPreviewCard,
  mediaPreviewIcon,
  referenceImagePickerMarkup
} from '../components/media-picker.js';
import {
  applyThemeGalleryVariables,
  themeDetailMarkup
} from '../components/theme-gallery.js';

const catalog = JSON.parse(await readFile(
  new URL('../dist/web/catalog.json', import.meta.url),
  'utf8'
));
const showcase = await readFile(new URL('../showcase/index.html', import.meta.url), 'utf8');
const interfacePrimitives = await readFile(
  new URL('../components/interface-primitives.css', import.meta.url),
  'utf8'
);
const mediaPickerCss = await readFile(new URL('../components/media-picker.css', import.meta.url), 'utf8');
const selectionControlsCss = await readFile(new URL('../components/selection-controls.css', import.meta.url), 'utf8');
const themeGalleryCss = await readFile(new URL('../components/theme-gallery.css', import.meta.url), 'utf8');
const theme = catalog.themes.find((entry) => entry.id === 'bitsandbolts');

test('media preview icons use Themes semantic roles without inline artwork', () => {
  for (const kind of ['audio', 'video', 'image', 'device', 'font', 'play', 'stop']) {
    const markup = mediaPreviewIcon(kind);
    assert.match(markup, /class="bb-semantic-icon/);
    assert.doesNotMatch(markup, /<svg|<path|<rect/);
  }
});

test('font card grids share one column width derived from the widest rendered name', () => {
  const values = new Map();
  const grid = {
    ownerDocument: {},
    querySelectorAll() {
      return [{ scrollWidth: 112 }, { scrollWidth: 241 }, { scrollWidth: 188 }];
    },
    style: {
      removeProperty(name) { values.delete(name); },
      setProperty(name, value) { values.set(name, value); }
    }
  };
  const root = { querySelectorAll: () => [grid] };
  const preview = new MediaPreviewCard();

  assert.equal(preview.syncFontCardGridWidths(root), 1);
  assert.equal(values.get('--bb-font-media-card-width'), '281px');
});

test('media cards and reference images use the canonical shared recipes', () => {
  const preview = new MediaPreviewCard();
  const card = preview.renderCard({
    kind: 'image',
    label: 'Reference',
    url: './theme/icons/android.svg'
  });
  const addCard = preview.renderAddCard({ kind: 'image' });
  const fontCard = preview.renderFontCard({
    familyName: 'Montserrat',
    fontFamily: 'Montserrat',
    selectable: true,
    badges: [
      { label: 'ttf', tag: 'em' },
      { label: 'Unused', className: 'vault-usage is-unused' }
    ],
    overlayActions: [{ iconRole: 'favorite', ariaLabel: 'Add to Favorites' }]
  });
  const addFontCard = preview.renderAddCard({
    kind: 'font',
    presentation: 'reduced'
  });
  const busyAction = preview.renderAction({ busy: true, label: 'Transcribing' });
  const emptyReference = referenceImagePickerMarkup();
  const reference = referenceImagePickerMarkup({
    image: { label: 'Palette reference', src: './theme/icons/linux.svg' }
  });

  assert.match(card, /class="bb-media-card/);
  assert.match(card, /class="bb-media-preview/);
  assert.match(addCard, /class="bb-media-card bb-media-add-card/);
  assert.match(addCard, /data-bb-icon-role="add"/);
  assert.doesNotMatch(addCard, /<svg|<path/);
  assert.match(fontCard, /class="bb-font-preview-card__name"/);
  assert.match(fontCard, />Montserrat<\/span>/);
  assert.match(fontCard, /<strong[^>]*>Montserrat<\/strong>/);
  assert.match(fontCard, /bb-media-card__body/);
  assert.doesNotMatch(fontCard, /bb-font-preview-card__status/);
  assert.match(fontCard, /bb-media-card__badge/);
  assert.match(fontCard, /data-bb-icon-role="favorite"/);
  assert.match(addFontCard, />Add Font</);
  assert.match(addFontCard, /class="bb-media-card bb-media-add-card/);
  assert.doesNotMatch(addFontCard, /bb-font-add-card/);
  assert.match(busyAction, /data-bb-icon-role="progress"/);
  assert.doesNotMatch(busyAction, /<svg|<path/);
  assert.match(emptyReference, /data-theme-reference-image-action="choose"/);
  assert.match(emptyReference, /bb-workspace-control-button--icon-label/);
  assert.match(emptyReference, /bb-workspace-control-label">Choose reference image/);
  assert.doesNotMatch(reference, /data-theme-reference-image-action="choose"/);
  assert.match(reference, /data-theme-reference-image-action="swap"/);
  assert.match(reference, /data-theme-reference-image-action="zoom-out"/);
  assert.match(reference, /data-theme-reference-image-action="fit"/);
  assert.match(reference, /data-theme-reference-image-action="zoom-in"/);
  assert.match(reference, /data-theme-reference-image-action="remove"/);
  assert.match(reference, /data-bb-icon-role="swap_horiz"/);
  assert.match(reference, /data-theme-reference-image-viewport/);
  assert.match(reference, /class="bb-media-reference-picker__viewport bb-scrollbar"/);
  assert.doesNotMatch(reference, /<figcaption>/);
  assert.match(
    interfacePrimitives,
    /\.bb-workspace-control-button--icon-label\s*\{[^}]*display:\s*inline-flex;[^}]*align-items:\s*center;[^}]*gap:\s*var\(--bb-spacing-2\);/s
  );
  assert.match(
    interfacePrimitives,
    /\.bb-workspace-control-button--icon-label > \.bb-workspace-control-label\s*\{[^}]*transform:\s*translateY\(1px\);/s
  );
  assert.match(reference, /\.\/theme\/icons\/linux\.svg/);
  assert.ok(MANAGED_WEB_COMPONENTS['media-preview-card']);
  assert.ok(MANAGED_WEB_COMPONENTS['font-preview-card']);
  assert.ok(MANAGED_WEB_COMPONENTS['reference-image-picker']);
  assert.ok(MANAGED_WEB_COMPONENTS['reference-image-picker'].dependencies.stylesheets.includes('components/scrollbar.css'));
  assert.match(mediaPickerCss, /data-theme-reference-image-zoom-mode="custom"/);
  assert.match(mediaPickerCss, /bb-media-reference-picker__controls\s*\{[^}]*right:\s*16px;/s);
  assert.match(mediaPickerCss, /bb-media-reference-picker__preview:is\(:hover, :focus-within\)[\s\S]*opacity:\s*1/);
  assert.match(mediaPickerCss, /bb-media-reference-picker__viewport\.is-pannable[\s\S]*cursor:\s*grab/);
  assert.match(mediaPickerCss, /\.bb-font-preview-card-grid\s*\{[^}]*--bb-font-media-card-width:\s*216px;[^}]*repeat\(auto-fill, var\(--bb-font-media-card-width\)\)/s);
  assert.match(mediaPickerCss, /\.bb-media-card,[\s\S]*--bb-media-card-body-min-height:\s*88px;[\s\S]*minmax\(var\(--bb-media-card-body-min-height\), auto\)/s);
  assert.match(mediaPickerCss, /\.bb-font-preview-card\s*\{[^}]*--bb-media-card-body-min-height:\s*0px;/s);
  assert.match(mediaPickerCss, /\.bb-media-preview--font\s*\{[^}]*min-height:\s*120px;[^}]*aspect-ratio:\s*auto;[^}]*padding:\s*16px;[^}]*color:\s*var\(--bb-v2-color-content-primary\);/s);
  assert.doesNotMatch(mediaPickerCss, /\.bb-media-preview--font\s*\{[^}]*background:/s);
  assert.match(mediaPickerCss, /\.bb-font-preview-card__name\s*\{[^}]*font-family:\s*var\(--bb-font-preview-family\);/s);
  assert.match(mediaPickerCss, /\.bb-font-preview-card__name\s*\{[^}]*white-space:\s*nowrap;/s);
  assert.doesNotMatch(mediaPickerCss, /bb-font-preview-card__status/);
  assert.doesNotMatch(mediaPickerCss, /bb-font-add-card/);
});

test('Theme gallery scrollbars use the selected Theme identity within the gallery host', () => {
  const values = new Map();
  const scrollOwnerValues = new Map();
  const scrollOwner = {
    style: {
      setProperty(name, value) { scrollOwnerValues.set(name, value); }
    }
  };
  const host = {
    querySelectorAll(selector) { return selector === '.bb-scrollbar' ? [scrollOwner] : []; },
    style: {
      setProperty(name, value) { values.set(name, value); }
    }
  };
  const selectedMode = theme.v2.modes.dark.variables;

  applyThemeGalleryVariables(host, catalog, {
    mode: 'dark',
    themeId: theme.id
  });

  assert.equal(values.get('--bb-interface-scrollbar-thumb'), selectedMode['--bb-v2-identity-primary']);
  assert.equal(values.get('--bb-interface-scrollbar-track'), selectedMode['--bb-v2-color-surface-canvas']);
  assert.equal(values.get('--bb-interface-scrollbar-border'), selectedMode['--bb-v2-color-border-subtle']);
  assert.equal(values.get('--bb-interface-scrollbar-highlight'), selectedMode['--bb-v2-identity-primary-foreground']);
  assert.equal(
    values.get('scrollbar-color'),
    `${selectedMode['--bb-v2-identity-primary']} ${selectedMode['--bb-v2-color-surface-canvas']}`
  );
  assert.equal(scrollOwnerValues.get('--bb-interface-scrollbar-thumb'), selectedMode['--bb-v2-identity-primary']);
  assert.equal(scrollOwnerValues.get('scrollbar-color'), values.get('scrollbar-color'));
});

test('editable Theme detail identifies the mode and always exposes a reference-image action', () => {
  for (const mode of ['light', 'dark']) {
    const markup = themeDetailMarkup(theme, mode, {
      editable: true,
      includeShowcase: false
    });
    assert.match(markup, new RegExp(`data-theme-palette-mode-label>${mode} mode<`));
    assert.match(markup, /data-theme-reference-image-action="choose"/);
    assert.doesNotMatch(markup, /data-theme-reference-image-preview/);
  }
});

test('editable Theme detail uses the compact palette recipe and neutral hierarchy color', () => {
  const markup = themeDetailMarkup(theme, 'dark', {
    editable: true,
    includeShowcase: false,
    paletteCompletion: {
      options: [{ value: 'manual', label: 'Manual' }],
      value: 'manual'
    }
  });

  assert.match(markup, /bb-selection-controls bb-selection-controls--inline/);
  assert.match(selectionControlsCss, /bb-selection-controls--inline\s*\{[^}]*margin:\s*0;[^}]*justify-self:\s*start;/s);
  assert.match(themeGalleryCss, /data-theme-detail-mode="edit"[\s\S]*padding-block:\s*clamp\(18px, 2\.5vw, 32px\)/);
  assert.match(themeGalleryCss, /bb-theme-v2-mode-label[\s\S]*bb-theme-v2-neutral-foreground[\s\S]*68%/);
  assert.match(themeGalleryCss, /data-theme-detail-mode="edit"[\s\S]*grid-template-columns:\s*repeat\(4, minmax\(112px, 172px\)\)/);
  assert.match(mediaPickerCss, /bb-media-reference-picker__controls\s*\{[\s\S]*--bb-interface-control-foreground:\s*var\(--bb-v2-color-surface-inverse\)/);
  assert.match(mediaPickerCss, /bb-media-reference-picker__controls\s*\{[\s\S]*--bb-interface-control-disabled-foreground:[\s\S]*52%/);
});

test('the standalone showcase loads media recipes and uses repository-safe asset URLs', () => {
  const markup = themeDetailMarkup(theme, 'dark');
  assert.match(showcase, /\.\/theme\/components\/content-media\.css/);
  assert.match(showcase, /\.\/theme\/components\/media-picker\.css/);
  assert.match(markup, /Media picker and reference image/);
  assert.match(markup, /src="\.\/theme\//);
  assert.doesNotMatch(markup, /(?:src|href)="\/theme\//);
});
