
export async function loadTranslations(lang) {
    let translations = {};
    try {
        const response = await fetch(`/src/locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${lang}`);
        }
        translations = await response.json();
        console.log("Loaded translations:", translations); // Ajout de log pour vérifier les traductions chargées
        document.title = translations.title;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', translations.description);
        }
        document.documentElement.lang = lang;
    } catch (error) {
        console.error("Error loading translations:", error);
    }
    return translations;
}