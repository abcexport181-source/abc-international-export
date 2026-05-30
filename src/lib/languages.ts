export const languages = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'Arabic' },
  { code: 'cs', label: 'Czech' },
  { code: 'de', label: 'German' },
  { code: 'el', label: 'Greek' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'hu', label: 'Hungarian' },
  { code: 'it', label: 'Italian' },
  { code: 'lt', label: 'Lithuanian' },
  { code: 'nl', label: 'Dutch' },
  { code: 'pl', label: 'Polish' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ro', label: 'Romanian' },
  { code: 'ru', label: 'Russian' },
  { code: 'sl', label: 'Slovenian' },
];

export const defaultLanguage = 'en';

export const languageCodes = languages.map(language => language.code);
export const languagePrefixPattern = new RegExp(`^(${languageCodes.join('|')}):`);

export const stripLanguagePrefix = (id: string) => id.replace(languagePrefixPattern, '');
