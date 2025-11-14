import { HStack } from '@navikt/ds-react';
import Sok from './Sok';
import KommuneFiltrering from './KommuneFiltrering';

interface Props {
	sokeverdi: string;
	setSokeverdi: (verdi: string) => void;
	kommuneVerdi: string;
	setKommuneVerdi: (verdi: string) => void;
}

const Filtrering = ({
	sokeverdi,
	setSokeverdi,
	kommuneVerdi,
	setKommuneVerdi,
}: Props) => {
	return (
		<HStack gap={'4'}>
			<Sok sokeverdi={sokeverdi} setSokeverdi={setSokeverdi} />
			<KommuneFiltrering
				kommuneVerdi={kommuneVerdi}
				setKommuneVerdi={setKommuneVerdi}
			/>
		</HStack>
	);
};

export default Filtrering;
