import { writable } from 'svelte/store';

export const consentGiven = writable(false);
export const nonEssentialCookiesAccepted = writable(false);
