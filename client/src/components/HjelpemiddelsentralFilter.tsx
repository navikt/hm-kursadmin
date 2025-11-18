import { Select } from '@navikt/ds-react';

interface Props {
	hjelpemiddelsentralVerdi: string;
	setHjelpemiddelsentralVerdi: (verdi: string) => void;
}

const HjelpemiddelsentralFilter = ({
	hjelpemiddelsentralVerdi,
	setHjelpemiddelsentralVerdi,
}: Props) => {
	return (
		<Select
			label="Velg hjelpemiddelsentral"
			value={hjelpemiddelsentralVerdi}
			onChange={(e) => setHjelpemiddelsentralVerdi(e.target.value)}
		>
			<option value="">- Velg hjelpemiddelsentral -</option>
			<option value="Oslo Hjelpemiddelsentral">Oslo Hjelpemiddelsentral</option>
			<option value="Bergen Hjelpemiddelsentral">
				Bergen Hjelpemiddelsentral
			</option>
			<option value="Trondheim Hjelpemiddelsentral">
				Trondheim Hjelpemiddelsentral
			</option>
			<option value="Drammen Hjelpemiddelsentral">
				Drammen Hjelpemiddelsentral
			</option>
		</Select>
	);
};

export default HjelpemiddelsentralFilter;
