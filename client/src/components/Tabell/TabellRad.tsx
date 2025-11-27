import { Table } from '@navikt/ds-react';
import { formaterNorskDato } from '../../helpers/utils';
import Del2Tag from '../Del2Tag';
import GodkjennEllerFjernGodkjenning from '../GodkjennEllerFjernGodkjenning';
import type { Person } from '../../types/person';
import Epost from '../Epost';

interface Props {
	isMobile: boolean;
	person: Person;
	onError: (errorMessage: string) => void;
	onClearErrors: () => void;
	onLeggTilHandling: (data: {
		type: 'GODKJENT_DEL2' | 'FJERNET_GODKJENNING';
		personNavn: string;
		kursDato: string;
	}) => void;
}

const TabellRad = ({
	isMobile,
	person,
	onError,
	onClearErrors,
	onLeggTilHandling,
}: Props) => {
	const { id, navn, epost, arbeidssted, del1Dato, del2Dato } = person;

	if (isMobile) {
		return (
			<Table.ExpandableRow
				key={id}
				content={
					<div style={{ padding: '1rem 0' }}>
						<div style={{ marginBottom: '0.5rem' }}>
							<strong>E-post:</strong> <Epost epost={epost} />
						</div>
						<div style={{ marginBottom: '0.5rem' }}>
							<strong>Arbeidssted:</strong> {arbeidssted}
						</div>
						<div style={{ marginBottom: '0.5rem' }}>
							<strong>Dato for del 1:</strong> {formaterNorskDato(del1Dato)}
						</div>
						<div style={{ marginBottom: '0.5rem' }}>
							<strong>Dato for del 2:</strong>{' '}
							{del2Dato ? formaterNorskDato(del2Dato) : '-'}
						</div>
						<div>
							<GodkjennEllerFjernGodkjenning
								person={person}
								del2Dato={del2Dato}
								onError={onError}
								onClearErrors={onClearErrors}
								onLeggTilHandling={onLeggTilHandling}
							/>
						</div>
					</div>
				}
			>
				<Table.HeaderCell scope="row">{navn}</Table.HeaderCell>
				<Table.DataCell>{person.hjelpemiddelsentral}</Table.DataCell>
				<Table.DataCell>
					<Del2Tag del2Dato={del2Dato} />
				</Table.DataCell>
			</Table.ExpandableRow>
		);
	}

	return (
		<Table.Row key={id}>
			<Table.HeaderCell scope="row">{navn}</Table.HeaderCell>
			<Table.DataCell>
				<Epost epost={epost} />
			</Table.DataCell>
			<Table.DataCell>{arbeidssted}</Table.DataCell>
			<Table.DataCell>{person.hjelpemiddelsentral}</Table.DataCell>
			<Table.DataCell>{formaterNorskDato(del1Dato)}</Table.DataCell>
			<Table.DataCell>
				{del2Dato ? formaterNorskDato(del2Dato) : '-'}
			</Table.DataCell>
			<Table.DataCell>
				<Del2Tag del2Dato={del2Dato} />
			</Table.DataCell>
			<Table.DataCell>
				<div className="flex-content-right">
					<GodkjennEllerFjernGodkjenning
						person={person}
						del2Dato={del2Dato}
						onError={onError}
						onClearErrors={onClearErrors}
						onLeggTilHandling={onLeggTilHandling}
					/>
				</div>
			</Table.DataCell>
		</Table.Row>
	);
};

export default TabellRad;
