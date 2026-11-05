// Generated document composition and standalone links share prerequisite identity.
// This is admission only, never a second stylesheet installer or repair path.
export function requireDocumentStylesheet(document, pathname) {
  const composed = [...document.querySelectorAll('[data-bb-stylesheets]')]
    .some(node => (node.getAttribute('data-bb-stylesheets') || '').split(/\s+/).includes(pathname));
  const linked = [...document.querySelectorAll('link[rel="stylesheet"][href]')]
    .some(node => new URL(node.getAttribute('href'), document.baseURI).pathname === pathname);
  if (!composed && !linked) throw new Error(`Document stylesheet prerequisite missing: ${pathname}`);
}
