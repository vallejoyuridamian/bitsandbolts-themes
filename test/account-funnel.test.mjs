import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  accountFunnelAccessMarkup,
  accountFunnelPlanMarkup,
  accountFunnelStatusMarkup
} from '../components/account-funnel.js';
import { MANAGED_WEB_COMPONENTS } from '../components/managed-components.js';

test('account access composes exact Themes recipes without a modal dialog', () => {
  const markup = accountFunnelAccessMarkup({
    creationActionLabel: 'for free',
    creationPrompt: "If you don't have an account, you can create one",
    description: 'Log in to your account to continue.',
    fields: [
      { autocomplete: 'email', id: 'email', label: 'Email', type: 'email' },
      { autocomplete: 'current-password', id: 'password', label: 'Password', type: 'password' }
    ],
    googleLabel: 'Continue with Google',
    googleLogoSrc: '/theme/icons/google-logo.svg',
    primaryLabel: 'Log in',
    recoveryLabel: 'Forgot your password?',
    title: 'Log in to continue'
  });

  assert.match(markup, /bb-account-funnel/);
  assert.match(markup, /bb-google-btn/);
  assert.match(markup, /\/theme\/icons\/google-logo\.svg/);
  assert.match(markup, /data-bb-icon-role="visibility"/);
  assert.match(markup, /data-bb-icon-role="visibility_off"/);
  assert.match(markup, /data-account-funnel-field-error/);
  assert.match(markup, /bb-field__input/);
  assert.match(markup, /bb-account-funnel__primary/);
  assert.match(markup, /<strong>for free<\/strong>/);
  assert.doesNotMatch(markup, /<dialog|bb-dialog|>G<|class="ms"/);
  assert.doesNotMatch(markup, /bb-account-funnel__notice/);
});

test('account creation, plan choice, and status remain generic managed recipes', () => {
  const signup = accountFunnelAccessMarkup({
    consentLabel: 'I accept the Terms and Privacy Policy.',
    fields: [{ id: 'email', label: 'Email', type: 'email' }],
    showBack: true,
    step: 'signup',
    title: 'Create your account'
  });
  const plan = accountFunnelPlanMarkup({
    plans: [
      { label: 'Free', price: 'USD 0', summary: '100 credits once', value: 'free' },
      { badge: 'Best value', label: 'Studio Annual', price: 'USD 10/month', summary: 'Billed USD 120 yearly', value: 'studio-annual' }
    ],
    selectedPlan: 'studio-annual'
  });
  const status = accountFunnelStatusMarkup({ kind: 'processing' });

  assert.match(signup, /data-account-funnel-consent/);
  assert.match(signup, /bb-checkbox-field__label/);
  assert.match(signup, /data-account-funnel-consent-error/);
  assert.match(signup, /data-account-funnel-back/);
  assert.match(plan, /role="radiogroup"/);
  assert.match(plan, /value="studio-annual" checked/);
  assert.match(status, /data-account-funnel-status="processing"/);
  assert.match(status, /data-bb-icon-role="progress"/);
  assert.deepEqual(
    MANAGED_WEB_COMPONENTS['account-funnel'].dependencies.stylesheets,
    [
      'components/account-funnel.css',
      'components/floating-window.css',
      'components/form-field.css',
      'components/google-signin.css',
      'components/interface-primitives.css',
      'components/semantic-icons.css'
    ]
  );
});

test('account funnel styles own every custom flow role', async () => {
  const [css, fieldsCss] = await Promise.all([
    readFile(new URL('../components/account-funnel.css', import.meta.url), 'utf8'),
    readFile(new URL('../components/form-field.css', import.meta.url), 'utf8')
  ]);
  for (const selector of [
    '.bb-account-funnel__body',
    '.bb-account-funnel__switch-action',
    '.bb-account-funnel__plan',
    '.bb-account-funnel__primary.bb-workspace-control-button',
    '.bb-account-funnel__status-icon'
  ]) {
    assert.match(css, new RegExp(selector.replaceAll('.', '\\.')));
  }
  for (const selector of [
    '.bb-checkbox-field__label',
    '.bb-checkbox-field__control',
    '.bb-field__eye .bb-semantic-icon'
  ]) {
    assert.match(fieldsCss, new RegExp(selector.replaceAll('.', '\\.')));
  }
  assert.match(fieldsCss, /\.bb-checkbox-field__label\s*\{[^}]*align-items: center/s);
  assert.match(css, /\.bb-account-funnel__head\s*\{[^}]*grid-template-columns: minmax\(0, 1fr\);[^}]*padding-inline: 0;/s);
  assert.match(css, /\.bb-account-funnel__head \.bb-floating-window-content__title\s*\{[^}]*grid-column: 1;[^}]*justify-self: center;[^}]*width: auto;/s);
  assert.match(css, /\.bb-account-funnel__back\s*\{[^}]*position: absolute;[^}]*inset-inline-start: 16px;/s);
  assert.doesNotMatch(css, /\.bb-account-funnel__head::after/);
  assert.match(css, /\.bb-account-funnel__head \+ \.bb-account-funnel__body\s*\{[^}]*padding-block-start: var\(--bb-spacing-3\);/s);
  assert.doesNotMatch(css, /bb-account-funnel__notice/);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i);
});
