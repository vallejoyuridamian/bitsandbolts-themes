import { footerMarkup } from './footer.js';
import { navbarMarkup } from './navbar.js';

/**
 * Theme-owned managed web component registry.
 *
 * Consumers choose a component declaratively and mount the listed generated
 * dependencies below their `/theme/` asset root. Visual markup and behavior
 * stay owned by the component implementation in this repository.
 */
export const MANAGED_WEB_COMPONENTS = Object.freeze({
  footer: Object.freeze({
    dependencies: Object.freeze({
      stylesheets: Object.freeze(['components/footer.css']),
      modules: Object.freeze(['components/footer.js'])
    }),
    render: footerMarkup
  }),
  navbar: Object.freeze({
    dependencies: Object.freeze({
      stylesheets: Object.freeze(['components/navbar.css']),
      modules: Object.freeze(['components/navbar.js'])
    }),
    render: navbarMarkup
  })
});
