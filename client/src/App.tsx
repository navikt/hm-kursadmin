import { useState } from 'react';
import { Alert, Heading, Theme, VStack } from '@navikt/ds-react';
import Tabell from './components/Tabell';
import Filtrering from './components/Filtrering/Filtrering';
import { useQuery } from '@tanstack/react-query';
import type { Person } from './types/person';

function App() {
	const [sokeverdi, setSokeverdi] = useState('');
	const [hjelpemiddelsentralVerdi, setHjelpemiddelsentralVerdi] = useState('');
	const [statusDel2Verdi, setStatusDel2Verdi] = useState('');
	const [godkjenningError, setGodkjenningError] = useState<string | null>(null);

	const {
		isPending,
		error,
		data: personer = [],
	} = useQuery<Person[]>({
		queryKey: ['personer'],
		queryFn: () => {
			return fetch('/api/personer').then((response) => {
				if (!response.ok) {
					throw new Error(
						`Feil ved henting av personer: ${response.status} ${response.statusText}`
					);
				}
				return response.json();
			});
		},
	});

	const handleGodkjenningError = (errorMessage: string) => {
		setGodkjenningError(errorMessage);
	};

	const clearGodkjenningError = () => {
		setGodkjenningError(null);
	};

	const generateErrors = () => {
		const errors = [];

		if (error) {
			errors.push(
				<Alert key="query-error" variant="error" closeButton>
					{error.message}
				</Alert>
			);
		}

		if (godkjenningError) {
			errors.push(
				<Alert key="godkjenning-error" variant="error" closeButton>
					{godkjenningError}
				</Alert>
			);
		}

		return errors;
	};

	return (
		<Theme theme="light">
			<VStack margin="space-20" gap="space-16">
				<Heading size="large" level="1">
					Administreringsverktøy for ERS kurs del 2
				</Heading>
				<Filtrering
					sokeverdi={sokeverdi}
					setSokeverdi={setSokeverdi}
					hjelpemiddelsentralVerdi={hjelpemiddelsentralVerdi}
					setHjelpemiddelsentralVerdi={setHjelpemiddelsentralVerdi}
					statusDel2Verdi={statusDel2Verdi}
					setStatusDel2Verdi={setStatusDel2Verdi}
					personer={personer}
				/>
				<VStack gap="space-8">{generateErrors()}</VStack>
				<Tabell
					sokeverdi={sokeverdi}
					hjelpemiddelsentralVerdi={hjelpemiddelsentralVerdi}
					statusDel2Verdi={statusDel2Verdi}
					personer={personer}
					isPending={isPending}
					onGodkjenningError={handleGodkjenningError}
					onClearGodkjenningError={clearGodkjenningError}
				/>
			</VStack>
		</Theme>
	);
}

export default App;
