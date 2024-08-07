import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en/translation.json';
import he from '../locales/he/translation.json';
import ar from '../locales/ar/translation.json';

const resources = {
    en: { translation: en },
    he: { translation: he },
    ar: { translation: ar },
};

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        resources,
        lng: 'en', // default language
        fallbackLng: 'en',
        interpolation: {escapeValue: false}
    }).then();

export default i18n;
