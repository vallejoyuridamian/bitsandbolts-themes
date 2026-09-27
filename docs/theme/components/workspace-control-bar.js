/* A workspace toolbar has one overflow viewport, regardless of its sections.
 * Consumers own section contents, commands and the routed scroll lifecycle.
 * Centered-title toolbars specialize the row layout in the shared CSS recipe.
 */
export function workspaceControlBarContentMarkup(content) {
  return `<div class="bb-workspace-control-bar__viewport bb-scrollbar--compact"><div class="bb-workspace-control-bar__row">${content}</div></div>`;
}
