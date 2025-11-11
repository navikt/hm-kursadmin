import { BodyLong, Button, Modal } from '@navikt/ds-react';

interface FjernGodkjenningModalProps {
	person: string;
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
					Er du sikker på at du vil fjerne godkjenningen av del 2 for {person}?
				</BodyLong>
			</Modal.Body>
			<Modal.Footer>
				<Button type="button" variant="danger" onClick={onConfirm}>
					Ja, jeg er sikker
				</Button>
				<Button type="button" variant="secondary" onClick={onClose}>
					Avbryt
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default FjernGodkjenningModal;
