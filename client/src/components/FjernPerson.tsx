import { useState } from 'react';
import { PersonCrossIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Checkbox, Modal } from '@navikt/ds-react';
import { useMutation } from '@tanstack/react-query';
import type { Person } from '../types/person';
import { queryClient } from '../queryClient';
import { BASE_URL, beskrivFeil } from '../helpers/utils';
import { useVarsel } from '../hooks/useVarsel';

interface Props {
	person: Person;
	onError: (errorMessage: string) => void;
	onClearErrors: () => void;
}

interface ModalProps {
	person: Person;
	open: boolean;
	onClose: () => void;
	onError: (errorMessage: string) => void;
	onClearErrors: () => void;
}

export const FjernPersonModal = ({
	person,
	open,
	onClose,
	onError,
	onClearErrors,
}: ModalProps) => {
	const [bekreftet, setBekreftet] = useState(false);
	const { visVarsel } = useVarsel();

	const lukkModal = () => {
		setBekreftet(false);
		onClose();
	};

	const fjernPersonMutation = useMutation({
		mutationFn: async () => {
			const response = await fetch(`${BASE_URL}/personer/${person.id}`, {
				method: 'DELETE',
			});
			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				throw new Error(
					errorData?.message ||
						beskrivFeil(response.status, 'Kunne ikke fjerne person'),
				);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['personer'] });
			onClearErrors();
			lukkModal();
			visVarsel(`${person.navn} er fjernet fra Hotkurs`, 'info');
		},
		onError: (error) => {
			onError(error.message);
		},
	});

	return (
		<Modal
			open={open}
			onClose={lukkModal}
			header={{
				heading: 'Slett person fra Hotkurs?',
				size: 'medium',
				closeButton: false,
			}}
			width="small"
		>
			<Modal.Body>
				<BodyLong spacing>{person.navn} slettes fra Hotkurs.</BodyLong>
				<BodyLong spacing>
					Bruk dette når personen ikke lenger jobber med hjelpemiddelformidling.
					Handlingen kan ikke angres.
				</BodyLong>
				<Checkbox
					checked={bekreftet}
					onChange={(event) => setBekreftet(event.target.checked)}
				>
					Jeg bekrefter at personen skal fjernes fra Hotkurs
				</Checkbox>
			</Modal.Body>
			<Modal.Footer>
				<Button
					type="button"
					variant="danger"
					disabled={!bekreftet}
					onClick={() => fjernPersonMutation.mutate()}
					loading={fjernPersonMutation.isPending}
				>
					Fjern person
				</Button>
				<Button type="button" variant="secondary-neutral" onClick={lukkModal}>
					Avbryt
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

const FjernPerson = ({ person, onError, onClearErrors }: Props) => {
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<>
			<FjernPersonModal
				person={person}
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				onError={onError}
				onClearErrors={onClearErrors}
			/>
			<Button
				variant="danger"
				size="small"
				icon={<PersonCrossIcon aria-hidden />}
				onClick={() => setModalOpen(true)}
			>
				Slett person fra Hotkurs
			</Button>
		</>
	);
};

export default FjernPerson;
