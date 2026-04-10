import { Chips } from '@navikt/ds-react';
import { kursliste, type Kurs } from '../types/kurs';

interface Props {
	valgtkurs: Kurs;
	setValgtkurs: (kurs: Kurs) => void;
}

function KursChips({ valgtkurs, setValgtkurs }: Props) {
	return (
		<>
			<fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
				<legend className="sr-only">Velg godkjenningskurs</legend>
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
			</fieldset>
			<div role="status" aria-live="polite" className="sr-only">
				{valgtkurs.title}
			</div>
		</>
	);
}

export default KursChips;
