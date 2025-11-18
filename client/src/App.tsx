import { useState } from 'react';
import { Heading, Theme, VStack } from '@navikt/ds-react';
import Tabell from './components/Tabell';
import Filtrering from './components/Filtrering';
import { useQuery } from '@tanstack/react-query';
import type { Person } from './types/person';

function App() {
	const [sokeverdi, setSokeverdi] = useState('');
	const [hjelpemiddelsentralVerdi, setHjelpemiddelsentralVerdi] = useState('');

	const {
		isPending,
		error,
		data: personer = [],
	} = useQuery<Person[]>({
		queryKey: ['personer'],
		queryFn: () => fetch('/api/personer').then((res) => res.json()),
	});

	if (isPending) return 'Loading...';

	if (error) return 'An error has occurred: ' + error.message;

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
					personer={personer}
				/>
				<Tabell
					sokeverdi={sokeverdi}
					hjelpemiddelsentralVerdi={hjelpemiddelsentralVerdi}
					personer={personer}
				/>
			</VStack>
		</Theme>
	);
}

export default App;
