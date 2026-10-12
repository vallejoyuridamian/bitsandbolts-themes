import {
  accountFunnelAccessMarkup,
  accountFunnelStatusMarkup
} from './account-funnel.js';
import { bindAccountPasswordVisibility, clearFieldError, showFieldError, clearConsentError, showConsentError, clearValidationErrors, showError, setPending } from './account-access-controller.js';


const GOOGLE_LOGO_SRC = '/theme/icons/google-logo.svg';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizedRequest(detail = {}) {
  const copy = detail.copy ?? {};
  return Object.freeze({
    actionPhrase: String(copy.actionPhrase || 'continue'),
    capability: String(detail.capability || 'account'),
    description: String(copy.description || 'Log in to your account to continue.'),
    preservation: String(copy.preservation || ''),
    title: String(copy.title || 'Log in to continue'),
    unsavedWork: detail.unsavedWork === true
  });
}

function formValue(form, name) {
  const value = String(form?.querySelector?.(`[name="${name}"]`)?.value || '');
  return ['password', 'confirmPassword'].includes(name) ? value : value.trim();
}

function persistenceChoice(form) {
  return form?.querySelector?.('[data-account-funnel-remember]')?.checked === true;
}

export function createAccountFunnelController({
  createInteractionRouter,
  requestEvent = null,
  windowId: WINDOW_ID = 'account-access',
  accountLabel = 'Account',
  cancelLabel = 'Cancel',
  googleLogoSrc = GOOGLE_LOGO_SRC,
  onClose = null,
  eventTarget = globalThis,
  floatingWindowStackController,
  flowFactory,
  navigateExternal = () => {},
  prepareHandoff = async () => {},
  rootDocument = globalThis.document,
  service
} = {}) {
  if (!floatingWindowStackController || !service || typeof flowFactory !== 'function') {
    throw new TypeError('The account funnel requires a window stack, service and flow.');
  }
  let activeRequest = null;
  let emailDraft = '';
  const retiredForms = new WeakSet();
  const liveForm = form => form?.isConnected !== false && !retiredForms.has(form);
  const requestRouter = createInteractionRouter({ label: 'account-funnel-request' });

  function bindForm(body, {
    onBack = null,
    onCancel = () => floatingWindowStackController.close(WINDOW_ID, { reason: 'keep-editing' }),
    onCreate = null,
    onGoogle = null,
    onRecovery = null,
    onSubmit = null
  } = {}) {
    const form = body.querySelector?.('[data-bb-account-funnel]');
    if (!form) return null;
    const router = createInteractionRouter({ label: `account-funnel:${form.dataset.accountFunnelStep || 'step'}` });
    bindAccountPasswordVisibility(router, form);
    const email = form.querySelector?.('input[name="email"]');
    if (email && emailDraft) email.value = emailDraft;
    if (email) {
      router.bind(email, 'input', () => {
        emailDraft = String(email.value || '').trim();
      });
    }
    form.querySelectorAll?.('[data-account-funnel-field] input').forEach((input) => {
      router.bind(input, 'input', () => {
        clearFieldError(input);
        showError(form);
      });
    });
    const consent = form.querySelector?.('[data-account-funnel-consent]');
    if (consent) {
      router.bind(consent, 'change', () => {
        clearConsentError(form);
        showError(form);
      });
    }
    const back = form.querySelector?.('[data-account-funnel-back]');
    if (back && onBack) router.bind(back, 'click', (event) => {
      event.preventDefault?.();
      onBack();
    });
    const cancel = form.querySelector?.('[data-account-funnel-cancel]');
    if (cancel) router.bind(cancel, 'click', (event) => {
      event.preventDefault?.();
      onCancel();
    });
    const create = form.querySelector?.('[data-account-funnel-create]');
    if (create && onCreate) router.bind(create, 'click', (event) => {
      event.preventDefault?.();
      onCreate(form);
    });
    const google = form.querySelector?.('[data-account-funnel-google]');
    if (google && onGoogle) router.bind(google, 'click', (event) => {
      event.preventDefault?.();
      onGoogle(form);
    });
    const recovery = form.querySelector?.('[data-account-funnel-recovery]');
    if (recovery && onRecovery) router.bind(recovery, 'click', (event) => {
      event.preventDefault?.();
      onRecovery();
    });
    if (onSubmit) router.bind(form, 'submit', (event) => {
      event.preventDefault?.();
      onSubmit(form);
    });
    form.querySelectorAll?.('a[data-account-funnel-external]')?.forEach((link) => {
      router.bind(link, 'click', (event) => {
        event.preventDefault?.();
        if (form.getAttribute?.('aria-busy') === 'true') return;
        const destination = new URL(link.href, rootDocument.defaultView.location.href);
        if (destination.protocol !== 'https:' && !(
          destination.protocol === 'http:'
          && destination.origin === rootDocument.defaultView.location.origin
        )) {
          showError(form, 'This page is unavailable from the account window.');
          return;
        }
        void perform(form, 'Continuing', prepareHandoff,
          () => navigateExternal(destination.href));
      });
    });
    return () => { retiredForms.add(form); router.destroy(); };
  }

  async function perform(form, pendingLabel, operation, accept, onError = null) {
    if (form?.getAttribute?.('aria-busy') === 'true') return;
    showError(form);
    setPending(form, true, pendingLabel);
    try {
      const result = await operation();
      if (!liveForm(form)) return;
      await accept(result);
    } catch (error) {
      if (liveForm(form) && error?.name !== 'AbortError' && !onError?.(error)) showError(form, flow.errorMessage(error));
    } finally {
      if (liveForm(form)) setPending(form, false);
    }
  }

  function push(viewId, renderContent) {
    return floatingWindowStackController.push(WINDOW_ID, {
      ariaLabel: accountLabel,
      renderContent,
      source: 'account-funnel',
      viewId
    });
  }

  function showStatus({ description, kind = 'success', title }) {
    return push(`status-${kind}`, (body) => {
      body.innerHTML = accountFunnelStatusMarkup({ description, kind, title });
    });
  }

  const flow = flowFactory({
    bindForm,
    clearValidationErrors,
    floatingWindowStackController,
    formValue,
    perform,
    push,
    service,
    showFieldError,
    showConsentError,
    showError,
    showStatus,
    windowId: WINDOW_ID
  });
  if (!flow) throw new TypeError('The account flow is unavailable.');

  function showSignup() {
    return push('signup', (body) => {
      body.innerHTML = accountFunnelAccessMarkup({
        backLabel: 'Back to log in',
        cancelLabel,
        consentLabel: flow.signupConsentLabel,
        externalLinks: flow.externalLinks || [],
        fields: [
          { autocomplete: 'email', id: 'accountFunnelSignupEmail', label: 'Email', name: 'email', type: 'email' },
          { autocomplete: 'new-password', id: 'accountFunnelSignupPassword', label: 'Password', minLength: flow.signupPasswordMinimum, name: 'password', type: 'password' },
          { autocomplete: 'new-password', id: 'accountFunnelSignupConfirm', label: 'Confirm password', minLength: flow.signupPasswordMinimum, name: 'confirmPassword', type: 'password' }
        ],
        googleLabel: 'Continue with Google',
        googleLogoSrc,
        primaryLabel: 'Create account',
        rememberLabel: flow.rememberLabel,
        showBack: true,
        step: 'signup',
        title: 'Create your account'
      });
      return bindForm(body, {
        onBack: () => floatingWindowStackController.back(WINDOW_ID, { reason: 'signup-back' }),
        onGoogle: (form) => perform(
          form,
          flow.googlePendingLabel,
          async () => {
            await prepareHandoff();
            return service.startGoogle({ intent: 'signup', remember: persistenceChoice(form) });
          },
          flow.onSignupGoogle
        ),
        onSubmit: (form) => {
          clearValidationErrors(form);
          const email = formValue(form, 'email');
          const password = formValue(form, 'password');
          const confirmation = formValue(form, 'confirmPassword');
          if (!EMAIL_PATTERN.test(email)) {
            showFieldError(form, 'email', 'Enter a valid email address.');
            return;
          }
          const passwordError = flow.signupPasswordError(password);
          if (passwordError) {
            showFieldError(form, 'password', passwordError);
            return;
          }
          if (password !== confirmation) {
            showFieldError(form, 'confirmPassword', 'The passwords do not match.');
            return;
          }
          if (flow.signupConsentLabel && !form.querySelector?.('[data-account-funnel-consent]')?.checked) {
            showConsentError(form, flow.consentError);
            return;
          }
          emailDraft = email;
          perform(form, flow.signupPendingLabel,
            async () => {
              await prepareHandoff();
              return flow.createEmailAccount({ email, password, remember: persistenceChoice(form) });
            },
            flow.onEmailCreated,
            (error) => {
              const fieldError = flow.signupError?.(error, password);
              if (!fieldError) return false;
              showFieldError(form, fieldError.field, fieldError.message);
              return true;
            });
        }
      });
    });
  }

  function showRecovery() {
    return push('recovery', (body) => {
      body.innerHTML = accountFunnelAccessMarkup({
        backLabel: 'Back to log in',
        cancelLabel,
        description: flow.recoveryDescription,
        fields: [
          { autocomplete: 'email', id: 'accountFunnelRecoveryEmail', label: 'Email', name: 'email', type: 'email' }
        ],
        primaryLabel: flow.recoveryPrimaryLabel,
        showBack: true,
        step: 'recovery',
        title: 'Reset your password'
      });
      return bindForm(body, {
        onBack: () => floatingWindowStackController.back(WINDOW_ID, { reason: 'recovery-back' }),
        onSubmit: (form) => {
          clearValidationErrors(form);
          const email = formValue(form, 'email');
          if (!EMAIL_PATTERN.test(email)) {
            showFieldError(form, 'email', 'Enter a valid email address.');
            return;
          }
          emailDraft = email;
          perform(form, flow.recoveryPendingLabel,
            () => flow.requestPasswordRecovery(email), flow.onRecoverySent);
        }
      });
    });
  }

  function renderLogin(body) {
    body.innerHTML = accountFunnelAccessMarkup({
      cancelLabel,
      creationActionLabel: 'for free',
      creationPrompt: "If you don't have an account, you can create one",
      description: flow.loginDescription,
      fields: [
        { autocomplete: 'email', id: 'accountFunnelLoginEmail', label: 'Email', name: 'email', type: 'email' },
        { autocomplete: 'current-password', id: 'accountFunnelLoginPassword', label: 'Password', name: 'password', type: 'password' }
      ],
      googleLabel: 'Continue with Google',
      googleLogoSrc,
      primaryLabel: 'Log in',
      recoveryLabel: 'Forgot your password?',
      rememberLabel: flow.rememberLabel,
      step: 'login',
      title: activeRequest?.title
    });
    return bindForm(body, {
      onCreate: showSignup,
      onGoogle: (form) => perform(
        form,
        flow.googlePendingLabel,
        async () => {
          await prepareHandoff();
          return service.startGoogle({ intent: 'login', remember: persistenceChoice(form) });
        },
        flow.onLoginGoogle
      ),
      onRecovery: showRecovery,
      onSubmit: (form) => {
        clearValidationErrors(form);
        const email = formValue(form, 'email');
        const password = formValue(form, 'password');
        if (!EMAIL_PATTERN.test(email)) {
          showFieldError(form, 'email', 'Enter a valid email address.');
          return;
        }
        if (!password) {
          showFieldError(form, 'password', 'Enter your password.');
          return;
        }
        emailDraft = email;
        perform(form, 'Logging in', async () => {
          await prepareHandoff();
          return service.signInWithEmail({ email, password, remember: persistenceChoice(form) });
        }, flow.onLoginEmail);
      }
    });
  }

  function open(detail = {}) {
    activeRequest = normalizedRequest(detail);
    emailDraft = '';
    flow.reset?.();
    return floatingWindowStackController.open({
      ariaLabel: accountLabel,
      context: {
        capability: activeRequest.capability,
        mode: service.mode
      },
      id: WINDOW_ID,
      onClose: detail => {
        activeRequest = null;
        emailDraft = '';
        service.reset?.();
        onClose?.(detail);
      },
      renderContent: renderLogin,
      source: 'account-funnel',
      viewId: 'login'
    });
  }

  if (requestEvent) requestRouter.bind(eventTarget, requestEvent, (event) => {
    open(event.detail ?? {});
  });

  return Object.freeze({
    destroy() {
      requestRouter.destroy();
      floatingWindowStackController.close(WINDOW_ID, { reason: 'account-funnel-destroyed' });
      service.reset?.();
      activeRequest = null;
      emailDraft = '';
    },
    isOpen: () => floatingWindowStackController.isOpen(WINDOW_ID),
    open
  });
}
