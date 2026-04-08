import { useState } from 'react';
import { HStack, InternalHeader, LocalAlert, VStack } from '@navikt/ds-react';
import Tabell from './components/Tabell/Tabell';
import Filtrering from './components/Filtrering/Filtrering';
import KursChips from './components/KursChips';
import ThemeSwitcher from './components/ThemeSwitcher';
import { useQuery } from '@tanstack/react-query';
import type { Person } from './types/person';
import { kursliste, type Kurs } from './types/kurs';
import { BASE_URL, beskrivFeil } from './helpers/utils';

function App() {
	const [sokeverdi, setSokeverdi] = useState('');
	const [hjelpemiddelsentralVerdi, setHjelpemiddelsentralVerdi] = useState('');
	const [statusDel2Verdi, setStatusDel2Verdi] = useState('');
	const [valgtkurs, setValgtkurs] = useState<Kurs>(kursliste[0]);
	const [errors, setErrors] = useState<Array<{ id: string; message: string }>>(
		[],
	);

	const {
		isPending,
		error,
		data: personer = [],
	} = useQuery<Person[]>({
		queryKey: ['personer', valgtkurs.id],
		queryFn: async () => {
			const response = await fetch(`${BASE_URL}/personer/${valgtkurs.id}`);
			if (!response.ok) {
				throw new Error(
					beskrivFeil(response.status, 'Kunne ikke hente personer'),
				);
			}
			const data = await response.json();
			return data.personer;
		},
	});

	const addError = (errorMessage: string) => {
		const errorId = Date.now().toString();
		setErrors((prev) => [...prev, { id: errorId, message: errorMessage }]);
	};

	const clearAllErrors = () => {
		setErrors([]);
	};

	const removeError = (errorId: string) => {
		setErrors((prev) => prev.filter((error) => error.id !== errorId));
	};

	const allErrors = [
		...(error ? [{ id: 'query-error', message: error.message }] : []),
		...errors,
	];

	return (
		<main>
			<InternalHeader>
				<InternalHeader.Title as="h1">
					Godkjenningskurs - fullførte kurs
				</InternalHeader.Title>
			</InternalHeader>

			<VStack margin="space-20" gap="space-16">
				<HStack
					align="start"
					justify="space-between"
					wrap={false}
					gap="space-4"
				>
					<KursChips valgtkurs={valgtkurs} setValgtkurs={setValgtkurs} />
					<div style={{ flexShrink: 0 }}>
						<ThemeSwitcher />
					</div>
				</HStack>
				<Filtrering
					sokeverdi={sokeverdi}
					setSokeverdi={setSokeverdi}
					hjelpemiddelsentralVerdi={hjelpemiddelsentralVerdi}
					setHjelpemiddelsentralVerdi={setHjelpemiddelsentralVerdi}
					statusDel2Verdi={statusDel2Verdi}
					setStatusDel2Verdi={setStatusDel2Verdi}
					personer={personer}
					valgtkurs={valgtkurs}
				/>
				<VStack gap="space-8">
					{allErrors.map((err) => (
						<LocalAlert key={err.id} status="error">
							<LocalAlert.Header>
								<LocalAlert.Title>Feil</LocalAlert.Title>
								<LocalAlert.CloseButton onClick={() => removeError(err.id)} />
							</LocalAlert.Header>
							<LocalAlert.Content>{err.message}</LocalAlert.Content>
						</LocalAlert>
					))}
				</VStack>
				<Tabell
					sokeverdi={sokeverdi}
					hjelpemiddelsentralVerdi={hjelpemiddelsentralVerdi}
					statusDel2Verdi={statusDel2Verdi}
					personer={personer}
					isPending={isPending}
					onError={addError}
					onClearErrors={clearAllErrors}
					valgtkurs={valgtkurs}
				/>
			</VStack>
		</main>
	);
}

export default App;
