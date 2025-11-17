import { useState } from 'react';
import { Heading, Theme, VStack } from '@navikt/ds-react';
import Tabell from './components/Tabell';
import Filtrering from './components/Filtrering';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';

function App() {
	const [sokeverdi, setSokeverdi] = useState('');
	const [kommuneVerdi, setKommuneVerdi] = useState('');

	return (
		<QueryClientProvider client={queryClient}>
			<Theme theme="light">
				<VStack margin="space-20" gap="space-16">
					<Heading size="large" level="1">
						Administreringsverktøy for ERS kurs del 2
					</Heading>
					<Filtrering
						sokeverdi={sokeverdi}
						setSokeverdi={setSokeverdi}
						kommuneVerdi={kommuneVerdi}
						setKommuneVerdi={setKommuneVerdi}
					/>
					<Tabell sokeverdi={sokeverdi} kommuneVerdi={kommuneVerdi} />
				</VStack>
			</Theme>
		</QueryClientProvider>
	);
}

export default App;
