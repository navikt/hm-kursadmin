import { useState } from 'react';
import { Alert, BodyLong, Button, Modal } from '@navikt/ds-react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../queryClient';
import type { Person } from '../types/person';

interface FjernGodkjenningModalProps {
	person: Person;
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const FjernGodkjenningModal = ({
	person,
	open,
	onClose,
	onConfirm,
}: FjernGodkjenningModalProps) => {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const fjernDel2Mutation = useMutation({
		mutationFn: () => {
			return fetch(`/api/personer/${person.id}/fjern-del2`, {
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
			onConfirm();
		},
		onError: (error) => {
			console.error('Feil ved fjerning av del 2 godkjenning:', error);
			setErrorMessage(error.message);
		},
	});

	return (
		<Modal
			open={open}
			onClose={onClose}
			header={{
				heading: 'Er du sikker?',
				size: 'small',
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
						setErrorMessage(null);
						fjernDel2Mutation.mutate();
					}}
					loading={fjernDel2Mutation.isPending}
				>
					Ja, jeg er sikker
				</Button>
				<Button type="button" variant="secondary" onClick={onClose}>
					Avbryt
				</Button>
				{errorMessage && (
					<Alert inline variant="error" size="small">
						{errorMessage}
					</Alert>
				)}
			</Modal.Footer>
		</Modal>
	);
};

export default FjernGodkjenningModal;
