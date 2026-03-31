import { useState } from 'react';
import { LocalAlert, VStack } from '@navikt/ds-react';
import Tabell from './components/Tabell/Tabell';
import Filtrering from './components/Filtrering/Filtrering';
import VelgKurs from './components/VelgKurs';
import ThemeSwitcher from './components/ThemeSwitcher';
import { useQuery } from '@tanstack/react-query';
import type { Person } from './types/person';
import { kursliste, type Kurs } from './types/kurs';

export const BASE_URL = '/hjelpemidler/kursadmin/api';

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
		queryFn: () => {
			return fetch(`${BASE_URL}/personer/${valgtkurs.id}`).then((response) => {
				if (!response.ok) {
					throw new Error(
						`Feil ved henting av personer: ${response.status} ${response.statusText}`,
					);
				}
				return response.json().then((data) => {
					console.log('Hentet personer:', data);
					return data.personer;
				});
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
				<LocalAlert key="query-error" status="error">
					<LocalAlert.Header>
						<LocalAlert.Title>Feil</LocalAlert.Title>
						<LocalAlert.CloseButton
							onClick={() => removeError('query-error')}
						/>
					</LocalAlert.Header>
					<LocalAlert.Content>{error.message}</LocalAlert.Content>
				</LocalAlert>,
			);
		}

		errors.forEach((error) => {
			allErrors.push(
				<LocalAlert key={`error-${error.id}`} status="error">
					<LocalAlert.Header>
						<LocalAlert.Title>Feil</LocalAlert.Title>
						<LocalAlert.CloseButton onClick={() => removeError(error.id)} />
					</LocalAlert.Header>
					<LocalAlert.Content>{error.message}</LocalAlert.Content>
				</LocalAlert>,
			);
		});

		return allErrors;
	};

	return (
		<main>
			<div
				style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1000 }}
			>
				<ThemeSwitcher />
			</div>
			<VStack margin="space-20" gap="space-16">
				<VelgKurs valgtkurs={valgtkurs} setValgtkurs={setValgtkurs} />

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
				<VStack gap="space-8">{generateErrors()}</VStack>
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
