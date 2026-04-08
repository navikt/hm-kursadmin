import { HStack, Button } from '@navikt/ds-react';
import { XMarkIcon } from '@navikt/aksel-icons';
import Sok from './Sok';
import HjelpemiddelsentralFilter from './HjelpemiddelsentralFilter';
import type { Person } from '../../types/person';
import type { Kurs } from '../../types/kurs';
import StatusDel2Filter from './StatusDel2Filter';
import { erErsKurs } from '../../helpers/utils';

interface Props {
	sokeverdi: string;
	setSokeverdi: (verdi: string) => void;
	hjelpemiddelsentralVerdi: string;
	setHjelpemiddelsentralVerdi: (verdi: string) => void;
	statusDel2Verdi: string;
	setStatusDel2Verdi: (verdi: string) => void;
	personer: Person[];
	valgtkurs: Kurs;
}

const Filtrering = ({
	sokeverdi,
	setSokeverdi,
	hjelpemiddelsentralVerdi,
	setHjelpemiddelsentralVerdi,
	statusDel2Verdi,
	setStatusDel2Verdi,
	personer,
	valgtkurs,
}: Props) => {
	const erElektriskRullestol = erErsKurs(valgtkurs);

	const handleReset = () => {
		setSokeverdi('');
		setHjelpemiddelsentralVerdi('');
		setStatusDel2Verdi('');
	};

	const harAktiveFiltre =
		sokeverdi !== '' ||
		hjelpemiddelsentralVerdi !== '' ||
		statusDel2Verdi !== '';

	return (
		<HStack gap={'4'} align="end">
			<Sok sokeverdi={sokeverdi} setSokeverdi={setSokeverdi} />
			<HjelpemiddelsentralFilter
				hjelpemiddelsentralVerdi={hjelpemiddelsentralVerdi}
				setHjelpemiddelsentralVerdi={setHjelpemiddelsentralVerdi}
				personer={personer}
			/>
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
					Nullstill filtre
				</Button>
			)}
		</HStack>
	);
};

export default Filtrering;
