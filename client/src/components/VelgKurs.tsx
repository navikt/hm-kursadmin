import { Heading, Select, VStack } from '@navikt/ds-react';
import { finnKurs, kursliste, type Kurs } from '../types/kurs';

interface Props {
	valgtkurs: Kurs;
	setValgtkurs: (kurs: Kurs) => void;
}

function VelgKurs({ valgtkurs, setValgtkurs }: Props) {
	return (
		<VStack gap="space-12" align="start">
			<Heading size="large" level="1">
				Godkjenningskurs: {valgtkurs.title}
			</Heading>
			<Select
				label="Velg godkjenningskurs"
				value={valgtkurs.id}
				onChange={(e) => {
					const selectedKurs = finnKurs(Number(e.target.value));
					if (selectedKurs) {
						setValgtkurs(selectedKurs);
					}
				}}
			>
				{kursliste.map((kurs) => (
					<option key={kurs.id} value={kurs.id}>
						{kurs.title}
					</option>
				))}
			</Select>
		</VStack>
	);
}

export default VelgKurs;
