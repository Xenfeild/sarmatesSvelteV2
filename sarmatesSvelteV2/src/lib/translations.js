
/** @param {string} lang */
export async function loadTranslations(lang) {
    /** @type {{ title?: string; description?: string; [key: string]: any }} */
    let translations = {};
    try {
        const response = await fetch(`/locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${lang}`);
        }
        translations = await response.json();
        document.title = translations.title ?? '';
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', translations.description ?? '');
        }
        document.documentElement.lang = lang;
    } catch (error) {
        console.error("Error loading translations:", error);
    }
    return translations;
}