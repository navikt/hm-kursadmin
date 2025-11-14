import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';

import './styles/global.css';
import '@navikt/ds-css/darkside';

const queryClient = new QueryClient();

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
	if (import.meta.env.MODE !== 'development') {
		return;
	}

	const { worker } = await import('./mocks/browser');

	// `worker.start()` returns a Promise that resolves
	// once the Service Worker is up and ready to intercept requests.
	return worker.start({
		serviceWorker: {
			url: '/hjelpemidler/kursadmin/mockServiceWorker.js',
		},
		onUnhandledRequest: 'warn',
	});
}

enableMocking().then(() => {
	createRoot(document.getElementById('root')!).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</StrictMode>
	);
});
