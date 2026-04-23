// Types centralisés pour l'application Sarmates
export interface NewsItem {
    id: number;
    title: string;
    content: string;
    image: string;
    thumbnail: string;
    date: string;
}

export interface PressItem {
    id: number;
    title: string;
    content: string;
    image: string;
    date: string;
    link: string;
}

export interface LiveItem {
    id: number;
    event_name: string;
    image: string;
    address: string;
    event_date: string;
    link: string;
}

export interface BiographyItem {
    name: string;
    image: string;
    role: string;
    content: string;
}

// Types pour les formulaires
export type NewNewsItem = Omit<NewsItem, 'id'>;
export type NewPressItem = Omit<PressItem, 'id'>;
export type NewLiveItem = Omit<LiveItem, 'id'>;

// Types pour les réponses API
export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface ApiError {
    error: string;
    details?: unknown;
}

// Types pour la gestion d'état
export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}