import { useState } from 'react';
import { Button } from '@navikt/ds-react/Button';
import FjernGodkjenningModal from './FjernGodkjenningModal';
import type { Person } from '../types/person';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../queryClient';

interface Props {
	person: Person;
	del2Dato: string | null;
}

const GodkjennEllerFjernGodkjenning = ({ person, del2Dato }: Props) => {
	const [modalOpen, setModalOpen] = useState(false);

	const godkjennDel2Mutation = useMutation({
		mutationFn: () => {
			return fetch(`/api/personer/${person.id}/godkjenn-del2`, {
				method: 'PATCH',
			}).then((response) => {
				if (!response.ok) {
					return response
						.json()
						.catch(() => ({ message: 'Ukjent feil' }))
						.then((errorData) => {
							throw new Error(
								errorData.message ||
									`HTTP ${response.status}: ${response.statusText}`
							);
						});
				}
				return response.json();
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['personer'] });
		},
		onError: (error) => {
			console.error('Feil ved godkjenning av del 2:', error);
			alert(`Kunne ikke godkjenne del 2: ${error.message}`); // TODO: Bedre feilhåndtering
		},
	});

	if (!del2Dato) {
		return (
			<Button
				size="small"
				variant="primary-neutral"
				onClick={() => {
					godkjennDel2Mutation.mutate();
				}}
				loading={godkjennDel2Mutation.isPending}
			>
				Godkjenn del 2
			</Button>
		);
	} else {
		return (
			<>
				<FjernGodkjenningModal
					person={person}
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					onConfirm={() => setModalOpen(false)}
				/>
				<Button
					size="small"
					variant="secondary-neutral"
					onClick={() => setModalOpen(true)}
				>
					Fjern godkjenning
				</Button>
			</>
		);
	}
};
export default GodkjennEllerFjernGodkjenning;
