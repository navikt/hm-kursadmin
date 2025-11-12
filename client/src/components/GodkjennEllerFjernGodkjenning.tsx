import { useState } from 'react';
import { Button } from '@navikt/ds-react/Button';
import FjernGodkjenningModal from './FjernGodkjenningModal';

interface Props {
	fnr: string;
	navn: string;
	del2Dato: string | null;
	onUpdateDel2: (fnr: string, del2Dato: string | null) => void;
}

const GodkjennEllerFjernGodkjenning = ({
	fnr,
	navn,
	del2Dato,
	onUpdateDel2,
}: Props) => {
	const [modalOpen, setModalOpen] = useState(false);

	const godkjennKurs = () => {
		onUpdateDel2(fnr, new Date().toISOString());
	};

	const fjernGodkjenning = () => {
		onUpdateDel2(fnr, null);
		setModalOpen(false);
	};

	if (!del2Dato) {
		return (
			<Button size="small" variant="primary-neutral" onClick={godkjennKurs}>
				Godkjenn del 2
			</Button>
		);
	} else {
		return (
			<>
				<FjernGodkjenningModal
					person={navn}
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					onConfirm={fjernGodkjenning}
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
