import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { MANAGED_WEB_COMPONENTS } from '../components/managed-components.js';
import {
  MediaPreviewCard,
  mediaPreviewIcon,
  referenceImagePickerMarkup
} from '../components/media-picker.js';
import { themeDetailMarkup } from '../components/theme-gallery.js';

const catalog = JSON.parse(await readFile(
  new URL('../dist/web/catalog.json', import.meta.url),
  'utf8'
));
const showcase = await readFile(new URL('../showcase/index.html', import.meta.url), 'utf8');
const interfacePrimitives = await readFile(
  new URL('../components/interface-primitives.css', import.meta.url),
  'utf8'
);
const theme = catalog.themes.find((entry) => entry.id === 'bitsandbolts');

test('media preview icons use Themes semantic roles without inline artwork', () => {
  for (const kind of ['audio', 'video', 'image', 'device', 'play', 'stop']) {
    const markup = mediaPreviewIcon(kind);
    assert.match(markup, /class="bb-semantic-icon/);
    assert.doesNotMatch(markup, /<svg|<path|<rect/);
  }
});

test('media cards and reference images use the canonical shared recipes', () => {
  const preview = new MediaPreviewCard();
  const card = preview.renderCard({
    kind: 'image',
    label: 'Reference',
    url: './theme/icons/android.svg'
  });
  const addCard = preview.renderAddCard({ kind: 'image' });
  const busyAction = preview.renderAction({ busy: true, label: 'Transcribing' });
  const reference = referenceImagePickerMarkup({
    image: { label: 'Palette reference', src: './theme/icons/linux.svg' }
  });

  assert.match(card, /class="bb-media-card/);
  assert.match(card, /class="bb-media-preview/);
  assert.match(addCard, /class="bb-media-card bb-media-add-card/);
  assert.match(addCard, /data-bb-icon-role="add"/);
  assert.doesNotMatch(addCard, /<svg|<path/);
  assert.match(busyAction, /data-bb-icon-role="progress"/);
  assert.doesNotMatch(busyAction, /<svg|<path/);
  assert.match(reference, /data-theme-reference-image-action="choose"/);
  assert.match(reference, /data-theme-reference-image-action="remove"/);
  assert.match(reference, /bb-workspace-control-button--icon-label/);
  assert.match(reference, /bb-workspace-control-label">Change reference image/);
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
  assert.ok(MANAGED_WEB_COMPONENTS['reference-image-picker']);
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

test('the standalone showcase loads media recipes and uses repository-safe asset URLs', () => {
  const markup = themeDetailMarkup(theme, 'dark');
  assert.match(showcase, /\.\/theme\/components\/content-media\.css/);
  assert.match(showcase, /\.\/theme\/components\/media-picker\.css/);
  assert.match(markup, /Media picker and reference image/);
  assert.match(markup, /src="\.\/theme\//);
  assert.doesNotMatch(markup, /(?:src|href)="\/theme\//);
});
