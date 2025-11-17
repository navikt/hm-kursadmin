import { Select } from '@navikt/ds-react';

interface Props {
	kommuneVerdi: string;
	setKommuneVerdi: (verdi: string) => void;
}

const KommuneFiltrering = ({ kommuneVerdi, setKommuneVerdi }: Props) => {
	return (
		<Select
			label="Velg arbeidssted"
			value={kommuneVerdi}
			onChange={(e) => setKommuneVerdi(e.target.value)}
		>
			<option value="">- Velg arbeidssted -</option>
			<option value="Oslo kommune">Oslo kommune</option>
			<option value="Bergen kommune">Bergen kommune</option>
			<option value="Trondheim kommune">Trondheim kommune</option>
			<option value="Drammen kommune">Drammen kommune</option>
		</Select>
	);
};

export default KommuneFiltrering;
