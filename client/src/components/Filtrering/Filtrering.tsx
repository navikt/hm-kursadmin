import { HStack, Button } from '@navikt/ds-react';
import { XMarkIcon } from '@navikt/aksel-icons';
import Sok from './Sok';
import type { Kurs } from '../../types/kurs';
import StatusDel2Filter from './StatusDel2Filter';
import { erErsKurs } from '../../helpers/utils';

interface Props {
	sokeverdi: string;
	setSokeverdi: (verdi: string) => void;
	statusDel2Verdi: string;
	setStatusDel2Verdi: (verdi: string) => void;
	valgtkurs: Kurs;
}

const Filtrering = ({
	sokeverdi,
	setSokeverdi,
	statusDel2Verdi,
	setStatusDel2Verdi,

	valgtkurs,
}: Props) => {
	const erElektriskRullestol = erErsKurs(valgtkurs);

	const handleReset = () => {
		setSokeverdi('');
		setStatusDel2Verdi('');
	};

	const harAktiveFiltre = sokeverdi !== '' || statusDel2Verdi !== '';

	return (
		<HStack gap={'4'} align="end">
			<Sok sokeverdi={sokeverdi} setSokeverdi={setSokeverdi} />
			{erElektriskRullestol && (
				<StatusDel2Filter
					statusDel2Verdi={statusDel2Verdi}
					setStatusDel2Verdi={setStatusDel2Verdi}
				/>
			)}
			{harAktiveFiltre && (
				<Button
					variant="tertiary"
					size="small"
					icon={<XMarkIcon aria-hidden />}
					onClick={handleReset}
				>
					Nullstill filter
				</Button>
			)}
		</HStack>
	);
};

export default Filtrering;
