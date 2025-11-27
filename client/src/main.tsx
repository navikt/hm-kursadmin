import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { ThemeProvider } from './contexts/ThemeContext';

import './styles/global.css';
import '@navikt/ds-css/darkside';

declare global {
	interface Window {
		msw: unknown;
		appSettings: {
			NAIS_CLUSTER_NAME?: 'dev-gcp' | 'prod-gcp';
			GIT_COMMIT?: string;
			USE_MSW?: boolean;
			DELBESTILLING_URL: string;
		};
	}
}

async function enableMocking() {
	if (window.appSettings.USE_MSW !== true) {
		return;
	}

	const { worker } = await import('./mocks/browser');

	// `worker.start()` returns a Promise that resolves
	// once the Service Worker is up and ready to intercept requests.
	return worker.start({
		serviceWorker: {
			url: '/hjelpemidler/kursadmin/mockServiceWorker.js',
		},
	});
}

enableMocking().then(() => {
	createRoot(document.getElementById('root')!).render(
		<StrictMode>
			<ThemeProvider>
				<QueryClientProvider client={queryClient}>
					<App />
				</QueryClientProvider>
			</ThemeProvider>
		</StrictMode>
	);
});
