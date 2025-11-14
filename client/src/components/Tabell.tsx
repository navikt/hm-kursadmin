import { useState } from 'react';
import { Pagination, Table, VStack, Loader, Alert } from '@navikt/ds-react';
import type { SortState } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import { fodselsnummerTilDato, formaterNorskDato } from '../helpers/utils';
import Del2Tag from './Del2Tag';
import GodkjennEllerFjernGodkjenning from './GodkjennEllerFjernGodkjenning';
import type { Person } from '../mocks/handlers/personer';
import { hentPersoner } from '../api/personer';

interface ScopedSortState extends SortState {
	orderBy: keyof Person;
}

interface Props {
	sokeverdi: string;
	kommuneVerdi: string;
}

const Tabell = ({ sokeverdi, kommuneVerdi }: Props) => {
	const [tabellside, setTabellside] = useState(1);
	const [tabellData, setTabellData] = useState<Person[]>([]);
	const [sort, setSort] = useState<ScopedSortState | undefined>();
	const raderPerSide = 8;

	const {
		data: personer = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ['personer'],
		queryFn: hentPersoner,
	});

	const oppdaterDel2Status = (fnr: string, del2Dato: string | null) => {
		setTabellData((forrigData) =>
			forrigData.map((person) =>
				person.fnr === fnr ? { ...person, del2Dato } : person
			)
		);
	};

	const aktuelleData = tabellData.length > 0 ? tabellData : personer;

	if (personer.length > 0 && tabellData.length === 0) {
		setTabellData(personer);
	}

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

	const filtrerteData = aktuelleData.filter((person) => {
		const matcherSok =
			!sokeverdi ||
			person.navn.toLowerCase().includes(sokeverdi.toLowerCase()) ||
			person.epost.toLowerCase().includes(sokeverdi.toLowerCase());

		const matcherKommune = !kommuneVerdi || person.arbeidssted === kommuneVerdi;

		return matcherSok && matcherKommune;
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

	if (isLoading) {
		return (
			<VStack gap="space-16" align="center">
				<Loader size="large" title="Laster personer..." />
			</VStack>
		);
	}

	if (error) {
		return (
			<Alert variant="error">
				Kunne ikke laste personer. Vennligst prøv igjen senere.
			</Alert>
		);
	}

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
						<Table.ColumnHeader scope="col" sortKey="del1Dato" sortable>
							Dato tatt del 1
						</Table.ColumnHeader>
						<Table.ColumnHeader scope="col" sortKey="del2Dato" sortable>
							Dato tatt del 2
						</Table.ColumnHeader>
						<Table.HeaderCell scope="col">Status del 2</Table.HeaderCell>
						<Table.HeaderCell scope="col">Handling</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{sortData.map(
						({ navn, fnr, epost, arbeidssted, del1Dato, del2Dato }, i) => {
							return (
								<Table.Row key={i + fnr}>
									<Table.DataCell>{fodselsnummerTilDato(fnr)}</Table.DataCell>
									<Table.HeaderCell scope="row">{navn}</Table.HeaderCell>
									<Table.DataCell>{epost}</Table.DataCell>
									<Table.DataCell>{arbeidssted}</Table.DataCell>
									<Table.DataCell>{formaterNorskDato(del1Dato)}</Table.DataCell>
									<Table.DataCell>
										{del2Dato ? formaterNorskDato(del2Dato) : '-'}
									</Table.DataCell>
									<Table.DataCell>
										<Del2Tag del2Dato={del2Dato} />
									</Table.DataCell>
									<Table.DataCell>
										<GodkjennEllerFjernGodkjenning
											fnr={fnr}
											navn={navn}
											del2Dato={del2Dato}
											onUpdateDel2={oppdaterDel2Status}
										/>
									</Table.DataCell>
								</Table.Row>
							);
						}
					)}
				</Table.Body>
			</Table>
			<Pagination
				page={tabellside}
				onPageChange={setTabellside}
				count={Math.max(1, Math.ceil(filtrerteData.length / raderPerSide))}
				size="small"
			/>
		</VStack>
	);
};

export default Tabell;
