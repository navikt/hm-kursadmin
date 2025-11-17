import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function htmlPlugin({ development }: { development?: boolean }): Plugin {
	return {
		name: 'html-plugin',
		transformIndexHtml(html) {
			const tags: HtmlTagDescriptor[] = [];
			if (development) {
				tags.push({
					tag: 'script',
					children: `window.appSettings = {
            NAIS_CLUSTER_NAME: 'local',
            
            FARO_URL: '',
            
            UMAMI_ENABLED: false,
            UMAMI_WEBSITE_ID: '',
            
            USE_MSW: true,
            
            GIT_COMMIT: '',
          }`,
				});
			} else {
				tags.push(
					{
						tag: 'script',
						children: `window.appSettings = {}`,
					},
					{
						tag: 'script',
						attrs: {
							src: '/settings.js',
						},
					}
				);
			}
			return {
				html,
				tags,
			};
		},
	};
}

// https://vite.dev/config/
export default defineConfig((env) => ({
	base: '/hjelpemidler/kursadmin/',
	plugins: [react(), htmlPlugin({ development: env.mode === 'development' })],
}));
