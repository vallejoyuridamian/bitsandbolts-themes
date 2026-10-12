import { createPricingComparisonController } from './pricing-comparison.js';

for (const root of document.querySelectorAll('[data-bb-pricing-comparison]')) {
  createPricingComparisonController({ root });
}
