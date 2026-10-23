import { semanticActionButtonMarkup } from './button.js';
import { semanticIconMarkup } from './semantic-icons.js';

/* A workspace toolbar has one overflow viewport, regardless of its sections.
 * Consumers own section contents, commands and the routed scroll lifecycle.
 * Centered-title toolbars specialize the row layout in the shared CSS recipe.
 */
export function workspaceControlBarContentMarkup(content) {
  return `<div class="bb-workspace-control-bar__viewport bb-scrollbar--compact"><div class="bb-workspace-control-bar__row">${content}</div></div>`;
}

export function workspaceControlBarReadoutMarkup({
  id, key, value = '', sizingValue = value, numeric = false,
  className = '', actionMarkup = '', hidden = false
} = {}) {
  const tag = actionMarkup ? 'div' : 'span';
  const valueAttribute = `data-control-bar-value="${escapeAttribute(key)}"`;
  const text = escapeAttribute(value);
  const nested = numeric || actionMarkup;
  const sizing = numeric
    ? `<span class="bb-workspace-control-bar__readout-sizing" data-control-bar-sizing="${escapeAttribute(key)}" aria-hidden="true">${escapeAttribute(numericSizingValue(sizingValue))}</span>` : '';
  const content = nested
    ? `${sizing}<span${numeric ? ' class="bb-workspace-control-bar__readout-value"' : ''} ${valueAttribute}>${text}</span>${actionMarkup}` : text;
  // These canonical CSS names also serve functional values and labelled actions.
  return `<${tag} id="${escapeAttribute(id)}" class="control-bar-status bb-workspace-control-bar__status${numeric ? ' bb-workspace-control-bar__numeric-readout' : ''}${className ? ` ${escapeAttribute(className)}` : ''}" data-control-bar-readout="${escapeAttribute(key)}"${nested ? '' : ` ${valueAttribute}`}${hidden ? ' hidden' : ''}>${content}</${tag}>`;
}

export function syncWorkspaceControlBarReadout(root, key, state = {}) {
  const selectorKey = String(key).replaceAll('\\', '\\\\').replaceAll('"', '\\"');
  const readout = root?.querySelector(`[data-control-bar-readout="${selectorKey}"]`);
  if (!readout) return;
  if ('value' in state) {
    const value = readout.hasAttribute('data-control-bar-value')
      ? readout : readout.querySelector(`[data-control-bar-value="${selectorKey}"]`);
    const text = String(state.value ?? '');
    if (value && value.textContent !== text) value.textContent = text;
  }
  if ('sizingValue' in state) {
    const sizing = readout.querySelector(`[data-control-bar-sizing="${selectorKey}"]`);
    const text = numericSizingValue(state.sizingValue);
    if (sizing && sizing.textContent !== text) sizing.textContent = text;
  }
  if ('hidden' in state) {
    readout.hidden = Boolean(state.hidden);
    const group = root.querySelector(`[data-control-bar-readout-group="${selectorKey}"]`);
    if (group) group.hidden = Boolean(state.hidden);
  }
}

function numericSizingValue(value) {
  return String(value ?? '').replace(/[0-9]/g, '0');
}

function escapeAttribute(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

export function workspaceControlBarMarkup({ label = '', detail = '' } = {}, sections = {}, resolveDefinition = () => ({})) {
  const { leadingActions = [], valueControls = [], contentActions = [], actions = [] } = sections;
  const actionMarkup = (action, index) => workspaceControlBarActionMarkup(action, index, resolveDefinition);
  const valueMarkup = (action, index) => {
    const markup = actionMarkup(action, index);
    if (!action.readout?.separatorAfter) return markup;
    return `<div class="bb-workspace-control-bar__leading" data-control-bar-readout-group="${escapeAttribute(action.kind)}"${action.hidden ? ' hidden' : ''}>${markup}${actionMarkup({ kind: 'separator', id: `${action.readout.id}-separator` })}</div>`;
  };
  return workspaceControlBarContentMarkup([
    leadingActions.length ? `<div class="control-bar-leading bb-workspace-control-bar__leading" data-control-bar-group="leadingActions">${leadingActions.map(actionMarkup).join('')}</div>` : '',
    valueControls.map(valueMarkup).join(''),
    contentActions.length ? `<div class="control-bar-leading bb-workspace-control-bar__leading" data-control-bar-group="contentActions">${contentActions.map(actionMarkup).join('')}</div>` : '',

    detail ? `<span class="control-bar-detail" title="${escapeAttribute(detail)}">${escapeHtml(detail)}</span>` : '',
    `<div class="control-bar-controls bb-workspace-control-bar__actions" data-control-bar-group="actions" aria-label="${escapeAttribute(label)}">`,
    (leadingActions.length || contentActions.length || valueControls.length || detail) && actions.length
      ? '<span class="bb-workspace-control-bar__separator bb-workspace-control-bar__overflow-separator" aria-hidden="true"></span>' : '',
    actions.map(actionMarkup).join(''),
    '</div>'
  ].join(''));
}

export function workspaceControlBarActionMarkup(action = {}, index = 0, resolveDefinition = () => ({})) {
  if (action.readout) {
    const { id, className = '', only = false, numeric = false } = action.readout;
    return workspaceControlBarReadoutMarkup({ id, className, key: action.kind,
      value: action.value, sizingValue: action.sizingValue, numeric, hidden: action.hidden,
      actionMarkup: only ? '' : workspaceControlBarActionMarkup({ ...action, readout: null }, 0, resolveDefinition) });
  }
  if (action.kind === 'separator') return `<span${action.id ? ` id="${escapeAttribute(action.id)}"` : ''} class="bb-workspace-control-bar__separator"${action.hidden ? ' hidden' : ''} role="separator" aria-orientation="vertical"></span>`;
  if (action.kind === 'custom') return `<span data-control-bar-custom="${escapeAttribute(action.id || `custom-${index}`)}" style="display:${action.hidden ? 'none' : 'contents'}"${action.hidden ? ' hidden' : ''}>${action.html ?? ''}</span>`;
  const definition = resolveDefinition(action.kind) ?? {};
  const icon = action.icon ?? definition.icon;
  const label = action.label ?? definition.label ?? action.kind;
  const iconOnly = action.iconOnly ?? definition.iconOnly ?? false;
  const classNames = ['workspace-action-button', 'control-bar-action', 'bb-workspace-control-button'];
  if (iconOnly) classNames.push('control-bar-icon-button', 'bb-workspace-control-button--icon');
  if (action.compact) classNames.push('control-bar-compact-button');
  if (action.danger ?? definition.danger) classNames.push('danger-button', 'bb-workspace-control-button--danger');
  const body = escapeHtml(label);
  const title = action.title || iconOnly ? ` title="${escapeAttribute(action.title ?? action.ariaLabel ?? label)}"` : '';
  const secondaryAction = action.secondaryAction
    ? ` data-control-bar-secondary-action="${escapeAttribute(action.secondaryAction)}"`
    : '';
  if (icon) {
    return semanticActionButtonMarkup({
      ariaLabel: action.ariaLabel ?? label,
      className: classNames.filter((className) => !className.startsWith('bb-workspace-control-button')).join(' '),
      danger: action.danger ?? definition.danger,
      disabled: action.disabled || action.kind === 'save',
      help: action.title ?? action.ariaLabel ?? label,
      hidden: action.hidden,
      iconFamily: action.iconFamily ?? definition.iconFamily,
      iconOnly,
      iconRole: String(icon),
      id: action.id,
      label,
      recipe: 'workspace',
      attributes: {
        ...(action.attributes ?? {}),
        'data-control-bar-action': action.kind,
        ...(action.selectTrigger
          ? { 'data-bb-select-trigger': action.selectTrigger }
          : {}),
        ...(action.secondaryAction
          ? { 'data-control-bar-secondary-action': action.secondaryAction }
          : {})
      }
    });
  }
  return `<button id="${escapeAttribute(action.id)}" class="${classNames.join(' ')}" type="button" aria-label="${escapeAttribute(action.ariaLabel ?? label)}"${title} data-control-bar-action="${escapeAttribute(action.kind)}"${secondaryAction}${action.disabled || action.kind === 'save' ? ' disabled' : ''}${action.hidden ? ' hidden' : ''}>${body}</button>`;
}

export function workspaceControlBarSectionActions(actions) {
  const sections = [{ actions: [] }];
  actions.forEach((action) => {
    if (action.kind === 'separator') sections.push({ separator: action, actions: [] });
    else sections.at(-1).actions.push(action);
  });
  let precededByVisibleSection = false;
  return sections.flatMap(({ separator, actions: sectionActions }) => {
    const visible = hasVisibleAction(sectionActions);
    const includeSeparator = separator && visible && precededByVisibleSection;
    precededByVisibleSection ||= visible;
    return [...(separator ? [{ ...separator, hidden: !includeSeparator }] : []), ...sectionActions];
  });
}

function hasVisibleAction(actions) {
  return actions.some((action) => action.kind !== 'separator' && !action.hidden
    && (action.kind !== 'custom' || Boolean(action.html?.trim())));
}

export function syncWorkspaceControlBarCustomVisibility(slot, hidden) {
  slot.hidden = hidden;
  slot.style.display = hidden ? 'none' : 'contents';
}

export function syncWorkspaceControlBarAction(root, kind, state = {}) {
  syncWorkspaceControlBarReadout(root, kind, state);
  const action = root?.querySelector(`[data-control-bar-action="${cssEscape(kind)}"]`);
  syncWorkspaceControlBarButton(action, state);
}

export function syncWorkspaceControlBarButton(action, state = {}) {
  if (!action) return;
  if ('disabled' in state || 'pending' in state) {
    action.disabled = state.pending === true || Boolean(state.disabled);
  }
  if ('pending' in state) {
    action.setAttribute('aria-busy', state.pending ? 'true' : 'false');
  }
  if ('hidden' in state) action.hidden = Boolean(state.hidden);
  if (state.label) {
    action.setAttribute('aria-label', state.label);
    if (action.hasAttribute('title')) action.setAttribute('title', state.label);
  }
  if (state.icon || state.iconFamily) {
    const icon = action.querySelector('.bb-semantic-icon');
    if (icon && ((state.icon && state.icon !== icon.dataset.bbIconRole)
      || (state.iconFamily && state.iconFamily !== icon.dataset.bbIconFamily))) {
      icon.outerHTML = semanticIconMarkup(
        state.icon || icon.dataset.bbIconRole,
        '',
        { family: state.iconFamily || icon.dataset.bbIconFamily }
      );
    }
  }
}

export function syncWorkspaceControlBarPresentation(container, presentation, { detail } = {}) {
  for (const [group, actions] of Object.entries(presentation)) {
    const host = container.querySelector(`[data-control-bar-group="${group}"]`);
    if (host) {
      host.hidden = !hasVisibleAction(actions);
      actions.forEach((action, index) => {
        if (action.kind !== 'custom') return;
        const slot = host.querySelector(`[data-control-bar-custom="${cssEscape(action.id || `custom-${index}`)}"]`);
        if (slot) syncWorkspaceControlBarCustomVisibility(slot, action.hidden === true);
      });
      const separators = [...host.querySelectorAll('[role="separator"]')];
      actions.filter(action => action.kind === 'separator').forEach((action, index) => {
        if (separators[index]) separators[index].hidden = action.hidden === true;
      });
    }
    actions.filter(action => action.kind !== 'separator' && action.kind !== 'custom')
      .forEach(action => syncWorkspaceControlBarAction(container, action.kind, action));
  }
  const overflowSeparator = container.querySelector('.bb-workspace-control-bar__overflow-separator');
  if (overflowSeparator) overflowSeparator.hidden = !hasVisibleAction(presentation.actions)
    || !(hasVisibleAction(presentation.leadingActions) || hasVisibleAction(presentation.contentActions)
      || hasVisibleAction(presentation.valueControls) || detail);
}

function escapeHtml(value) { return escapeAttribute(value); }

function cssEscape(value = '') {
  return globalThis.CSS?.escape ? globalThis.CSS.escape(String(value)) : String(value).replace(/"/g, '\\"');
}
