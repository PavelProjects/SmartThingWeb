import { createIntl, createIntlCache } from 'vue-intl'
import { messages } from './messages'

const LOCALE_STORAGE_KEY = 'locale'
const DEFAULT_LOCALE = 'en'
const SUPPORTED_LOCALES = Object.keys(messages)

const currentLocale =
  localStorage.getItem(LOCALE_STORAGE_KEY) ?? navigator.language.slice(0, 2) ?? DEFAULT_LOCALE

const intlInstance = createIntl(
  {
    locale: currentLocale,
    messages: messages[currentLocale] ?? messages[DEFAULT_LOCALE]
  },
  createIntlCache()
)

const switchLocale = (lang) => {
  if (!SUPPORTED_LOCALES.includes(lang)) {
    console.error('Unkown language: ' + lang)
    return
  }
  localStorage.setItem(LOCALE_STORAGE_KEY, lang)
  location.reload()
}

export { intlInstance, currentLocale, switchLocale, SUPPORTED_LOCALES }
