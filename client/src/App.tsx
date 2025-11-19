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
				{error && <Alert variant="error">{error.message}</Alert>}
				<Tabell
					sokeverdi={sokeverdi}
					hjelpemiddelsentralVerdi={hjelpemiddelsentralVerdi}
					statusDel2Verdi={statusDel2Verdi}
					personer={personer}
					isPending={isPending}
				/>
			</VStack>
		</Theme>
	);
}

export default App;
