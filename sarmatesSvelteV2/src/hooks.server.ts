import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

const JWT_SECRET = env.JWT_SECRET;

export const handle: Handle = async ({ event, resolve }) => {
    if (event.url.pathname.startsWith('/admin') && event.url.pathname !== '/admin/login') {
        const token = event.cookies.get('token');

        let valid = false;
        if (token && JWT_SECRET) {
            try {
                jwt.verify(token, JWT_SECRET);
                valid = true;
            } catch {
                valid = false;
            }
        }

        if (!valid) {
            event.cookies.delete('token', { path: '/' });
            throw redirect(302, '/admin/login');
        }
    }

    return resolve(event);
};