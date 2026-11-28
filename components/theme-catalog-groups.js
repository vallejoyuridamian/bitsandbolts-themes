export function themeCatalogGroups(themes = [], { grouped = false, personalPending = false } = {}) {
  const user = themes.filter((theme) => theme.source === 'user-authored');
  if (!grouped && !user.length && !personalPending) return [];
  const global = themes.filter((theme) => theme.source !== 'user-authored');
  return [
    { id: 'global-themes', label: 'Global Themes', themes: global },
    { id: 'user-themes', label: 'My Themes', themes: user, ...(personalPending ? { count: null } : {}) }
  ].filter((group) => group.themes.length || (personalPending && group.id === 'user-themes'));
}
