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
    recipes: 'faBookOpen',
    timer: 'faStopwatch',
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
    geometry: 'faRulerCombined',
    gap: 'faGripLines',
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
    brewer_v60: Object.freeze({
      fileName: 'brewer-v60.svg',
      viewBox: '0 0 24 24',
      paths: Object.freeze([Object.freeze({
        d: 'M4 4h16M6 7l4 9h4l4-9M8 19h8',
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2
      })])
    }),
    brewer_aeropress: Object.freeze({
      fileName: 'brewer-aeropress.svg',
      viewBox: '0 0 24 24',
      paths: Object.freeze([Object.freeze({
        d: 'M10 4V2h4v2M7 4h10M8 4v10a4 4 0 0 0 8 0V4M6 18h12M9 21h6',
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2
      })])
    }),
    mirror_horizontal: 'mirror-horizontal.svg',
    mirror_vertical: 'mirror-vertical.svg',
    dark_mode: 'theme-dark.svg',
    light_mode: 'theme-light.svg'
  }),
  'material-symbols-outlined': Object.freeze({
    home: Object.freeze({ fileName: 'material-symbols-outlined-home.svg', viewBox: '0 -960 960 960', path: 'M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z' }),
    recipes: Object.freeze({ fileName: 'material-symbols-outlined-recipes.svg', viewBox: '0 -960 960 960', path: 'M560-564v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-600q-38 0-73 9.5T560-564Zm0 220v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-380q-38 0-73 9t-67 27Zm0-110v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-490q-38 0-73 9.5T560-454ZM260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z' }),
    timer: Object.freeze({ fileName: 'material-symbols-outlined-timer.svg', viewBox: '0 -960 960 960', path: 'M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z' }),
    person: Object.freeze({ fileName: 'material-symbols-outlined-person.svg', viewBox: '0 -960 960 960', path: 'M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z' }),
    submenu: Object.freeze({ fileName: 'material-symbols-outlined-submenu.svg', viewBox: '0 -960 960 960', path: 'M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z' })
  }),
  'material-symbols-filled': Object.freeze({
    home: Object.freeze({ fileName: 'material-symbols-filled-home.svg', viewBox: '0 -960 960 960', path: 'M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z' }),
    recipes: Object.freeze({ fileName: 'material-symbols-filled-recipes.svg', viewBox: '0 -960 960 960', path: 'M560-564v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-600q-38 0-73 9.5T560-564Zm0 220v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-380q-38 0-73 9t-67 27Zm0-110v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-490q-38 0-73 9.5T560-454Zm-40 176q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q47-23 96.5-35.5T260-800q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 101.5 12.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Z' }),
    timer: Object.freeze({ fileName: 'material-symbols-filled-timer.svg', viewBox: '0 -960 960 960', path: 'M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Z' }),
    person: Object.freeze({ fileName: 'material-symbols-filled-person.svg', viewBox: '0 -960 960 960', path: 'M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z' }),
    submenu: Object.freeze({ fileName: 'material-symbols-filled-submenu.svg', viewBox: '0 -960 960 960', path: 'M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z' })
  })
});

export const DEFAULT_SEMANTIC_ICON_FAMILY = 'font-awesome-solid';

export function normalizeSemanticIconFamily(family = DEFAULT_SEMANTIC_ICON_FAMILY, style = '') {
  if (family !== 'material-symbols') return String(family || DEFAULT_SEMANTIC_ICON_FAMILY);
  return String(style || '').toLowerCase() === 'filled'
    ? 'material-symbols-filled'
    : 'material-symbols-outlined';
}

function kebabCase(value = '') {
  return String(value)
    .replace(/^fa/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replaceAll('_', '-')
    .toLowerCase();
}

export function semanticIconAssetPath(
  role,
  { family = DEFAULT_SEMANTIC_ICON_FAMILY, style = '' } = {}
) {
  const normalizedFamily = normalizeSemanticIconFamily(family, style);
  const definition = SEMANTIC_ICON_FAMILIES[normalizedFamily]?.[role];
  if (!definition) throw new TypeError(`Unsupported semantic icon role for ${normalizedFamily}: ${role}`);
  if (typeof definition === 'string' && definition.endsWith('.svg')) return `icons/${definition}`;
  if (definition?.fileName) return `icons/${definition.fileName}`;
  const descriptor = definition && typeof definition === 'object' && !Array.isArray(definition)
    ? definition
    : null;
  const exportNames = Array.isArray(definition)
    ? definition
    : [descriptor?.exportName ?? definition];
  const fileName = exportNames.length === 1 && !descriptor?.rotate
    ? `${kebabCase(exportNames[0])}.svg`
    : `${kebabCase(role)}.svg`;
  return `icons/${normalizedFamily}/${fileName}`;
}

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
  { family = DEFAULT_SEMANTIC_ICON_FAMILY, label = '', style = '' } = {}
) {
  const normalizedFamily = normalizeSemanticIconFamily(family, style);
  const roles = SEMANTIC_ICON_FAMILIES[normalizedFamily];
  if (!roles) throw new TypeError(`Unsupported semantic icon family: ${normalizedFamily}`);
  if (!roles[role]) throw new TypeError(`Unsupported semantic icon role for ${normalizedFamily}: ${role}`);

  const accessibility = label
    ? ` role="img" aria-label="${escapeHtml(label)}"`
    : ' aria-hidden="true"';
  return `<span class="bb-semantic-icon${className ? ` ${escapeHtml(className)}` : ''}" data-bb-icon-family="${escapeHtml(normalizedFamily)}" data-bb-icon-role="${escapeHtml(role)}"${accessibility}></span>`;
}
