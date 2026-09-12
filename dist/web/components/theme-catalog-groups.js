export function themeCatalogGroups(themes = []) {
  const user = themes.filter((theme) => theme.source === 'user-authored');
  if (!user.length) return [];
  const global = themes.filter((theme) => theme.source !== 'user-authored');
  return [
    { id: 'global-themes', label: 'Global Themes', themes: global },
    { id: 'user-themes', label: 'User Themes', themes: user }
  ].filter((group) => group.themes.length);
}
