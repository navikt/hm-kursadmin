import { HStack } from '@navikt/ds-react';
import Sok from './Sok';
import HjelpemiddelsentralFilter from './HjelpemiddelsentralFilter';
import type { Person } from '../../types/person';
import StatusDel2Filter from './StatusDel2Filter';

interface Props {
	sokeverdi: string;
	setSokeverdi: (verdi: string) => void;
	hjelpemiddelsentralVerdi: string;
	setHjelpemiddelsentralVerdi: (verdi: string) => void;
	statusDel2Verdi: string;
	setStatusDel2Verdi: (verdi: string) => void;
	personer: Person[];
}

const Filtrering = ({
	sokeverdi,
	setSokeverdi,
	hjelpemiddelsentralVerdi,
	setHjelpemiddelsentralVerdi,
	statusDel2Verdi,
	setStatusDel2Verdi,
	personer,
}: Props) => {
	return (
		<HStack gap={'4'}>
			<Sok sokeverdi={sokeverdi} setSokeverdi={setSokeverdi} />
			<HjelpemiddelsentralFilter
				hjelpemiddelsentralVerdi={hjelpemiddelsentralVerdi}
				setHjelpemiddelsentralVerdi={setHjelpemiddelsentralVerdi}
				personer={personer}
			/>
			<StatusDel2Filter
				statusDel2Verdi={statusDel2Verdi}
				setStatusDel2Verdi={setStatusDel2Verdi}
			/>
		</HStack>
	);
};

export default Filtrering;
