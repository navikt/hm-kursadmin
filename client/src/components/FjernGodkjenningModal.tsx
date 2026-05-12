import { BodyLong, Button, Modal } from '@navikt/ds-react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../queryClient';
import type { Person } from '../types/person';
import { BASE_URL, beskrivFeil } from '../helpers/utils';
import { useVarsel } from '../hooks/useVarsel';

interface Props {
	person: Person;
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	onError: (errorMessage: string) => void;
	onClearErrors: () => void;
}

const FjernGodkjenningModal = ({
	person,
	open,
	onClose,
	onConfirm,
	onError,
	onClearErrors,
}: Props) => {
	const { visVarsel } = useVarsel();

	const fjernDel2Mutation = useMutation({
		mutationFn: async () => {
			const response = await fetch(
				`${BASE_URL}/personer/${person.id}/fjern-del2`,
				{
					method: 'PATCH',
				},
			);
			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				throw new Error(
					errorData?.message ||
						beskrivFeil(response.status, 'Kunne ikke fjerne godkjenning'),
				);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['personer'] });
			onClearErrors();
			onConfirm();
			visVarsel(`Fjernet godkjenning for ${person.navn}`);
		},
		onError: (error) => {
			onError(error.message);
		},
	});

	return (
		<Modal
			open={open}
			onClose={onClose}
			header={{
				heading: 'Er du sikker?',
				size: 'medium',
				closeButton: false,
			}}
			width="small"
		>
			<Modal.Body>
				<BodyLong>
					Er du sikker på at du vil fjerne godkjenningen av del 2 for{' '}
					{person.navn}?
				</BodyLong>
			</Modal.Body>
			<Modal.Footer>
				<Button
					type="button"
					variant="danger"
					onClick={() => {
						fjernDel2Mutation.mutate();
						onClose();
					}}
					loading={fjernDel2Mutation.isPending}
				>
					Ja, jeg er sikker
				</Button>
				<Button type="button" variant="secondary-neutral" onClick={onClose}>
					Avbryt
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default FjernGodkjenningModal;
