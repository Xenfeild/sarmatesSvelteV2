// Configuration des URLs API avec détection automatique
function getBaseUrl() {
    // 1. Variable d'environnement explicite (priorité)
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    // 2. Détection automatique basée sur l'URL du site
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        
        // Production : si le site est sur sarmates-music.com
        if (hostname === 'sarmates-music.com' || hostname === 'www.sarmates-music.com') {
            return 'https://api.sarmates-music.com';
        }
        
        // Staging : si le site est sur test.sarmates-music.com  
        if (hostname.includes('test.') || hostname.includes('staging.')) {
            return 'https://test-api.sarmates-music.com';
        }
    }
    
    // 3. Fallback développement
    return 'http://localhost:3000';
}

export const API_CONFIG = {
    BASE_URL: getBaseUrl(),
    ENDPOINTS: {
        NEWS: '/api/news',
        PRESS: '/api/press',
        LIVE: '/api/live',
        LOGIN: '/api/login',
        EMAIL: '/send-email',
        UPLOADS: '/uploads'
    }
};

// Helper pour construire les URLs complètes
export function getApiUrl(endpoint: string) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Helper pour les images uploadées
export function getUploadUrl(imagePath: string) {
    if (!imagePath) return '';
    return imagePath.startsWith('/uploads') 
        ? `${API_CONFIG.BASE_URL}${imagePath}`
        : imagePath;
}