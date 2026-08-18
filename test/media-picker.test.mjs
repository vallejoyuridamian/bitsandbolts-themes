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
import { workspaceSectionMarkup } from '../components/workspace-section.js';

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
const heroCss = await readFile(new URL('../components/hero.css', import.meta.url), 'utf8');
const productEntryCss = await readFile(new URL('../components/product-entry.css', import.meta.url), 'utf8');
const navbarCss = await readFile(new URL('../components/navbar.css', import.meta.url), 'utf8');
const buttonCss = await readFile(new URL('../components/button.css', import.meta.url), 'utf8');
const typographyCss = await readFile(new URL('../components/typography.css', import.meta.url), 'utf8');
const bitsAndBoltsDarkCss = await readFile(
  new URL('../dist/web/bitsandbolts/dark.css', import.meta.url),
  'utf8'
);
const theme = catalog.themes.find((entry) => entry.id === 'bitsandbolts');

test('Bits and Bolts dark mode owns the accepted app canvas', () => {
  const darkVariables = theme.v2.modes.dark.variables;

  assert.equal(darkVariables['--bb-v2-color-surface-canvas'], '#080D12');
  assert.match(bitsAndBoltsDarkCss, /--bb-interface-workspace-background:\s*#080D12;/);
});

test('workspace sections share one Themes-owned shell and semantic disclosure icon', () => {
  const markup = workspaceSectionMarkup({
    compact: true,
    content: '<div>Cards</div>',
    count: 2,
    id: 'user-fonts',
    label: 'User Fonts',
    open: true
  });

  assert.match(markup, /class="bb-workspace-section bb-workspace-section--compact"/);
  assert.match(markup, /data-bb-icon-role="submenu"/);
  assert.match(markup, /bb-workspace-section__label">User Fonts/);
  assert.match(markup, /bb-workspace-section__count">2/);
  assert.match(markup, /<details[^>]* open>/);
  assert.ok(MANAGED_WEB_COMPONENTS['workspace-section']);
  assert.match(interfacePrimitives, /\.bb-workspace-section\s*\{[^}]*border-bottom:\s*1px solid var\(--bb-v2-color-border-subtle\);[^}]*border-radius:\s*0;[^}]*background:\s*transparent;/s);
  assert.match(interfacePrimitives, /\.bb-workspace-section\[open\] > summary \.bb-workspace-section__count\s*\{[^}]*display:\s*none;/s);
  assert.doesNotMatch(interfacePrimitives, /\.bb-workspace-section > summary::before/);
});

test('managed selection controls publish their semantic icon runtime dependency', () => {
  assert.deepEqual(
    MANAGED_WEB_COMPONENTS['selection-controls'].dependencies.modules,
    ['components/semantic-icons.js', 'components/select.js']
  );
});

test('media preview icons use Themes semantic roles without inline artwork', () => {
  for (const kind of ['audio', 'video', 'image', 'device', 'font', 'play', 'stop']) {
    const markup = mediaPreviewIcon(kind);
    assert.match(markup, /class="bb-semantic-icon/);
    assert.doesNotMatch(markup, /<svg|<path|<rect/);
  }
});

test('font card grids share one column width derived from the widest rendered name', () => {
  const values = [new Map(), new Map()];
  const grids = [{
    ownerDocument: {},
    querySelectorAll() {
      return [{ scrollWidth: 112 }, { scrollWidth: 241 }];
    },
    style: {
      removeProperty(name) { values[0].delete(name); },
      setProperty(name, value) { values[0].set(name, value); }
    }
  }, {
    ownerDocument: {},
    querySelectorAll() {
      return [{ scrollWidth: 300 }];
    },
    style: {
      removeProperty(name) { values[1].delete(name); },
      setProperty(name, value) { values[1].set(name, value); }
    }
  }];
  const root = { querySelectorAll: () => grids };
  const preview = new MediaPreviewCard();

  assert.equal(preview.syncFontCardGridWidths(root), 2);
  assert.equal(values[0].get('--bb-font-media-card-width'), '340px');
  assert.equal(values[1].get('--bb-font-media-card-width'), '340px');
});

test('every asset kind uses the same pill-free reduced picker-card sibling', () => {
  const preview = new MediaPreviewCard();
  const badge = [{ label: 'Metadata pill' }];
  const cards = [
    preview.renderCard({ kind: 'image', path: 'image.png', label: 'Image', badges: badge, presentation: 'reduced' }),
    preview.renderCard({ kind: 'video', path: 'video.mp4', label: 'Video', badges: badge, presentation: 'reduced' }),
    preview.renderCard({ kind: 'audio', path: 'audio.mp3', label: 'Audio', badges: badge, presentation: 'reduced' }),
    preview.renderDeviceCard({
      item: { path: 'device.glb', label: 'Device', usageCount: 2 },
      presentation: 'reduced'
    }),
    preview.renderFontCard({
      familyName: 'Source Serif 4',
      fontFamily: 'Source Serif 4',
      badges: badge,
      presentation: 'reduced'
    })
  ];

  cards.forEach((card) => {
    assert.match(card, /bb-media-card--reduced/);
    assert.doesNotMatch(card, /bb-media-card__badge|Metadata pill|Used 2/);
  });
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
  const reducedFontCard = preview.renderFontCard({
    familyName: 'Source Serif 4',
    fontFamily: 'Source Serif 4',
    presentation: 'reduced',
    badges: [{ label: 'ttf', tag: 'em' }]
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
  assert.match(fontCard, /bb-media-card--full/);
  assert.match(fontCard, /data-bb-icon-role="favorite"/);
  assert.match(reducedFontCard, /bb-media-card--reduced/);
  assert.doesNotMatch(reducedFontCard, /bb-media-card__body|bb-media-card__badge|>ttf</);
  assert.match(addFontCard, />Add Font</);
  assert.match(addFontCard, /class="bb-media-card bb-media-add-card/);
  assert.match(addFontCard, /bb-media-card--reduced/);
  assert.doesNotMatch(addFontCard, /bb-media-add-card__formats/);
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
  assert.match(mediaPickerCss, /\.bb-media-card--full\s*\{[^}]*--bb-media-card-body-min-height:\s*88px;[^}]*minmax\(var\(--bb-media-card-body-min-height\), auto\)/s);
  assert.match(mediaPickerCss, /\.bb-media-card--reduced\s*\{[^}]*--bb-media-card-body-min-height:\s*0px;[^}]*grid-template-rows:\s*auto auto;/s);
  assert.match(mediaPickerCss, /\.bb-font-preview-card\.bb-media-card--full\s*\{[^}]*--bb-media-card-body-min-height:\s*0px;/s);
  assert.match(mediaPickerCss, /:is\(\.bb-media-picker, \.floating-media-picker\) \.bb-font-preview-card-grid\s*\{[^}]*var\(--bb-font-media-card-width\)/s);
  assert.match(mediaPickerCss, /\.bb-font-preview-card\.bb-media-card--full\s*\{[^}]*--bb-font-preview-min-height:\s*120px;/s);
  assert.match(mediaPickerCss, /\.bb-font-preview-card\.bb-media-card--reduced\s*\{[^}]*--bb-font-preview-min-height:\s*56px;/s);
  assert.match(mediaPickerCss, /\.bb-font-preview-card\.bb-media-card--reduced \.bb-media-preview--font\s*\{[^}]*border-radius:\s*7px;/s);
  assert.match(mediaPickerCss, /\.bb-media-preview--font\s*\{[^}]*min-height:\s*var\(--bb-font-preview-min-height, 120px\);[^}]*aspect-ratio:\s*auto;[^}]*padding:\s*16px;[^}]*color:\s*var\(--bb-v2-color-content-primary\);/s);
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

test('Theme summary cards reserve one exact shared row for the identity strip', () => {
  assert.match(
    themeGalleryCss,
    /\.bb-theme-summary-card\s*\{[^}]*grid-template-rows:\s*minmax\(0, 1fr\);/s
  );
  assert.match(
    themeGalleryCss,
    /\.bb-theme-summary-card__open\s*\{[^}]*height:\s*100%;[^}]*grid-template-rows:\s*var\(--bb-theme-summary-card-header-block-size\)\s*minmax\(260px, 1fr\)\s*var\(--bb-theme-summary-card-identities-block-size\);/s
  );
});

test('landing recipes consume semantic typography roles without synthesizing Ultra weights', () => {
  assert.match(
    typographyCss,
    /@font-face\s*\{[^}]*font-family:\s*"Ultra";[^}]*font-weight:\s*400;/s
  );
  assert.match(
    heroCss,
    /\.bb-hero__heading\s*\{[^}]*font-family:\s*var\(--bb-v2-type-display-large-family\);[^}]*font-weight:\s*var\(--bb-v2-type-display-large-font-weight,[^}]*letter-spacing:\s*var\(--bb-v2-type-display-large-letter-spacing, 0\);/s
  );
  assert.doesNotMatch(heroCss, /\.bb-hero__heading\s*\{[^}]*letter-spacing:\s*0\.1rem;/s);
  assert.match(
    productEntryCss,
    /\.bb-product-proof__placeholder strong\s*\{[^}]*font-family:\s*var\(--bb-v2-type-display-family\);[^}]*font-weight:\s*var\(--bb-v2-type-display-font-weight,[^}]*letter-spacing:\s*var\(--bb-v2-type-display-letter-spacing, 0\);/s
  );
  assert.match(
    productEntryCss,
    /\.bb-product-section--identity h2\s*\{[^}]*font-family:\s*var\(--bb-v2-type-display-family\);[^}]*font-weight:\s*var\(--bb-v2-type-display-font-weight,[^}]*letter-spacing:\s*var\(--bb-v2-type-display-letter-spacing, 0\);/s
  );
  assert.match(
    productEntryCss,
    /\.bb-product-poster strong\s*\{[^}]*font-family:\s*var\(--bb-v2-type-display-family\);[^}]*font-weight:\s*var\(--bb-v2-type-display-font-weight,[^}]*letter-spacing:\s*var\(--bb-v2-type-display-letter-spacing, 0\);/s
  );
  assert.match(
    navbarCss,
    /\.bb-navbar__brand > span:last-child\s*\{[^}]*font-family:\s*var\(--bb-v2-type-display-family\);[^}]*font-weight:\s*var\(--bb-v2-type-display-font-weight,/s
  );
  assert.match(
    navbarCss,
    /\.bb-navbar__link\s*\{[^}]*font-family:\s*var\(--bb-v2-type-label-family\);[^}]*font-weight:\s*var\(--bb-v2-type-label-font-weight,[^}]*letter-spacing:\s*var\(--bb-v2-type-label-letter-spacing, 0\);/s
  );
  assert.match(
    navbarCss,
    /\.bb-navbar__brand small\s*\{[^}]*font-family:\s*var\(--bb-v2-type-caption-family\);[^}]*font-weight:\s*var\(--bb-v2-type-caption-font-weight,/s
  );
  assert.match(
    buttonCss,
    /\.bb-btn-neon\s*\{[^}]*font-family:\s*var\(--bb-v2-type-display-family\);[^}]*font-weight:\s*var\(--bb-v2-type-display-font-weight,[^}]*letter-spacing:\s*var\(--bb-v2-type-display-letter-spacing, 0\);/s
  );
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
  assert.match(markup, /Handled media picker window/);
  assert.match(markup, /src="\.\/theme\//);
  assert.doesNotMatch(markup, /(?:src|href)="\/theme\//);
});
