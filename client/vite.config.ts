import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import Mustache from 'mustache';
import { fetchDecoratorHtml } from '@navikt/nav-dekoratoren-moduler/ssr';

function htmlPlugin({ development }: { development?: boolean }): Plugin {
	return {
		name: 'html-plugin',
		async transformIndexHtml(html) {
			const tags: HtmlTagDescriptor[] = [];
			if (development) {
				const decorator = await fetchDecoratorHtml({
					env: 'dev',
					params: {
						context: 'samarbeidspartner',
					},
				});
				const {
					DECORATOR_HEAD_ASSETS: HeadAssets,
					DECORATOR_HEADER: Header,
					DECORATOR_FOOTER: Footer,
					DECORATOR_SCRIPTS: Scripts,
				} = decorator;

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

				return {
					html: Mustache.render(html.replace(/\{\{\./g, '{{{').replace(/\}\}/g, '}}}'), {
						HeadAssets,
						Header,
						Footer,
						Scripts,
					}),
					tags,
				};
			} else {
				tags.push(
					{
						tag: 'script',
						children: `window.appSettings = {}`,
					},
					{
						tag: 'script',
						attrs: {
							src: '/hjelpemidler/kursadmin/settings.js',
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
