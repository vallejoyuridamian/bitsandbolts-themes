import { buttonMarkup } from './button.js';
import { contentCardsMarkup } from './content-card.js';
import { spotlightMediaMarkup, storeBadgesMarkup } from './content-media.js';
import {
  mediaCopyListMarkup,
  milestoneTimelineMarkup,
  proseMarkup,
  questionListMarkup
} from './content-section.js';
import { footerMarkup } from './footer.js';
import { floatingWindowConfirmationMarkup } from './floating-window.js';
import { formFieldsMarkup } from './form-field.js';
import { MediaPreviewCard, referenceImagePickerMarkup } from './media-picker.js';
import { navbarMarkup } from './navbar.js';
import { selectionControlsMarkup } from './select.js';
import { workspaceSectionMarkup } from './workspace-section.js';

const mediaPreviewCard = new MediaPreviewCard();

/**
 * Theme-owned managed web component registry.
 *
 * Consumers choose a component declaratively and mount the listed generated
 * dependencies below their `/theme/` asset root. Visual markup and behavior
 * stay owned by the component implementation in this repository.
 */
export const MANAGED_WEB_COMPONENTS = Object.freeze({
  button: Object.freeze({
    dependencies: Object.freeze({
      stylesheets: Object.freeze(['components/button.css']),
      modules: Object.freeze([])
    }),
    render: buttonMarkup
  }),
  'floating-window-confirmation': Object.freeze({
    dependencies: Object.freeze({
      stylesheets: Object.freeze([
        'components/floating-window.css',
        'components/interface-primitives.css',
        'components/semantic-icons.css'
      ]),
      modules: Object.freeze([
        'components/floating-window-shell.js',
        'components/floating-window.js'
      ])
    }),
    render: floatingWindowConfirmationMarkup
  }),
  'content-cards': Object.freeze({
    dependencies: Object.freeze({
      stylesheets: Object.freeze(['components/content-surfaces.css', 'components/vector-icons.css']),
      modules: Object.freeze([])
    }),
    render: contentCardsMarkup
  }),
  'spotlight-media': Object.freeze({
    dependencies: Object.freeze({
      stylesheets: Object.freeze(['components/content-media.css']),
      modules: Object.freeze([])
    }),
    render: spotlightMediaMarkup
  }),
  'store-badges': Object.freeze({
    dependencies: Object.freeze({
      stylesheets: Object.freeze(['components/content-media.css', 'components/marketing.css']),
      modules: Object.freeze([])
    }),
    render: storeBadgesMarkup
  }),
  'media-copy-list': Object.freeze({
    dependencies: Object.freeze({
      stylesheets: Object.freeze([
        'components/button.css',
        'components/content-layout.css',
        'components/content-sections.css',
        'components/content-surfaces.css',
        'components/vector-icons.css'
      ]),
      modules: Object.freeze([])
    }),
    render: mediaCopyListMarkup
  }),
  'reference-image-picker': Object.freeze({
    dependencies: Object.freeze({
      stylesheets: Object.freeze([
        'components/button.css',
        'components/interface-primitives.css',
        'components/media-picker.css',
        'components/scrollbar.css',
        'components/semantic-icons.css'
      ]),
      modules: Object.freeze([
        'components/button.js',
        'components/media-picker.js',
        'components/semantic-icons.js'
      ])
    }),
    render: referenceImagePickerMarkup
  }),
  'media-preview-card': Object.freeze({
    dependencies: Object.freeze({
      stylesheets: Object.freeze([
        'components/interface-primitives.css',
        'components/media-picker.css',
        'components/semantic-icons.css'
      ]),
      modules: Object.freeze([
        'components/media-picker.js',
        'components/semantic-icons.js'
      ])
    }),
    render: (model) => mediaPreviewCard.renderCard(model)
  }),
  'font-preview-card': Object.freeze({
    dependencies: Object.freeze({
      stylesheets: Object.freeze([
        'components/interface-primitives.css',
        'components/media-picker.css',
        'components/semantic-icons.css',
        'components/typography.css'
      ]),
      modules: Object.freeze([
        'components/media-picker.js',
        'components/semantic-icons.js'
      ])
    }),
    render: (model = {}) => model.variant === 'add'
      ? mediaPreviewCard.renderAddCard({ ...model, kind: 'font' })
      : mediaPreviewCard.renderFontCard(model)
  }),
  'milestone-timeline': Object.freeze({
    dependencies: Object.freeze({
      stylesheets: Object.freeze(['components/content-sections.css', 'components/content-surfaces.css', 'components/semantic-icons.css']),
      modules: Object.freeze([])
    }),
    render: milestoneTimelineMarkup
  }),
  prose: Object.freeze({
    dependencies: Object.freeze({
      stylesheets: Object.freeze(['components/content-layout.css', 'components/content-sections.css', 'components/vector-icons.css']),
      modules: Object.freeze([])
    }),
    render: proseMarkup
  }),
  'question-list': Object.freeze({
    dependencies: Object.freeze({
      stylesheets: Object.freeze(['components/content-layout.css', 'components/content-sections.css', 'components/semantic-icons.css', 'components/vector-icons.css']),
      modules: Object.freeze([])
    }),
    render: questionListMarkup
  }),
  footer: Object.freeze({
    dependencies: Object.freeze({
      stylesheets: Object.freeze(['components/footer.css']),
      modules: Object.freeze(['components/brand-mark.js', 'components/footer.js'])
    }),
    render: footerMarkup
  }),
  'form-fields': Object.freeze({
    dependencies: Object.freeze({
      stylesheets: Object.freeze(['components/form-field.css']),
      modules: Object.freeze([])
    }),
    render: formFieldsMarkup
  }),
  navbar: Object.freeze({
    dependencies: Object.freeze({
      stylesheets: Object.freeze(['components/navbar.css']),
      modules: Object.freeze(['components/brand-mark.js', 'components/navbar.js'])
    }),
    render: navbarMarkup
  }),
  'selection-controls': Object.freeze({
    dependencies: Object.freeze({
      stylesheets: Object.freeze([
        'components/interface-primitives.css',
        'components/selection-controls.css',
        'components/semantic-icons.css'
      ]),
      modules: Object.freeze([
        'components/semantic-icons.js',
        'components/select.js'
      ])
    }),
    render: selectionControlsMarkup
  }),
  'workspace-section': Object.freeze({
    dependencies: Object.freeze({
      stylesheets: Object.freeze([
        'components/interface-primitives.css',
        'components/semantic-icons.css'
      ]),
      modules: Object.freeze([
        'components/semantic-icons.js',
        'components/workspace-section.js'
      ])
    }),
    render: workspaceSectionMarkup
  })
});
