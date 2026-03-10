import { useState, useCallback } from 'react';
import { Alert, Heading, HStack, VStack } from '@navikt/ds-react';
import Tabell from './components/Tabell/Tabell';
import Filtrering from './components/Filtrering/Filtrering';
import ThemeSwitcher from './components/ThemeSwitcher';
import { useQuery } from '@tanstack/react-query';
import type { Person } from './types/person';
import type { Handling } from './types/handling';
import Handlingslog from './components/Handlingslog';
import { lagTidsstempel } from './helpers/utils';

export const BASE_URL = '/hjelpemidler/kursadmin/api';

function App() {
	const [sokeverdi, setSokeverdi] = useState('');
	const [hjelpemiddelsentralVerdi, setHjelpemiddelsentralVerdi] = useState('');
	const [statusDel2Verdi, setStatusDel2Verdi] = useState('');
	const [errors, setErrors] = useState<Array<{ id: string; message: string }>>(
		[]
	);
	const [handlinger, setHandlinger] = useState<Handling[]>([]);

	const leggTilHandling = useCallback(
		(data: Omit<Handling, 'id' | 'tidspunkt'>) => {
			const nyHandling: Handling = {
				...data,
				id: crypto.randomUUID(),
				tidspunkt: lagTidsstempel(),
			};
			setHandlinger((prev) => [nyHandling, ...prev]);
		},
		[]
	);

	const {
		isPending,
		error,
		data: personer = [],
	} = useQuery<Person[]>({
		queryKey: ['personer'],
		queryFn: () => {
			return fetch(`${BASE_URL}/personer`).then((response) => {
				if (!response.ok) {
					throw new Error(
						`Feil ved henting av personer: ${response.status} ${response.statusText}`
					);
				}
				return response.json().then((data) => data.personer);
			});
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

	const generateErrors = () => {
		const allErrors = [];

		if (error) {
			allErrors.push(
				<Alert key="query-error" variant="error">
					{error.message}
				</Alert>
			);
		}

		errors.forEach((err) => {
			allErrors.push(
				<Alert
					key={`error-${err.id}`}
					variant="error"
					closeButton
					onClose={() => removeError(err.id)}
				>
					{err.message}
				</Alert>
			);
		});

		return allErrors;
	};

	return (
		<main>
			<VStack margin="space-20" gap="space-16">
				<HStack justify="space-between" align="center" width="100%">
					<Heading size="large" level="1">
						Administreringsverktøy for ERS kurs del 2
					</Heading>
					<ThemeSwitcher />
				</HStack>
				<HStack justify="space-between" align="end" width="100%">
					<Filtrering
						sokeverdi={sokeverdi}
						setSokeverdi={setSokeverdi}
						hjelpemiddelsentralVerdi={hjelpemiddelsentralVerdi}
						setHjelpemiddelsentralVerdi={setHjelpemiddelsentralVerdi}
						statusDel2Verdi={statusDel2Verdi}
						setStatusDel2Verdi={setStatusDel2Verdi}
						personer={personer}
					/>
					<Handlingslog handlinger={handlinger} />
				</HStack>
				<VStack gap="space-8">{generateErrors()}</VStack>
				<Tabell
					sokeverdi={sokeverdi}
					hjelpemiddelsentralVerdi={hjelpemiddelsentralVerdi}
					statusDel2Verdi={statusDel2Verdi}
					personer={personer}
					isPending={isPending}
					onError={addError}
					onClearErrors={clearAllErrors}
					onLeggTilHandling={leggTilHandling}
				/>
			</VStack>
		</main>
	);
}

export default App;
