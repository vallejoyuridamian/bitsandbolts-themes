const NAVBAR_PLACEMENTS = new Set(['static', 'sticky', 'hide-on-scroll']);
const installedDocuments = new WeakSet();

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function externalAttributes(model = {}) {
  return model.external ? ' target="_blank" rel="noopener noreferrer"' : '';
}

function controlIcon(role) {
  const icons = {
    menu: [448, 512, 'M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z'],
    close: [384, 512, 'M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z']
  };
  const [width, height, path] = icons[role];
  return `<svg class="bb-navbar__icon" viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false"><path fill="currentColor" d="${path}" /></svg>`;
}

function navbarLink(model, className, { specimen = false } = {}) {
  const specimenAttributes = specimen ? ' tabindex="-1" aria-disabled="true"' : '';
  return `<a class="${className}" href="${escapeHtml(model.href)}"${externalAttributes(model)}${specimenAttributes}>${escapeHtml(model.label)}</a>`;
}

export function navbarMarkup(model = {}, { placement = 'static', specimen = false } = {}) {
  if (!NAVBAR_PLACEMENTS.has(placement)) {
    throw new TypeError(`Unsupported navbar placement: ${placement}`);
  }
  const brand = model.brand || {};
  const links = Array.isArray(model.links) ? model.links : [];
  const brandMark = brand.logo
    ? `<img src="${escapeHtml(brand.logo)}" alt="" />`
    : '<span class="bb-navbar__brand-mark" aria-hidden="true"></span>';
  const linkMarkup = links
    .map((link) => navbarLink(link, 'bb-navbar__link', { specimen }))
    .join('\n          ');
  const actionMarkup = model.action
    ? `<div class="bb-navbar__action-wrapper">
          ${navbarLink(model.action, 'bb-navbar__action', { specimen })}
        </div>`
    : '';

  return `<header class="bb-navbar" data-bb-navbar data-placement="${placement}"${specimen ? ' data-bb-navbar-specimen' : ''}>
      <div class="bb-navbar__inner">
        <button class="bb-navbar__toggle" type="button" aria-label="Open navigation" aria-expanded="false" data-bb-navbar-toggle>
          ${controlIcon('menu')}
        </button>
        <a class="bb-navbar__brand" href="${escapeHtml(brand.href)}" aria-label="${escapeHtml(brand.ariaLabel)}"${specimen ? ' tabindex="-1" aria-disabled="true"' : ''}>
          ${brandMark}
          <span><strong>${escapeHtml(brand.name)}</strong><small>${escapeHtml(brand.tagline)}</small></span>
        </a>
        <nav class="bb-navbar__links" aria-label="${escapeHtml(model.label)}" data-bb-navbar-menu>
          <button class="bb-navbar__close" type="button" aria-label="Close navigation" data-bb-navbar-close>
            ${controlIcon('close')}
          </button>
          ${linkMarkup}
        </nav>
        ${actionMarkup}
      </div>
    </header>`;
}

function setMenuOpen(navbar, open) {
  const toggle = navbar?.querySelector?.('[data-bb-navbar-toggle]');
  if (!navbar || !toggle) return;
  navbar.dataset.open = String(open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}

export function installNavbarController({ document: documentRef, window: windowRef } = {}) {
  const doc = documentRef || globalThis.document;
  const win = windowRef || globalThis.window;
  if (!doc || !win || installedDocuments.has(doc)) return;
  installedDocuments.add(doc);

  doc.addEventListener('click', (event) => {
    const target = event.target;
    const toggle = target?.closest?.('[data-bb-navbar-toggle]');
    const close = target?.closest?.('[data-bb-navbar-close]');
    const menuLink = target?.closest?.('[data-bb-navbar-menu] a');
    const specimenLink = target?.closest?.('[data-bb-navbar-specimen] a');

    if (specimenLink) event.preventDefault();
    if (toggle) {
      const navbar = toggle.closest('[data-bb-navbar]');
      setMenuOpen(navbar, navbar?.dataset.open !== 'true');
    } else if (close || menuLink) {
      setMenuOpen((close || menuLink).closest('[data-bb-navbar]'), false);
    }

    doc.querySelectorAll('[data-bb-navbar][data-open="true"]').forEach((navbar) => {
      if (!navbar.contains(target)) setMenuOpen(navbar, false);
    });
  });

  doc.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    doc.querySelectorAll('[data-bb-navbar][data-open="true"]').forEach((navbar) => setMenuOpen(navbar, false));
  });

  let lastScrollY = win.scrollY;
  win.addEventListener('scroll', () => {
    const currentScrollY = win.scrollY;
    const scrollingDown = currentScrollY > lastScrollY && currentScrollY > 64;
    doc.querySelectorAll('[data-bb-navbar][data-placement="hide-on-scroll"]').forEach((navbar) => {
      navbar.dataset.hidden = String(scrollingDown);
    });
    lastScrollY = currentScrollY;
  }, { passive: true });
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  installNavbarController({ document, window });
}
