// Build-time enforcement of UI_STRATEGY.md's portable component boundary.
export function assertRouterAgnosticComponent(source, label = 'Themes component') {
  if (/\b(?:createInteractionRouter|createInteractionFocusStack|interactionFocusStack|eventRouter|contentRouterFactory)\b|page-event-scope|interaction-focus-stack/.test(source)
    || /(?:from\s*|import\s*\()['"][^'"]*appscreen-studio/.test(source)) {
    throw new Error(`${label} depends on app routing. Themes accepts generic binding callbacks; the consumer owns its router and focus policy.`);
  }
}
