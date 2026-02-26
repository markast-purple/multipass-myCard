import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import heTranslations from "../i18n/he.json";

i18n.use(initReactI18next).init({
  lng: "he",
  debug: true,
  fallbackLng: "he",
  resources: {
    he: {
      translation: heTranslations,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
