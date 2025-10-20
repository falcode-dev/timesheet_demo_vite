import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ja from "./locales/ja/translation.json";
import en from "./locales/en/translation.json";

/**
 * Dataverseの言語ID → 言語コード変換
 * 1033: 英語, 1041: 日本語 など
 */
const getLanguageFromXrm = (): string => {
    try {
        const xrm = (window as any).Xrm;
        if (xrm?.Utility?.getGlobalContext) {
            const langId = xrm.Utility.getGlobalContext().userSettings.languageId;
            switch (langId) {
                case 1041:
                    return "ja";
                case 1033:
                    return "en";
                default:
                    return "en";
            }
        }
    } catch (e) {
        console.warn("Xrm context not available, fallback to browser language");
    }
    // Xrm未接続時はブラウザ言語を使用
    return navigator.language.startsWith("ja") ? "ja" : "en";
};

const userLang = getLanguageFromXrm();
// debug
// const userLang = "en";
// debug

i18n
    .use(initReactI18next)
    .init({
        resources: { ja: { translation: ja }, en: { translation: en } },
        lng: userLang,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
