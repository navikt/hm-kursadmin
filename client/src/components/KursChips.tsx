import { Chips } from '@navikt/ds-react';
import { kursliste, type Kurs } from '../types/kurs';

interface Props {
	valgtkurs: Kurs;
	setValgtkurs: (kurs: Kurs) => void;
}

function KursChips({ valgtkurs, setValgtkurs }: Props) {
	return (
		<Chips>
			{kursliste.map((kurs) => (
				<Chips.Toggle
					key={kurs.id}
					selected={valgtkurs.id === kurs.id}
					onClick={() => setValgtkurs(kurs)}
				>
					{kurs.title}
				</Chips.Toggle>
			))}
		</Chips>
	);
}

export default KursChips;
