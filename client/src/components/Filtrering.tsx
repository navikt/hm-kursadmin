import { HStack } from '@navikt/ds-react';
import Sok from './Sok';

interface Props {
	sokeverdi: string;
	setSokeverdi: (verdi: string) => void;
}

const Filtrering = ({ sokeverdi, setSokeverdi }: Props) => {
	return (
		<HStack>
			<Sok sokeverdi={sokeverdi} setSokeverdi={setSokeverdi} />
		</HStack>
	);
};

export default Filtrering;
