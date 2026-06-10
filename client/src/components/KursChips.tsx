import { Chips } from '@navikt/ds-react';
import { kursliste, type Kurs } from '../types/kurs';

interface Props {
	valgtkurs: Kurs;
	setValgtkurs: (kurs: Kurs) => void;
}

function KursChips({ valgtkurs, setValgtkurs }: Readonly<Props>) {
	return (
		<>
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
			<div role="status" aria-live="polite" className="sr-only">
				{valgtkurs.title} er valgt
			</div>
		</>
	);
}

export default KursChips;
