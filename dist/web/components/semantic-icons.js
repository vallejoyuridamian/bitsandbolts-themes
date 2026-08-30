/**
 * Semantic icon roles owned by Themes.
 *
 * Provider export names stay behind this mapping so consumers and component
 * recipes never depend on a provider's naming scheme.
 */
export const SEMANTIC_ICON_FAMILIES = Object.freeze({
  'font-awesome-solid': Object.freeze({
    save: 'faFloppyDisk',
    undo: 'faRotateLeft',
    redo: 'faRotateRight',
    rotate: 'faRotateLeft',
    settings: 'faGear',
    arrow_back: 'faArrowLeft',
    share: 'faShareNodes',
    logout: 'faRightFromBracket',
    home: 'faHouse',
    search: 'faMagnifyingGlass',
    notifications: 'faBell',
    close: 'faXmark',
    expand_more: 'faChevronDown',
    submenu: 'faChevronRight',
    add: 'faPlus',
    folder_open: 'faFolderOpen',
    check: 'faCheck',
    person: 'faUser',
    star: 'faStar',
    favorite: 'faHeart',
    delete: 'faTrashCan',
    edit: 'faPen',
    save_as: 'faFilePen',
    content_copy: 'faCopy',
    content_paste: 'faPaste',
    cloud_upload: 'faCloudArrowUp',
    cloud_download: 'faCloudArrowDown',
    menu: 'faBars',
    more_vert: 'faEllipsisVertical',
    info: 'faCircleInfo',
    warning: 'faTriangleExclamation',
    lock: 'faLock',
    visibility: 'faEye',
    visibility_off: 'faEyeSlash',
    magnet: 'faMagnet',
    magnet_off: Object.freeze(['faMagnet', 'faSlash']),
    download: 'faDownload',
    add_photo_alternate: 'faImage',
    media_audio: 'faVolumeHigh',
    media_video: 'faVideo',
    media_image: 'faImage',
    media_device: 'faMobileScreenButton',
    media_font: 'faFont',
    format_bold: 'faBold',
    format_italic: 'faItalic',
    format_underline: 'faUnderline',
    format_align_left: 'faAlignLeft',
    format_align_center: 'faAlignCenter',
    format_align_right: 'faAlignRight',
    align_viewport_horizontal: 'faArrowsLeftRightToLine',
    align_viewport_vertical: Object.freeze({
      exportName: 'faArrowsLeftRightToLine',
      rotate: 90
    }),
    arrange: 'faAlignCenter',
    align_selection_left: 'faAlignLeft',
    align_selection_center_x: 'faAlignCenter',
    align_selection_right: 'faAlignRight',
    align_selection_top: Object.freeze({
      exportName: 'faAlignLeft',
      rotate: 90
    }),
    align_selection_center_y: Object.freeze({
      exportName: 'faAlignCenter',
      rotate: 90
    }),
    align_selection_bottom: Object.freeze({
      exportName: 'faAlignRight',
      rotate: 90
    }),
    distribute_horizontal: 'faArrowsLeftRight',
    distribute_vertical: 'faArrowsUpDown',
    group: 'faObjectGroup',
    ungroup: 'faObjectUngroup',
    arrow_selector_tool: 'faArrowPointer',
    content_cut: 'faScissors',
    flag: 'faFlag',
    movie_edit: 'faClapperboard',
    dark_mode: 'faMoon',
    light_mode: 'faSun',
    pause: 'faPause',
    play_arrow: 'faPlay',
    progress: 'faSpinner',
    stop: 'faStop',
    swap_horiz: 'faRightLeft',
    zoom_out: 'faMagnifyingGlassMinus',
    fit_screen: 'faExpand',
    zoom_in: 'faMagnifyingGlassPlus',
    idea: 'faLightbulb',
    call: 'faPhone',
    agreement: 'faHandshake',
    analysis: 'faBrain',
    design: 'faWandMagicSparkles',
    build: 'faHammer',
    firmware: 'faMicrochip',
    mobile: 'faMobileScreen',
    launch: 'faRocket',
    global: 'faEarthAmericas',
    delivery: 'faTruckFast',
    support: 'faWrench',
    data: 'faDatabase',
    growth: 'faChartLine'
  }),
  'bitsandbolts-theme': Object.freeze({
    dark_mode: 'theme-dark.svg',
    light_mode: 'theme-light.svg'
  })
});

export const DEFAULT_SEMANTIC_ICON_FAMILY = 'font-awesome-solid';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function semanticIconMarkup(
  role,
  className = '',
  { family = DEFAULT_SEMANTIC_ICON_FAMILY, label = '' } = {}
) {
  const roles = SEMANTIC_ICON_FAMILIES[family];
  if (!roles) throw new TypeError(`Unsupported semantic icon family: ${family}`);
  if (!roles[role]) throw new TypeError(`Unsupported semantic icon role for ${family}: ${role}`);

  const accessibility = label
    ? ` role="img" aria-label="${escapeHtml(label)}"`
    : ' aria-hidden="true"';
  return `<span class="bb-semantic-icon${className ? ` ${escapeHtml(className)}` : ''}" data-bb-icon-family="${escapeHtml(family)}" data-bb-icon-role="${escapeHtml(role)}"${accessibility}></span>`;
}
