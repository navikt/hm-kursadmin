import { Heading, Select, VStack } from '@navikt/ds-react';
import type { Kurs } from '../types/kurs';
import { mockKursliste } from '../mocks/data/mockKurs';

interface Props {
	valgtkurs: Kurs | null;
	setValgtkurs: (kurs: Kurs | null) => void;
}

function VelgKurs({ valgtkurs, setValgtkurs }: Props) {
	return (
		<VStack gap="space-12" align="start">
			<Select
				label="Velg godkjenningskurs"
				value={valgtkurs?.id ?? ''}
				onChange={(e) => {
					const selectedKurs = mockKursliste.find(
						(kurs) => kurs.id === Number(e.target.value),
					);
					setValgtkurs(selectedKurs || null);
				}}
			>
				{mockKursliste.map((kurs) => (
					<option key={kurs.id} value={kurs.id}>
						{kurs.title}
					</option>
				))}
			</Select>
			<Heading size="large" level="1">
				Godkjenningskurs: {valgtkurs ? valgtkurs.title : ''}
			</Heading>
		</VStack>
	);
}

export default VelgKurs;
