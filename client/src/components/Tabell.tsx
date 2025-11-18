import { useState } from 'react';
import { Pagination, Table, VStack } from '@navikt/ds-react';
import type { SortState } from '@navikt/ds-react';
import { formaterNorskDato } from '../helpers/utils';
import Del2Tag from './Del2Tag';
import GodkjennEllerFjernGodkjenning from './GodkjennEllerFjernGodkjenning';
import type { Person } from '../types/person';

interface ScopedSortState extends SortState {
	orderBy: keyof Person;
}

interface Props {
	sokeverdi: string;
	hjelpemiddelsentralVerdi: string;
	personer: Person[];
}

const Tabell = ({ sokeverdi, hjelpemiddelsentralVerdi, personer }: Props) => {
	const [tabellside, setTabellside] = useState(1);
	const [sort, setSort] = useState<ScopedSortState | undefined>();
	const raderPerSide = 8;

	const handleSortering = (kolonnenavn: ScopedSortState['orderBy']) => {
		setSort(
			sort && kolonnenavn === sort.orderBy && sort.direction === 'descending'
				? undefined
				: {
						orderBy: kolonnenavn,
						direction:
							sort &&
							kolonnenavn === sort.orderBy &&
							sort.direction === 'ascending'
								? 'descending'
								: 'ascending',
				  }
		);
	};

	function comparator<T>(a: T, b: T, orderBy: keyof T): number {
		if (b[orderBy] == null || b[orderBy] < a[orderBy]) {
			return -1;
		}
		if (b[orderBy] > a[orderBy]) {
			return 1;
		}
		return 0;
	}

	const filtrerteData = personer.filter((person) => {
		const matcherSok =
			!sokeverdi ||
			person.navn.toLowerCase().includes(sokeverdi.toLowerCase()) ||
			person.epost.toLowerCase().includes(sokeverdi.toLowerCase());

		const matcherHjelpemiddelsentral =
			!hjelpemiddelsentralVerdi ||
			person.hjelpemiddelsentral.toLowerCase() ===
				hjelpemiddelsentralVerdi.toLowerCase();

		return matcherSok && matcherHjelpemiddelsentral;
	});

	let sortData = filtrerteData.slice().sort((a, b) => {
		if (sort) {
			return sort.direction === 'ascending'
				? comparator(b, a, sort.orderBy)
				: comparator(a, b, sort.orderBy);
		}
		return 0;
	});
	sortData = sortData.slice(
		(tabellside - 1) * raderPerSide,
		tabellside * raderPerSide
	);

	return (
		<VStack gap="space-16">
			<Table
				size="medium"
				sort={sort}
				onSortChange={(sorteringsnøkkel) =>
					handleSortering(sorteringsnøkkel as ScopedSortState['orderBy'])
				}
			>
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader sortKey="fnr" sortable>
							Fødselsdato
						</Table.ColumnHeader>
						<Table.ColumnHeader sortKey="navn" sortable>
							Navn
						</Table.ColumnHeader>
						<Table.HeaderCell scope="col">E-post</Table.HeaderCell>
						<Table.HeaderCell scope="col">Arbeidssted</Table.HeaderCell>
						<Table.HeaderCell scope="col">Hjelpemiddelsentral</Table.HeaderCell>
						<Table.ColumnHeader scope="col" sortKey="del1Dato" sortable>
							Dato for del 1
						</Table.ColumnHeader>
						<Table.ColumnHeader scope="col" sortKey="del2Dato" sortable>
							Dato for del 2
						</Table.ColumnHeader>
						<Table.HeaderCell scope="col">Status del 2</Table.HeaderCell>
						<Table.HeaderCell scope="col">Handling</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{sortData.map((person) => {
						const {
							id,
							navn,
							fodselsdato,
							epost,
							arbeidssted,
							del1Dato,
							del2Dato,
						} = person;
						return (
							<Table.Row key={id}>
								<Table.DataCell>{fodselsdato}</Table.DataCell>
								<Table.HeaderCell scope="row">{navn}</Table.HeaderCell>
								<Table.DataCell>{epost}</Table.DataCell>
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
									<GodkjennEllerFjernGodkjenning
										person={person}
										navn={navn}
										del2Dato={del2Dato}
									/>
								</Table.DataCell>
							</Table.Row>
						);
					})}
				</Table.Body>
			</Table>
			<Pagination
				page={tabellside}
				onPageChange={setTabellside}
				count={Math.ceil(filtrerteData.length / raderPerSide)}
				size="small"
			/>
		</VStack>
	);
};

export default Tabell;
