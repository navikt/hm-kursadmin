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

	const opprettDel2Mutation = useMutation({
		mutationFn: () => {
			return fetch(`/api/personer/${person.id}/opprett-del2`, {
				method: 'PATCH',
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['personer'] });
		},
	});

	if (!del2Dato) {
		return (
			<Button
				size="small"
				variant="primary-neutral"
				onClick={() => {
					opprettDel2Mutation.mutate();
				}}
				loading={opprettDel2Mutation.isPending}
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
