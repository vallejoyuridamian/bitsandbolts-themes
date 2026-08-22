function escapeHtml(value = '') {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function controlId(id = 'workspaceItemInfo', role = '') {
  return `${String(id || 'workspaceItemInfo').replace(/[^A-Za-z0-9_-]/g, '')}-${role}`;
}

export function workspaceItemInfoMarkup({
  id = 'workspaceItemInfo',
  itemNameLabel = 'Item name',
  projectNameLabel = 'Project name',
  resolutionLabel = 'Resolution'
} = {}) {
  const projectNameId = controlId(id, 'project-name');
  const resolutionId = controlId(id, 'resolution');
  const itemNameId = controlId(id, 'item-name');
  return `<div class="bb-workspace-item-info bb-interface-controls" data-bb-workspace-item-info>
    <div class="bb-field">
      <label class="bb-field__label" for="${projectNameId}">${escapeHtml(projectNameLabel)}</label>
      <input id="${projectNameId}" class="bb-field__input" type="text" maxlength="160" autocomplete="off" data-bb-workspace-item-info-role="project-name">
    </div>
    <div class="bb-field">
      <span id="${resolutionId}-label" class="bb-field__label">${escapeHtml(resolutionLabel)}</span>
      <output id="${resolutionId}" class="bb-workspace-item-info__value" aria-labelledby="${resolutionId}-label" data-bb-workspace-item-info-role="resolution"></output>
    </div>
    <div class="bb-field">
      <label class="bb-field__label" for="${itemNameId}">${escapeHtml(itemNameLabel)}</label>
      <input id="${itemNameId}" class="bb-field__input" type="text" maxlength="160" autocomplete="off" data-bb-workspace-item-info-role="item-name">
    </div>
  </div>`;
}
