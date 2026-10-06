function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function scrollVideoMarkup(model = {}) {
  return `<figure class="bb-scroll-video" data-bb-scroll-video>
    <video class="bb-scroll-video__media" data-bb-video-src="${escapeHtml(model.src)}" data-bb-video-poster="${escapeHtml(model.poster)}" data-bb-video-label="${escapeHtml(model.label)}" width="${Number(model.width)}" height="${Number(model.height)}" preload="none" muted playsinline loop role="button" tabindex="0" aria-label="Play video: ${escapeHtml(model.label)}"></video>
  </figure>`;
}

const installedDocuments = new WeakSet();

export function installScrollVideoController(root = globalThis.document) {
  if (!root?.querySelectorAll || installedDocuments.has(root)) return;
  installedDocuments.add(root);
  const reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
  const states = new Map();
  const observer = typeof IntersectionObserver === 'function'
    ? new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const state = states.get(entry.target);
        if (!state) continue;
        if (entry.isIntersecting && !state.video.poster) state.video.poster = state.video.dataset.bbVideoPoster;
        state.visible = entry.intersectionRatio >= 0.5;
        if (state.visible) {
          if (!state.video.src) state.video.src = state.video.dataset.bbVideoSrc;
          if (!state.manualPause && !reducedMotion?.matches && !root.hidden) {
            state.video.play().catch(() => {});
          }
        } else {
          state.video.pause();
        }
      }
    }, { threshold: [0, 0.5] })
    : null;

  for (const figure of root.querySelectorAll('[data-bb-scroll-video]')) {
    const video = figure.querySelector('video[data-bb-video-src]');
    if (!video) continue;
    const state = { video, manualPause: false, visible: false };
    states.set(figure, state);
    const update = () => {
      const playing = !video.paused;
      video.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} video: ${video.dataset.bbVideoLabel}`);
    };
    video.addEventListener('play', update);
    video.addEventListener('pause', update);
    const toggle = () => {
      if (!video.paused) {
        state.manualPause = true;
        video.pause();
        return;
      }
      state.manualPause = false;
      if (!video.poster) video.poster = video.dataset.bbVideoPoster;
      if (!video.src) video.src = video.dataset.bbVideoSrc;
      video.play().catch(update);
    };
    video.addEventListener('click', toggle);
    video.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggle();
    });
    observer?.observe(figure);
  }
  root.addEventListener('visibilitychange', () => {
    for (const state of states.values()) {
      if (root.hidden) state.video.pause();
      else if (state.visible && !state.manualPause && !reducedMotion?.matches) state.video.play().catch(() => {});
    }
  });
  reducedMotion?.addEventListener?.('change', () => {
    if (reducedMotion.matches) for (const state of states.values()) state.video.pause();
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => installScrollVideoController(document), { once: true });
  else installScrollVideoController(document);
}
