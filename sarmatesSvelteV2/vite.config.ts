import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
    server: {
        proxy: {
            '/api': 'http://localhost:3000',
            '/uploads': 'http://localhost:3000',
        }
    },
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
