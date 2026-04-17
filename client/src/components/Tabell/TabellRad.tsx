import { Table, VStack, HStack, BodyShort, Label } from '@navikt/ds-react';
import { formaterNorskDato } from '../../helpers/utils';
import Del2Tag from '../Del2Tag';
import GodkjennEllerFjernGodkjenning from '../GodkjennEllerFjernGodkjenning';
import { kanRedigere, type KursadminBruker } from '../../types/kursadminbruker';
import type { Person} from '../../types/person';
import Epost from '../Epost';

interface Props {
	isMobile: boolean;
	person: Person;
	onError: (errorMessage: string) => void;
	onClearErrors: () => void;
	erElektriskRullestol: boolean;
	bruker: KursadminBruker | undefined
}

const TabellRad = ({
	isMobile,
	person,
	onError,
	onClearErrors,
	erElektriskRullestol,
	bruker,
}: Props) => {
	const { id, navn, epost, arbeidssted, del1Dato, del2Dato } = person;
	// Mobil / små skjermer
	if (isMobile) {
		return (
			<Table.ExpandableRow
				key={id}
				content={
					<VStack gap="3" align="start">
						<HStack gap="2" align="center">
							<Label>E-post:</Label>
							<BodyShort>
								<Epost epost={epost} />
							</BodyShort>
						</HStack>
						<HStack gap="2" align="center">
							<Label>Arbeidssted:</Label>
							<BodyShort>{arbeidssted}</BodyShort>
						</HStack>
						<HStack gap="2" align="center">
							<Label>
								{erElektriskRullestol ? 'Dato for del 1:' : 'Dato gjennomført:'}
							</Label>
							<BodyShort>{formaterNorskDato(del1Dato)}</BodyShort>
						</HStack>
						{erElektriskRullestol && (
							<>
								<HStack gap="2" align="center">
									<Label>Dato for del 2:</Label>
									<BodyShort>
										{del2Dato ? formaterNorskDato(del2Dato) : '-'}
									</BodyShort>
								</HStack>
								{kanRedigere(bruker) && (
									<GodkjennEllerFjernGodkjenning
										person={person}
										del2Dato={del2Dato}
										onError={onError}
										onClearErrors={onClearErrors}
								/>)}  

								
							</>
						)}
					</VStack>
				}
			>
				<Table.HeaderCell scope="row">{navn}</Table.HeaderCell>
				{!erElektriskRullestol && (
					<Table.DataCell>{formaterNorskDato(del1Dato)}</Table.DataCell>
				)}
				{erElektriskRullestol && (
					<Table.DataCell>
						<Del2Tag del2Dato={del2Dato} />
					</Table.DataCell>
				)}
			</Table.ExpandableRow>
		);
	}

	// Godkjenningskurs uten del 2
	if (!erElektriskRullestol) {
		return (
			<Table.Row key={id}>
				<Table.HeaderCell scope="row">{navn}</Table.HeaderCell>
				<Table.DataCell>
					<Epost epost={epost} />
				</Table.DataCell>
				<Table.DataCell>{arbeidssted}</Table.DataCell>
				<Table.DataCell>{formaterNorskDato(del1Dato)}</Table.DataCell>
			</Table.Row>
		);
	}

	// Elektrisk rullestol (med del 2)
	return (
		<Table.Row key={id}>
			<Table.HeaderCell scope="row">{navn}</Table.HeaderCell>
			<Table.DataCell>
				<Epost epost={epost} />
			</Table.DataCell>
			<Table.DataCell>{arbeidssted}</Table.DataCell>
			<Table.DataCell>{formaterNorskDato(del1Dato)}</Table.DataCell>
			<Table.DataCell>
				{del2Dato ? formaterNorskDato(del2Dato) : '-'}
			</Table.DataCell>
			<Table.DataCell>
				<Del2Tag del2Dato={del2Dato} />
			</Table.DataCell>
			<Table.DataCell>
				<div className="flex-content-right">
					{kanRedigere(bruker) && (
						<GodkjennEllerFjernGodkjenning
							person={person}
							del2Dato={del2Dato}
							onError={onError}
							onClearErrors={onClearErrors}
					/>)}  
				</div>
			</Table.DataCell>
		</Table.Row>
	);
};

export default TabellRad;
