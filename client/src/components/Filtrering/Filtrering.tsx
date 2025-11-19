import { HStack } from '@navikt/ds-react';
import Sok from './Sok';
import HjelpemiddelsentralFilter from './HjelpemiddelsentralFilter';
import type { Person } from '../../types/person';

interface Props {
	sokeverdi: string;
	setSokeverdi: (verdi: string) => void;
	hjelpemiddelsentralVerdi: string;
	setHjelpemiddelsentralVerdi: (verdi: string) => void;
	personer: Person[];
}

const Filtrering = ({
	sokeverdi,
	setSokeverdi,
	hjelpemiddelsentralVerdi,
	setHjelpemiddelsentralVerdi,
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
		</HStack>
	);
};

export default Filtrering;
