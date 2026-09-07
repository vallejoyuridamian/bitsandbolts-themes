import { semanticIconMarkup } from './semantic-icons.js';

export function annotationHue(value = '') {
  let hash = 0;
  for (const character of String(value || '')) hash = ((hash * 31) + character.charCodeAt(0)) % 360;
  return 172 + (hash % 112);
}

export function createAnnotationPill({ rootDocument, label = '', dashed = false, identity = '' } = {}) {
  const pill = rootDocument.createElement('span');
  pill.className = 'bb-annotated-text__pill';
  if (dashed) pill.classList.add('is-dashed');
  pill.contentEditable = 'false';
  pill.draggable = true;
  pill.tabIndex = 0;
  pill.style.setProperty('--bb-annotation-hue', String(annotationHue(identity)));
  const text = rootDocument.createElement('span');
  text.className = 'bb-annotated-text__pill-label';
  text.textContent = label;
  const remove = rootDocument.createElement('button');
  remove.className = 'bb-annotated-text__remove';
  remove.dataset.bbThemeControl = '';
  remove.type = 'button';
  remove.contentEditable = 'false';
  remove.draggable = false;
  remove.setAttribute('aria-label', `Remove ${label}`);
  remove.innerHTML = semanticIconMarkup('close', 'bb-annotated-text__remove-icon');
  pill.append(text, remove);
  return { pill, remove };
}
