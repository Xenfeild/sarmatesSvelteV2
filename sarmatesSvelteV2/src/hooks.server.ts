import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('token');

    // Vérifiez si le jeton est présent et valide
    if (event.url.pathname.startsWith('/admin') && event.url.pathname !== '/admin/login' && !token) {
        throw redirect(302, '/admin/login');
    }

    return resolve(event);
};