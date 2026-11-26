import { useState } from 'react';
import { Button } from '@navikt/ds-react';
import FjernGodkjenningModal from './FjernGodkjenningModal';
import GodkjennDel2Modal from './GodkjennDel2Modal';
import type { Person } from '../types/person';
import { useMobile } from '../helpers/useResponsive';

interface Props {
	person: Person;
	del2Dato: string | null;
	onError: (errorMessage: string) => void;
	onClearErrors: () => void;
}

const GodkjennEllerFjernGodkjenning = ({
	person,
	del2Dato,
	onError,
	onClearErrors,
}: Props) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [godkjennModalOpen, setGodkjennModalOpen] = useState(false);
	const isMobile = useMobile();

	if (del2Dato) {
		return (
			<>
				<FjernGodkjenningModal
					person={person}
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					onConfirm={() => setModalOpen(false)}
					onError={onError}
					onClearErrors={onClearErrors}
				/>
				{isMobile && (
					<Button
						variant="secondary-neutral"
						size="small"
						onClick={() => setModalOpen(true)}
					>
						Fjern godkjenning
					</Button>
				)}
			</>
		);
	}

	return (
		<>
			{godkjennModalOpen && (
				<GodkjennDel2Modal
					person={person}
					onClose={() => setGodkjennModalOpen(false)}
					onClearErrors={onClearErrors}
				/>
			)}
			<Button
				size="small"
				variant="primary-neutral"
				onClick={() => {
					onClearErrors();
					setGodkjennModalOpen(true);
				}}
			>
				Godkjenn del 2
			</Button>
		</>
	);
};
export default GodkjennEllerFjernGodkjenning;
