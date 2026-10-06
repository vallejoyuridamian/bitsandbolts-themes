import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  accountAccessMessages,
  accountFunnelAccessMarkup,
  accountFunnelPageMarkup,
  accountFunnelPlanMarkup,
  accountFunnelStatusMarkup
} from '../components/account-funnel.js';
import { MANAGED_WEB_COMPONENTS } from '../components/managed-components.js';
import { accountDeletionWindowMarkup } from '../components/account-session.js';

test('account deletion uses the Themes window recipe with the linked reauthentication methods', () => {
  const markup = accountDeletionWindowMarkup({ methods: ['email_password', 'google'], productName: 'Cluna Studio' });
  assert.match(markup, /data-account-funnel-step="deletion"/);
  assert.match(markup, /bb-google-btn/);
  assert.match(markup, /Delete account with Google/);
  assert.match(markup, />Password<\/label>/);
  assert.match(markup, /bb-workspace-control-button--danger/);
  assert.match(markup, />Delete account<\/button>/);
  assert.doesNotMatch(markup, /<dialog|bb-dialog|DELETE MY ACCOUNT|Current password|type="email"/);
  const googleOnly = accountDeletionWindowMarkup({ methods: ['google'], productName: 'Cluna Studio' });
  assert.match(googleOnly, /Delete account with Google/);
  assert.doesNotMatch(googleOnly, /bb-divider|name="password"|data-account-funnel-submit/);
  const passwordOnly = accountDeletionWindowMarkup({ methods: ['email_password'], productName: 'Cluna Studio' });
  assert.match(passwordOnly, /name="password"/);
  assert.doesNotMatch(passwordOnly, /bb-google-btn|bb-divider/);
});

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
  assert.match(markup, /class="bb-workspace-control-button" type="submit" data-account-funnel-submit/);
  assert.doesNotMatch(markup, /bb-account-funnel__primary/);
  assert.match(markup, /<strong>for free<\/strong>/);
  assert.doesNotMatch(markup, /<dialog|bb-dialog|>G<|class="ms"/);
  assert.doesNotMatch(markup, /bb-account-funnel__notice/);
});

test('standalone account page owns its fonts, mark and borderless form through Themes', async () => {
  const [pageCss, formCss] = await Promise.all([
    readFile(new URL('../components/account-access-page.css', import.meta.url), 'utf8'),
    readFile(new URL('../components/account-funnel.css', import.meta.url), 'utf8')
  ]);
  assert.deepEqual(MANAGED_WEB_COMPONENTS['account-access-page'].dependencies.stylesheets,
    ['components/account-access-page.css']);
  for (const dependency of ['typography.css', 'brand-mark.css', 'form-field.css',
    'interface-primitives.css', 'floating-window.css', 'account-funnel.css']) {
    assert.match(pageCss, new RegExp(dependency.replaceAll('.', '\\.')));
  }
  assert.match(formCss, /\.bb-account-access-page \.bb-account-funnel\s*\{[^}]*border: 0;[^}]*background: transparent;/s);
  assert.match(accountFunnelPageMarkup({ step: 'status' }, {
    brand: { name: 'Cluna Studio', mark: '/theme/brand/cluna/mark.svg' }
  }), /bb-account-access-page__mark--monochrome/);
});

test('account creation, plan choice, and status remain generic managed recipes', () => {
  const signup = accountFunnelAccessMarkup({
    consentLabel: 'I accept the Terms and Privacy Policy.',
    externalLinks: [{ href: '/terms/', label: 'Terms' }, { href: '/privacy/', label: 'Privacy' }],
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
  assert.match(signup, /href="\/terms\/" data-account-funnel-external>Terms<\/a>/);
  assert.match(signup, /href="\/privacy\/" data-account-funnel-external>Privacy<\/a>/);
  assert.match(plan, /role="radiogroup"/);
  assert.match(plan, /value="studio-annual" checked/);
  assert.match(status, /data-account-funnel-status="processing"/);
  assert.match(status, /role="status"/);
  assert.doesNotMatch(status, /data-account-funnel-finish|status-icon|data-bb-icon-role/);
  assert.equal(accountAccessMessages.passwordResetSent, 'Check your inbox for a password reset link.');
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

test('remembered login shares the checkbox row and defaults unchecked without consent validation', () => {
  const markup = accountFunnelAccessMarkup({ rememberLabel: 'Keep me signed in', step: 'login' });
  assert.match(markup, /class="bb-checkbox-field__label"/);
  assert.match(markup, /class="bb-checkbox-field__control" type="checkbox" name="remember"/);
  assert.match(markup, /data-account-funnel-remember/);
  assert.match(markup, /bb-checkbox-field__text">Keep me signed in/);
  assert.doesNotMatch(markup, /\schecked|data-account-funnel-consent-error|aria-describedby/);
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
    '.bb-account-funnel__actions .bb-workspace-control-button',
    '.bb-account-access-page__brand'
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
  assert.doesNotMatch(css, /bb-account-funnel__notice/);
  assert.doesNotMatch(css, /\.bb-account-funnel__primary/);
  assert.doesNotMatch(css, /\.bb-account-funnel__status-icon/);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i);
});
