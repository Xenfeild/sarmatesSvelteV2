import { getApiUrl } from '$lib/config';
import type { NewsItem, PressItem, LiveItem } from '$lib/types';

/**
 * Service API centralisé pour toutes les requêtes backend
 * Élimine la duplication de code et standardise la gestion d'erreurs
 */
class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = getApiUrl('');
    }

    /**
     * GET - Récupère une collection d'éléments
     */
    async get<T>(endpoint: string): Promise<T[]> {
        try {
            console.log(`[API] GET ${endpoint}`);
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`[API] GET ${endpoint} - Success:`, data.length, 'items');
            return data;
        } catch (error) {
            console.error(`[API] GET ${endpoint} - Error:`, error);
            throw error;
        }
    }

    /**
     * POST - Crée un nouvel élément (avec FormData pour uploads)
     */
    async post<T>(endpoint: string, data: FormData): Promise<T> {
        try {
            console.log(`[API] POST ${endpoint}`);
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                credentials: 'include',
                body: data
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[API] POST ${endpoint} - Error:`, response.status, response.statusText, errorText);
                let serverMessage = response.statusText;
                try { const parsed = JSON.parse(errorText); if (parsed?.error) serverMessage = parsed.error; } catch { /* not JSON */ }
                throw new Error(serverMessage);
            }

            const result = await response.json();
            console.log(`[API] POST ${endpoint} - Success`);
            return result;
        } catch (error) {
            console.error(`[API] POST ${endpoint} - Error:`, error);
            throw error;
        }
    }

    /**
     * PUT - Met à jour un élément existant
     */
    async put<T>(endpoint: string, id: number, data: FormData): Promise<T> {
        try {
            console.log(`[API] PUT ${endpoint}/${id}`);
            const response = await fetch(`${this.baseUrl}${endpoint}/${id}`, {
                method: 'PUT',
                credentials: 'include',
                body: data
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[API] PUT ${endpoint}/${id} - Error:`, response.status, response.statusText, errorText);
                let serverMessage = response.statusText;
                try { const parsed = JSON.parse(errorText); if (parsed?.error) serverMessage = parsed.error; } catch { /* not JSON */ }
                throw new Error(serverMessage);
            }

            const result = await response.json();
            console.log(`[API] PUT ${endpoint}/${id} - Success`);
            return result;
        } catch (error) {
            console.error(`[API] PUT ${endpoint}/${id} - Error:`, error);
            throw error;
        }
    }

    /**
     * DELETE - Supprime un élément
     */
    async delete(endpoint: string, id: number): Promise<void> {
        try {
            console.log(`[API] DELETE ${endpoint}/${id}`);
            const response = await fetch(`${this.baseUrl}${endpoint}/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[API] DELETE ${endpoint}/${id} - Error:`, response.status, response.statusText, errorText);
                let serverMessage = response.statusText;
                try { const parsed = JSON.parse(errorText); if (parsed?.error) serverMessage = parsed.error; } catch { /* not JSON */ }
                throw new Error(serverMessage);
            }

            console.log(`[API] DELETE ${endpoint}/${id} - Success`);
        } catch (error) {
            console.error(`[API] DELETE ${endpoint}/${id} - Error:`, error);
            throw error;
        }
    }

    // Méthodes spécifiques pour chaque collection
    async getNews(): Promise<NewsItem[]> {
        return this.get<NewsItem>('/api/news');
    }

    async getPress(): Promise<PressItem[]> {
        return this.get<PressItem>('/api/press');
    }

    async getLive(): Promise<LiveItem[]> {
        return this.get<LiveItem>('/api/live');
    }

    async createNews(data: FormData): Promise<NewsItem> {
        return this.post<NewsItem>('/api/news', data);
    }

    async createPress(data: FormData): Promise<PressItem> {
        return this.post<PressItem>('/api/press', data);
    }

    async createLive(data: FormData): Promise<LiveItem> {
        return this.post<LiveItem>('/api/live', data);
    }

    async updateLive(id: number, data: FormData): Promise<LiveItem> {
        return this.put<LiveItem>('/api/live', id, data);
    }

    async updateNews(id: number, data: FormData): Promise<NewsItem> {
        return this.put<NewsItem>('/api/news', id, data);
    }

    async updatePress(id: number, data: FormData): Promise<PressItem> {
        return this.put<PressItem>('/api/press', id, data);
    }

    async deleteLive(id: number): Promise<void> {
        return this.delete('/api/live', id);
    }

    async deleteNews(id: number): Promise<void> {
        return this.delete('/api/news', id);
    }

    async deletePress(id: number): Promise<void> {
        return this.delete('/api/press', id);
    }
}

// Instance singleton exportée
export const api = new ApiService();

// Export des types pour faciliter l'utilisation
export type { NewsItem, PressItem, LiveItem } from '$lib/types';