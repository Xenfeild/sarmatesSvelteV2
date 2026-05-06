// src/stores/translationsStore.ts
import { writable } from 'svelte/store';

interface Translations {
    [key: string]: string;
}

const translations = writable<Translations>({});

async function loadTranslations(lang: string) {
    try {
        const response = await fetch(`/locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${lang}`);
        }
        const data: Translations = await response.json();
        translations.set(data);
        document.documentElement.lang = lang;
    } catch (error) {
        console.error("Error loading translations:", error);
    }
}

export { translations, loadTranslations };