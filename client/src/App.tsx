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
	const [errors, setErrors] = useState<Array<{ id: string; message: string }>>(
		[]
	);

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
		<Theme theme="light">
			<main>
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
						onError={addError}
						onClearErrors={clearAllErrors}
					/>
				</VStack>
			</main>
		</Theme>
	);
}

export default App;
