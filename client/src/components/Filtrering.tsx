import { HStack } from '@navikt/ds-react';
import Sok from './Sok';
import HjelpemiddelsentralFilter from './HjelpemiddelsentralFilter';

interface Props {
	sokeverdi: string;
	setSokeverdi: (verdi: string) => void;
	hjelpemiddelsentralVerdi: string;
	setHjelpemiddelsentralVerdi: (verdi: string) => void;
}

const Filtrering = ({
	sokeverdi,
	setSokeverdi,
	hjelpemiddelsentralVerdi,
	setHjelpemiddelsentralVerdi,
}: Props) => {
	return (
		<HStack gap={'4'}>
			<Sok sokeverdi={sokeverdi} setSokeverdi={setSokeverdi} />
			<HjelpemiddelsentralFilter
				hjelpemiddelsentralVerdi={hjelpemiddelsentralVerdi}
				setHjelpemiddelsentralVerdi={setHjelpemiddelsentralVerdi}
			/>
		</HStack>
	);
};

export default Filtrering;
