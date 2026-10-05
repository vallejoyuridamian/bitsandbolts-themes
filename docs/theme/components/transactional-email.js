function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function color(value) {
  if (!/^#[0-9a-f]{6}$/i.test(value || '')) throw new TypeError('Email colors must be resolved theme colors.');
  return value;
}

// Email clients need inline, resolved colors. The caller supplies values from
// its selected Themes palette; this recipe owns the shared table composition.
export function transactionalEmailMarkup({
  actionLabel, actionUrl, brandMarkUrl, brandName, brandUrl,
  heading, intro, afterAction, ignoreCopy, subject, palette
} = {}) {
  if (![brandName, heading, intro, actionLabel, actionUrl, afterAction, ignoreCopy, subject].every(Boolean)) {
    throw new TypeError('Transactional email requires its brand, action and support copy.');
  }
  if (!/^https:\/\//.test(brandUrl || '') || brandMarkUrl && !/^https:\/\//.test(brandMarkUrl)) {
    throw new TypeError('Transactional email brand links require HTTPS.');
  }
  const canvas = color(palette?.canvas), surface = color(palette?.surface);
  const foreground = color(palette?.foreground), secondary = color(palette?.secondary);
  const border = color(palette?.border);
  const accent = color(palette?.accent), accentForeground = color(palette?.accentForeground);
  const mark = brandMarkUrl
    ? `<img src="${escapeHtml(brandMarkUrl)}" alt="" width="56" height="56" style="display:block;margin:0 auto 12px;max-width:56px;max-height:56px;">`
    : '';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${canvas};color:${foreground};font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${canvas};padding:36px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:${surface};border:1px solid ${border};border-radius:12px;">
        <tr><td align="center" style="padding:32px 28px 24px;">
          ${mark}<div style="color:${foreground};font-size:23px;font-weight:700;line-height:1.2;">${escapeHtml(brandName)}</div>
        </td></tr>
        <tr><td align="center" style="padding:8px 28px 32px;">
          <h1 style="margin:0 0 16px;color:${foreground};font-size:22px;line-height:1.3;">${escapeHtml(heading)}</h1>
          <p style="margin:0 0 26px;color:${secondary};font-size:15px;line-height:1.6;">${escapeHtml(intro)}</p>
          <a href="${escapeHtml(actionUrl)}" style="display:inline-block;padding:13px 26px;border-radius:8px;background:${accent};color:${accentForeground};font-size:15px;font-weight:700;text-decoration:none;">${escapeHtml(actionLabel)}</a>
          <p style="margin:26px 0 0;color:${secondary};font-size:13px;line-height:1.6;">${escapeHtml(afterAction)}</p>
          <p style="margin:12px 0 0;color:${secondary};font-size:13px;line-height:1.6;">${escapeHtml(ignoreCopy)}</p>
        </td></tr>
        <tr><td align="center" style="padding:18px 28px;border-top:1px solid ${border};">
          <a href="${escapeHtml(brandUrl)}" style="color:${accent};font-size:12px;text-decoration:none;">${escapeHtml(brandName)}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;
}
