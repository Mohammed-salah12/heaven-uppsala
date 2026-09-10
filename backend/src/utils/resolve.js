/**
 * Helpers to turn a Mongoose `translations` Map into a flat object
 * for a requested language, always falling back to the default language
 * (so a freshly-added language never shows blanks).
 */

function mapToObject(map) {
  if (!map) return {};
  if (map instanceof Map) return Object.fromEntries(map);
  return map; // already a plain object
}

/**
 * Pick the translation for `lang`, falling back to `defaultLang`, then to
 * the first available translation, then to {}.
 */
function pick(translations, lang, defaultLang) {
  const obj = mapToObject(translations);
  if (obj[lang] != null) return obj[lang];
  if (obj[defaultLang] != null) return obj[defaultLang];
  const first = Object.values(obj)[0];
  return first != null ? first : {};
}

/**
 * Resolve a single document that has `translations`, merging the localized
 * fields onto the base document fields.
 */
function resolveDoc(doc, baseFields, lang, defaultLang) {
  const localized = pick(doc.translations, lang, defaultLang);
  const base = {};
  baseFields.forEach((f) => {
    base[f] = doc[f];
  });
  return { ...base, ...localized };
}

module.exports = { mapToObject, pick, resolveDoc };
