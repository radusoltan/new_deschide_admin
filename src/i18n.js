import i18n from 'i18next'
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import HttpApi from 'i18next-http-backend'
import ro from './translations/ro/admin.json'
import en from './translations/en/admin.json'
import ru from './translations/ru/admin.json'

const resources = {
  ro: { translation: ro },
  ru: { translation: ru },
  en: { translation: en },
}

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    resources,
    supportedLngs: ['ro', 'en','ru'],
    lng: 'ro',
    detection: {
      order:['cookie', 'localStorage'],
      caches: ['cookie', 'localStorage']
    },
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: { useSuspense: false }
  })

export default i18n