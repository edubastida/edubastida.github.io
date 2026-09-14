import dictionary from '../data/translations.json';

type Language = 'en' | 'ca' | 'es';
const translations: Record<string, { ca: string; es: string }> = dictionary;
const storageKey = 'portfolio-language';
let language: Language = 'en';
try {
  const saved = localStorage.getItem(storageKey);
  if (saved === 'ca' || saved === 'es') language = saved;
} catch { /* The selector also works when browser storage is disabled. */ }

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
// Keep English originals so repeated language changes never translate a translation.
const originals = new WeakMap<Node, { source: string; rendered: string }>();
const attributes = new WeakMap<Element, Map<string, { source: string; rendered: string }>>();
const excluded = 'script, style, code, pre, textarea, [translate="no"], #resume-print';

function translate(source: string): string {
  if (language === 'en') return source;
  const key = normalize(source);
  let result = translations[key]?.[language];
  if (!result && key.includes('All rights reserved.')) {
    result = key.replace('All rights reserved.', language === 'ca' ? 'Tots els drets reservats.' : 'Todos los derechos reservados.');
  }
  if (!result) return source;
  return (source.match(/^\s*/)?.[0] ?? '') + result + (source.match(/\s*$/)?.[0] ?? '');
}

function translatePage() {
  observer.disconnect();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest(excluded)) continue;
    const current = node.textContent ?? '';
    const previous = originals.get(node);
    const source = previous?.rendered === current ? previous.source : current;
    const rendered = translate(source);
    originals.set(node, { source, rendered });
    if (current !== rendered) node.textContent = rendered;
  }
  for (const element of document.body.querySelectorAll('[aria-label], [title], [placeholder], [alt]')) {
    if (element.closest('script, style, [translate="no"], #resume-print')) continue;
    const saved = attributes.get(element) ?? new Map();
    for (const name of ['aria-label', 'title', 'placeholder', 'alt']) {
      const current = element.getAttribute(name);
      if (current === null) continue;
      const previous = saved.get(name);
      const source = previous?.rendered === current ? previous.source : current;
      const rendered = translate(source);
      saved.set(name, { source, rendered });
      if (current !== rendered) element.setAttribute(name, rendered);
    }
    attributes.set(element, saved);
  }
  document.documentElement.lang = language;
  document.querySelectorAll<HTMLSelectElement>('#language-selector').forEach((select) => {
    select.value = language;
    select.setAttribute('aria-label', language === 'en' ? 'Language' : 'Idioma');
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'title', 'placeholder', 'alt'] });
}

// Project dialogs, carousel captions and form responses can appear after page load.
const observer = new MutationObserver(translatePage);
document.addEventListener('change', (event) => {
  const select = event.target;
  if (!(select instanceof HTMLSelectElement) || select.id !== 'language-selector') return;
  if (!['en', 'ca', 'es'].includes(select.value)) return;
  language = select.value as Language;
  try { localStorage.setItem(storageKey, language); } catch { /* Optional persistence. */ }
  translatePage();
});
translatePage();
