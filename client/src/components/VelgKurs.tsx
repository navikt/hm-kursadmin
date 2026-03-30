import { Heading, Select, VStack } from '@navikt/ds-react';
import type { Kurs } from '../types/kurs';
import { mockKursliste } from '../mocks/data/mockKurs';

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
					const selectedKurs = mockKursliste.find(
						(kurs) => kurs.id === Number(e.target.value),
					);
					if (selectedKurs) {
						setValgtkurs(selectedKurs);
					}
				}}
			>
				{mockKursliste.map((kurs) => (
					<option key={kurs.id} value={kurs.id}>
						{kurs.title}
					</option>
				))}
			</Select>
		</VStack>
	);
}

export default VelgKurs;
