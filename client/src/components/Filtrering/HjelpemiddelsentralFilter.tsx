import { Select } from '@navikt/ds-react';
import type { Person } from '../../types/person';

interface Props {
	hjelpemiddelsentralVerdi: string;
	setHjelpemiddelsentralVerdi: (verdi: string) => void;
	personer: Person[];
}

const HjelpemiddelsentralFilter = ({
	hjelpemiddelsentralVerdi,
	setHjelpemiddelsentralVerdi,
	personer,
}: Props) => {
	const unikeHjelpemiddelsentraler = Array.from(
		new Set(personer.map((person) => person.hjelpemiddelsentral))
	).sort();

	return (
		<Select
			label="Velg hjelpemiddelsentral"
			value={hjelpemiddelsentralVerdi}
			onChange={(e) => setHjelpemiddelsentralVerdi(e.target.value)}
			autoComplete="off"
		>
			<option value="">- Velg hjelpemiddelsentral -</option>
			{unikeHjelpemiddelsentraler.map((hjelpemiddelsentral) => (
				<option key={hjelpemiddelsentral} value={hjelpemiddelsentral}>
					{hjelpemiddelsentral}
				</option>
			))}
		</Select>
	);
};

export default HjelpemiddelsentralFilter;
