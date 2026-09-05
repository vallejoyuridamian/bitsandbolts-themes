import { semanticActionButtonMarkup } from './button.js';
import { semanticIconMarkup } from './semantic-icons.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function dashCase(value = '') {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replaceAll('_', '-')
    .toLowerCase();
}

function actionDataset(action = {}, escapeAttribute = escapeHtml) {
  return Object.entries(action)
    .filter(([, value]) => value != null && value !== '')
    .map(([key, value]) => `data-${dashCase(key)}="${escapeAttribute(value)}"`)
    .join(' ');
}

function normalizeMediaKind(kind = '') {
  return ['image', 'audio', 'video', 'device', 'font', 'icon'].includes(kind) ? kind : 'image';
}

const MEDIA_ICON_ROLES = Object.freeze({
  audio: 'media_audio',
  device: 'media_device',
  font: 'media_font',
  icon: 'star',
  image: 'media_image',
  video: 'media_video'
});

function cssFontFamily(value = '') {
  const normalized = String(value || '')
    .trim()
    .replace(/[\u0000-\u001f\u007f]/g, ' ');
  return `"${normalized.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`;
}

export const mediaPreviewCardPresentations = Object.freeze({
  full: 'full',
  reduced: 'reduced'
});

export function mediaAssetKindLabel(kind = '') {
  if (kind === 'image') return 'Image';
  if (kind === 'audio') return 'Audio';
  if (kind === 'video') return 'Video';
  if (kind === 'device') return 'Device';
  if (kind === 'font') return 'Font';
  if (kind === 'icon') return 'Icon';
  return 'Asset';
}

export function mediaAssetAddLabel(kind = '') {
  return `Add ${mediaAssetKindLabel(kind)}`;
}

export function mediaAssetFormatLabel(kind = '') {
  if (kind === 'image') return 'PNG JPG SVG WEBP';
  if (kind === 'audio') return 'WAV MP3 M4A OGG OPUS';
  if (kind === 'video') return 'MP4 WEBM';
  if (kind === 'device') return 'GLB GLTF STEP STP';
  if (kind === 'font') return 'TTF OTF WOFF WOFF2';
  return 'FILE';
}

export function fileNameFromPath(path = '') {
  return String(path || '').replaceAll('\\', '/').split('/').pop() || '';
}

export function assetLabelFromPath(assetPath = '') {
  return fileNameFromPath(assetPath) || 'Asset';
}

export function mediaAssetDisplayName(kind = '', label = '', assetPath = '') {
  const text = String(label || '');
  if (!text || !['image', 'audio', 'video', 'font'].includes(kind)) return text;
  const fileName = fileNameFromPath(assetPath);
  const extension = fileName.match(/\.[^./]+$/)?.[0] || '';
  if (!extension || !text.toLocaleLowerCase('en').endsWith(extension.toLocaleLowerCase('en'))) {
    return text;
  }
  return fileName.replace(/\.[^./]+$/, '') || fileName;
}

export function mediaPreviewIcon(kind = '') {
  const role = kind === 'play'
    ? 'play_arrow'
    : kind === 'stop'
      ? 'stop'
      : MEDIA_ICON_ROLES[normalizeMediaKind(kind)];
  return semanticIconMarkup(role, 'bb-media-icon');
}

export class MediaPreviewElement {
  constructor({
    escapeAttribute = escapeHtml,
    escapeHtml: escapeText = escapeHtml,
    assetFileUrl = (path) => path,
    videoThumbnailUrl = () => '',
    mediaAssetDisplayName: displayNameResolver = mediaAssetDisplayName
  } = {}) {
    this.escapeAttribute = escapeAttribute;
    this.escapeHtml = escapeText;
    this.assetFileUrl = assetFileUrl;
    this.videoThumbnailUrl = videoThumbnailUrl;
    this.mediaAssetDisplayName = displayNameResolver;
  }

  render({
    kind = '',
    path = '',
    url = '',
    label = '',
    thumbnailPath = '',
    thumbnailRevision = '',
    action = {},
    interactive = true,
    measured = false,
    className = '',
    fontFamily = '',
    iconFamily = '',
    iconRole = '',
    iconStyle = '',
    videoPlayAffordance = true
  } = {}) {
    const mediaKind = normalizeMediaKind(kind);
    const safePath = this.escapeAttribute(path);
    const sourceUrl = String(url || '');
    const safeLabel = this.escapeAttribute(label || fileNameFromPath(path) || mediaKind);
    const actionable = interactive && Object.values(action).some((value) => value != null && value !== '');
    const actionAccessibility = actionable
      ? ` role="button" tabindex="0" aria-label="Preview ${safeLabel}"`
      : '';
    const classes = [
      'bb-media-preview',
      `bb-media-preview--${mediaKind}`,
      'media-preview-element',
      `media-preview-element-${mediaKind}`,
      'vault-thumb',
      `vault-thumb-${mediaKind}`,
      className
    ].filter(Boolean).join(' ');
    const dataset = actionDataset(action, this.escapeAttribute);
    if (mediaKind === 'icon' && iconRole) {
      return `
        <div class="${classes}" data-media-preview-kind="icon" data-media-preview-path="${safePath}"${actionAccessibility} ${dataset}>
          ${semanticIconMarkup(iconRole, 'bb-media-preview__semantic-icon', {
            family: iconFamily,
            style: iconStyle
          })}
        </div>
      `;
    }
    if (mediaKind === 'device' && thumbnailPath) {
      return `
        <div class="${classes}" data-media-preview-kind="device" data-media-preview-path="${safePath}"${actionAccessibility} ${dataset}>
          <img src="${this.escapeAttribute(this.assetFileUrl(thumbnailPath, { revision: thumbnailRevision }))}" alt="" loading="lazy" draggable="false">
        </div>
      `;
    }
    if (mediaKind === 'image' && (path || sourceUrl)) {
      return `
        <div class="${classes}" data-media-preview-kind="image" data-media-preview-path="${safePath}"${actionAccessibility} ${dataset}>
          <img src="${this.escapeAttribute(sourceUrl || this.assetFileUrl(path))}" alt="" loading="lazy" draggable="false"${measured ? ' data-media-preview-measured' : ''}>
        </div>
      `;
    }
    if (mediaKind === 'audio' && path) {
      const tag = interactive ? 'button' : 'div';
      return `
        <${tag} class="${classes}" ${interactive ? `type="button" aria-label="Preview ${safeLabel}"` : 'aria-hidden="true"'} ${dataset}>
          <span class="bb-media-preview__icon bb-media-preview__icon--default media-preview-icon media-preview-icon-default vault-thumb-icon vault-thumb-icon-default">${mediaPreviewIcon('audio')}</span>
          <span class="bb-media-preview__icon bb-media-preview__icon--play media-preview-icon media-preview-icon-play vault-thumb-icon vault-thumb-icon-play">${mediaPreviewIcon('play')}</span>
          <span class="bb-media-preview__icon bb-media-preview__icon--stop media-preview-icon media-preview-icon-stop vault-thumb-icon vault-thumb-icon-stop">${mediaPreviewIcon('stop')}</span>
        </${tag}>
      `;
    }
    if (mediaKind === 'font' && (label || fontFamily)) {
      const displayName = String(label || fontFamily).trim() || 'Font';
      const previewFamily = cssFontFamily(fontFamily || displayName);
      return `
        <div class="${classes}" data-media-preview-kind="font" data-media-preview-path="${safePath}"${actionAccessibility} ${dataset}>
          <span class="bb-font-preview-card__name" style="--bb-font-preview-family: ${this.escapeAttribute(previewFamily)}">${this.escapeHtml(displayName)}</span>
        </div>
      `;
    }
    if (mediaKind === 'video' && (path || sourceUrl)) {
      const thumbnailUrl = sourceUrl ? '' : this.videoThumbnailUrl(path);
      return `
        <div class="${classes}" data-media-preview-kind="video" data-media-preview-path="${safePath}"${actionAccessibility} ${dataset}>
          ${thumbnailUrl
            ? `<img src="${this.escapeAttribute(thumbnailUrl)}" alt="" loading="lazy" draggable="false"${measured ? ' data-media-preview-measured' : ''}>`
            : `<video src="${this.escapeAttribute(sourceUrl || this.assetFileUrl(path))}" preload="metadata" muted playsinline${measured ? ' data-media-preview-measured' : ''}></video>`}
          ${videoPlayAffordance
            ? `<span class="bb-media-preview__video-play media-preview-video-play vault-video-play" aria-hidden="true">${mediaPreviewIcon('play')}</span>`
            : ''}
        </div>
      `;
    }
    return `<div class="${classes}" ${dataset}>${mediaPreviewIcon(mediaKind)}</div>`;
  }
}

export class MediaPreviewCard extends MediaPreviewElement {
  renderCard({
    kind = '',
    path = '',
    url = '',
    label = '',
    subtitle = '',
    thumbnailPath = '',
    thumbnailRevision = '',
    className = '',
    dataset = {},
    draggable = false,
    measured = false,
    previewAction = {},
    badges = [],
    overlayActions = [],
    actions = [],
    extraHtml = '',
    fontFamily = '',
    iconFamily = '',
    iconRole = '',
    iconStyle = '',
    loading = false,
    presentation = mediaPreviewCardPresentations.full,
    selectable = false,
    selected = false,
    showBody = true,
    showBodyLabel = true,
    statusHtml = '',
    unavailable = false,
    videoPlayAffordance = true
  } = {}) {
    const mediaKind = normalizeMediaKind(kind);
    const reduced = presentation === mediaPreviewCardPresentations.reduced;
    const hasPreviewAction = Object.values(previewAction).some((value) => value != null && value !== '');
    const safePath = this.escapeAttribute(path);
    const displayLabel = this.mediaAssetDisplayName(mediaKind, label || assetLabelFromPath(path), path);
    const displaySubtitle = this.mediaAssetDisplayName(mediaKind, subtitle, path);
    const safeLabel = this.escapeAttribute(displayLabel);
    const attrs = actionDataset(dataset, this.escapeAttribute);
    const cardClass = [
      'bb-media-card',
      reduced ? 'bb-media-card--reduced' : 'bb-media-card--full',
      'vault-card',
      'media-preview-card',
      selectable ? 'is-selectable' : '',
      selected ? 'is-selected' : '',
      loading ? 'is-loading' : '',
      unavailable ? 'is-unavailable' : '',
      className
    ].filter(Boolean).join(' ');
    return `
      <article
        class="${cardClass}"
        data-media-card-kind="${this.escapeAttribute(mediaKind)}"
        data-media-card-path="${safePath}"
        data-media-card-label="${safeLabel}"
        ${attrs}
        draggable="${draggable ? 'true' : 'false'}"
        ${selectable ? `role="button" tabindex="0" aria-pressed="${selected ? 'true' : 'false'}"` : ''}
        ${loading ? 'aria-busy="true"' : ''}
        ${unavailable ? 'aria-disabled="true"' : ''}
        aria-label="${safeLabel}"
      >
        ${this.render({
          kind: mediaKind,
          path,
          url,
          label: displayLabel,
          thumbnailPath,
          thumbnailRevision,
          interactive: !selectable || hasPreviewAction,
          measured,
          action: previewAction,
          fontFamily,
          iconFamily,
          iconRole,
          iconStyle,
          videoPlayAffordance
        })}
        ${statusHtml}
        ${overlayActions.length ? `<div class="bb-media-card__overlay-actions vault-card-overlay-actions media-preview-card-overlay-actions">${overlayActions.map((action) => this.renderAction(action)).join('')}</div>` : ''}
        ${showBody
          ? `<div class="bb-media-card__body vault-card-body media-preview-card-body">
            ${showBodyLabel ? `<strong title="${safeLabel}">${this.escapeHtml(displayLabel)}</strong>` : ''}
            ${!reduced && displaySubtitle ? `<span title="${this.escapeAttribute(displaySubtitle)}">${this.escapeHtml(displaySubtitle)}</span>` : ''}
            ${!reduced && badges.length ? `<div class="bb-media-card__meta vault-card-meta media-preview-card-meta">${badges.map((badge) => this.renderBadge(badge)).join('')}</div>` : ''}
            ${reduced ? '' : extraHtml}
            ${!reduced && actions.length ? `<div class="bb-media-card__actions vault-card-actions media-preview-card-actions">${actions.map((action) => this.renderAction(action)).join('')}</div>` : ''}
          </div>`
          : ''}
      </article>
    `;
  }

  renderFontCard({
    familyName = '',
    fontFamily = familyName,
    path = '',
    className = '',
    dataset = {},
    presentation = mediaPreviewCardPresentations.full,
    selectable = false,
    selected = false,
    badges = [],
    overlayActions = [],
    actions = [],
    loading = false
  } = {}) {
    const name = String(familyName || '').trim() || 'Font';
    const reduced = presentation === mediaPreviewCardPresentations.reduced;
    return this.renderCard({
      kind: 'font',
      path,
      label: name,
      fontFamily,
      className: ['bb-font-preview-card', className].filter(Boolean).join(' '),
      dataset,
      presentation,
      selectable,
      selected,
      badges,
      overlayActions,
      actions,
      loading,
      showBody: !reduced
    });
  }

  renderIconCard({
    item = {},
    label = item.label || 'Icon',
    className = '',
    dataset = {},
    presentation = mediaPreviewCardPresentations.full,
    selectable = false,
    selected = false
  } = {}) {
    return this.renderCard({
      kind: 'icon',
      path: item.path || '',
      label,
      iconFamily: item.iconFamily || '',
      iconRole: item.iconRole || '',
      iconStyle: item.iconStyle || '',
      className,
      dataset,
      presentation,
      selectable,
      selected
    });
  }

  syncFontCardGridWidths(root = globalThis.document) {
    const grids = root?.matches?.('.bb-font-preview-card-grid')
      ? [root]
      : [...(root?.querySelectorAll?.('.bb-font-preview-card-grid') ?? [])];
    const measure = () => {
      grids.forEach((grid) => grid.style?.removeProperty?.('--bb-font-media-card-width'));
      const textWidths = grids.flatMap((grid) => [...grid.querySelectorAll(
        '.bb-font-preview-card__name, .bb-font-preview-card .bb-media-card__body > strong'
      )].map((element) => Number(element.scrollWidth) || 0));
      const width = Math.max(216, ...textWidths.map((value) => Math.ceil(value + 40)));
      grids.forEach((grid) => grid.style?.setProperty?.('--bb-font-media-card-width', `${width}px`));
      return width;
    };
    measure();
    const fontReadiness = grids[0]?.ownerDocument?.fonts?.ready;
    if (fontReadiness?.then) {
      Promise.resolve(fontReadiness).then(() => {
        const schedule = globalThis.requestAnimationFrame || ((callback) => callback());
        schedule(measure);
      });
    }
    return grids.length;
  }

  renderDeviceCard({
    item = {},
    label = item.label || assetLabelFromPath(item.path),
    className = '',
    dataset = {},
    draggable = false,
    overlayActions = [],
    actions = [],
    presentation = mediaPreviewCardPresentations.full,
    previewAction = {},
    selectable = false
  } = {}) {
    const thumbnailPath = item.thumbnailPath || item.deviceBundle?.thumbnailPath || '';
    const thumbnailRevision = item.thumbnailRevision
      || item.deviceBundle?.thumbnailRevision
      || item.savedAt
      || item.deviceBundle?.savedAt
      || '';
    return this.renderCard({
      kind: 'device',
      path: item.path || '',
      label,
      thumbnailPath,
      thumbnailRevision,
      className,
      dataset,
      draggable,
      overlayActions,
      badges: [this.usageBadge(item)],
      actions,
      presentation,
      previewAction,
      selectable
    });
  }

  renderAddCard({
    kind = '',
    label = mediaAssetAddLabel(kind),
    subtitle = 'Media library',
    formats = mediaAssetFormatLabel(kind),
    className = '',
    dataset = {},
    presentation = mediaPreviewCardPresentations.full,
    title = label
  } = {}) {
    const reduced = presentation === mediaPreviewCardPresentations.reduced;
    const cardClass = [
      'bb-media-card',
      'bb-media-add-card',
      reduced ? 'bb-media-card--reduced' : 'bb-media-card--full',
      'vault-card',
      'vault-add-card',
      'media-preview-add-card',
      className
    ].filter(Boolean).join(' ');
    const attrs = actionDataset(dataset, this.escapeAttribute);
    return `
      <button type="button" class="${this.escapeAttribute(cardClass)}" ${attrs} title="${this.escapeAttribute(title)}">
        <span class="bb-media-add-card__preview vault-add-card-thumb" aria-hidden="true">${semanticIconMarkup('add')}</span>
        <span class="bb-media-card__body bb-media-add-card__body vault-card-body vault-add-card-body">
          <strong>${this.escapeHtml(label)}</strong>
          <span>${this.escapeHtml(subtitle)}</span>
          ${!reduced && formats ? `<span class="bb-media-add-card__formats vault-add-card-formats">${this.escapeHtml(formats)}</span>` : ''}
        </span>
      </button>
    `;
  }

  renderBadge({ label = '', title = '', className = '', tag = 'span' } = {}) {
    const safeTag = tag === 'em' ? 'em' : 'span';
    const titleAttr = title ? ` data-vault-usage-info="${this.escapeAttribute(title)}"` : '';
    const classes = className || (safeTag === 'em' ? '' : 'vault-usage');
    return `<${safeTag} class="bb-media-card__badge ${this.escapeAttribute(classes)}"${titleAttr}>${this.escapeHtml(label)}</${safeTag}>`;
  }

  renderAction({
    label = '',
    iconRole = '',
    activeIconRole = '',
    dataset = {},
    className = '',
    disabled = false,
    busy = false,
    title = '',
    ariaLabel = ''
  } = {}) {
    const attrs = actionDataset(dataset, this.escapeAttribute);
    const icon = iconRole
      ? `<span class="bb-media-action__icon bb-media-action__icon--default">${semanticIconMarkup(iconRole)}</span>${activeIconRole ? `<span class="bb-media-action__icon bb-media-action__icon--active">${semanticIconMarkup(activeIconRole)}</span>` : ''}`
      : '';
    const progress = busy
      ? `<span class="bb-media-action__progress">${semanticIconMarkup('progress')}</span>`
      : '';
    const body = `${progress}${icon}${label ? `<span>${this.escapeHtml(label)}</span>` : ''}`;
    return `<button type="button" class="bb-media-action ${this.escapeAttribute(className)}" ${attrs}${disabled ? ' disabled' : ''}${busy ? ' aria-busy="true"' : ''}${title ? ` title="${this.escapeAttribute(title)}"` : ''}${ariaLabel ? ` aria-label="${this.escapeAttribute(ariaLabel)}"` : ''}>${body}</button>`;
  }

  usageBadge(item = {}) {
    const usageCount = Number(item.usageCount) || 0;
    return {
      label: usageCount > 0 ? `Used ${usageCount}` : 'Unused',
      title: '',
      className: `vault-usage ${usageCount > 0 ? 'is-used' : 'is-unused'}`
    };
  }
}

export function referenceImagePickerMarkup({
  image = null,
  buttonLabel = image?.src ? 'Change reference image' : 'Choose reference image'
} = {}) {
  const source = String(image?.src || '');
  const label = String(image?.label || image?.alt || 'Reference image');
  const choose = source ? '' : semanticActionButtonMarkup({
    label: buttonLabel,
    ariaLabel: buttonLabel,
    help: 'Choose an optional image to sample palette colors from',
    iconRole: 'add_photo_alternate',
    iconOnly: false,
    className: 'bb-media-reference-picker__choose',
    attributes: { 'data-theme-reference-image-action': 'choose' }
  });
  const controls = source ? `
    <div class="bb-media-reference-picker__controls bb-interface-controls" role="toolbar" aria-label="Reference image controls">
      ${semanticActionButtonMarkup({
        label: 'Swap reference image',
        help: 'Swap reference image',
        iconRole: 'swap_horiz',
        className: 'bb-media-reference-picker__control',
        attributes: { 'data-theme-reference-image-action': 'swap' }
      })}
      ${semanticActionButtonMarkup({
        label: 'Zoom out',
        help: 'Zoom out',
        iconRole: 'zoom_out',
        className: 'bb-media-reference-picker__control',
        attributes: { 'data-theme-reference-image-action': 'zoom-out' }
      })}
      ${semanticActionButtonMarkup({
        label: 'Fit image',
        help: 'Fit image',
        iconRole: 'fit_screen',
        className: 'bb-media-reference-picker__control',
        attributes: {
          'aria-pressed': 'true',
          'data-theme-reference-image-action': 'fit'
        }
      })}
      ${semanticActionButtonMarkup({
        label: 'Zoom in',
        help: 'Zoom in',
        iconRole: 'zoom_in',
        className: 'bb-media-reference-picker__control',
        attributes: { 'data-theme-reference-image-action': 'zoom-in' }
      })}
      ${semanticActionButtonMarkup({
        label: 'Remove reference image',
        help: 'Remove reference image',
        iconRole: 'close',
        danger: true,
        className: 'bb-media-reference-picker__control',
        attributes: { 'data-theme-reference-image-action': 'remove' }
      })}
    </div>
  ` : '';
  const preview = source ? `
    <figure class="bb-media-reference-picker__preview" data-theme-reference-image-preview>
      <div class="bb-media-reference-picker__viewport bb-scrollbar" data-theme-reference-image-viewport data-theme-reference-image-zoom-mode="fit">
        <div class="bb-media-reference-picker__stage">
          <img src="${escapeHtml(source)}" alt="${escapeHtml(label)}" draggable="false" data-theme-reference-image>
        </div>
      </div>
      ${controls}
    </figure>
  ` : '';
  return `<div class="bb-media-reference-picker" data-theme-reference-image-picker>${choose}${preview}</div>`;
}
