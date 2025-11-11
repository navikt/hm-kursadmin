import { Heading, Theme, VStack } from '@navikt/ds-react';
import Tabell from './components/Tabell';

function App() {
	return (
		<Theme theme="light">
			<VStack margin="space-20">
				<Heading size="large" level="1">
					Administreringsverktøy for ERS kurs del 2
				</Heading>
				<Tabell />
			</VStack>
		</Theme>
	);
}

export default App;
