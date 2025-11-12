import { useState } from 'react';
import { Pagination, Table, VStack } from '@navikt/ds-react';
import type { SortState } from '@navikt/ds-react';
import { fodselsnummerTilDato, formaterNorskDato } from '../helpers/utils';
import Del2Tag from './Del2Tag';
import GodkjennEllerFjernGodkjenning from './GodkjennEllerFjernGodkjenning';

interface ScopedSortState extends SortState {
	orderBy: keyof (typeof data)[0];
}

const Tabell = () => {
	const [page, setPage] = useState(1);
	const [tableData, setTableData] = useState(data);
	const [sort, setSort] = useState<ScopedSortState | undefined>();
	const rowsPerPage = 8;

	const oppdaterDel2Status = (fnr: string, del2Dato: string | null) => {
		setTableData((forrigData) =>
			forrigData.map((person) =>
				person.fnr === fnr ? { ...person, del2Dato } : person
			)
		);
	};

	const handleSort = (sortKey: ScopedSortState['orderBy']) => {
		setSort(
			sort && sortKey === sort.orderBy && sort.direction === 'descending'
				? undefined
				: {
						orderBy: sortKey,
						direction:
							sort && sortKey === sort.orderBy && sort.direction === 'ascending'
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

	let sortData = tableData.slice().sort((a, b) => {
		if (sort) {
			return sort.direction === 'ascending'
				? comparator(b, a, sort.orderBy)
				: comparator(a, b, sort.orderBy);
		}
		return 0;
	});
	sortData = sortData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

	return (
		<VStack gap="space-16">
			<Table
				size="medium"
				sort={sort}
				onSortChange={(sortKey) =>
					handleSort(sortKey as ScopedSortState['orderBy'])
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
				page={page}
				onPageChange={setPage}
				count={Math.ceil(tableData.length / rowsPerPage)}
				size="small"
			/>
		</VStack>
	);
};

const data = [
	{
		navn: 'Jakobsen, Markus',
		fnr: '03099265463',
		epost: 'markus.jakobsen@oslo.kommune.no',
		arbeidssted: 'Oslo kommune',
		del1Dato: '2021-04-28T19:12:14.358Z',
		del2Dato: '2021-06-15T10:30:00.000Z',
	},
	{
		navn: 'Halvorsen, Mari',
		fnr: '16099334134',
		epost: 'mari.halvorsen@bergen.kommune.no',
		arbeidssted: 'Bergen kommune',
		del1Dato: '2022-01-29T09:51:19.833Z',
		del2Dato: null,
	},
	{
		navn: 'Christiansen, Mathias',
		fnr: '18099441438',
		epost: 'mathias.christiansen@trondheim.kommune.no',
		arbeidssted: 'Trondheim kommune',
		del1Dato: '2021-06-04T20:57:29.159Z',
		del2Dato: '2021-08-22T14:00:00.000Z',
	},
	{
		navn: 'Fredriksen, Leah',
		fnr: '24099080180',
		epost: 'leah.fredriksen@stavanger.kommune.no',
		arbeidssted: 'Stavanger kommune',
		del1Dato: '2021-08-31T15:47:36.293Z',
		del2Dato: null,
	},
	{
		navn: 'Evensen, Jonas',
		fnr: '18099648460',
		epost: 'jonas.evensen@drammen.kommune.no',
		arbeidssted: 'Drammen kommune',
		del1Dato: '2021-07-17T11:13:26.116Z',
		del2Dato: '2021-09-10T13:15:00.000Z',
	},
	{
		navn: 'Strand, Thomas',
		fnr: '11099393157',
		epost: 'thomas.strand@kristiansand.kommune.no',
		arbeidssted: 'Kristiansand kommune',
		del1Dato: '2021-08-14T14:15:44.597Z',
		del2Dato: '2021-10-05T11:00:00.000Z',
	},
	{
		navn: 'Eriksen, Sofie',
		fnr: '07099778435',
		epost: 'sofie.eriksen@fredrikstad.kommune.no',
		arbeidssted: 'Fredrikstad kommune',
		del1Dato: '2021-12-20T15:55:02.613Z',
		del2Dato: null,
	},
	{
		navn: 'Jørgensen, Erik',
		fnr: '02099681196',
		epost: 'erik.jorgensen@sandnes.kommune.no',
		arbeidssted: 'Sandnes kommune',
		del1Dato: '2021-09-05T11:33:19.361Z',
		del2Dato: '2021-11-20T09:30:00.000Z',
	},
	{
		navn: 'Carlsen, Sondre',
		fnr: '23099649197',
		epost: 'sondre.carlsen@tromso.kommune.no',
		arbeidssted: 'Tromsø kommune',
		del1Dato: '2022-01-25T16:10:47.223Z',
		del2Dato: null,
	},
	{
		navn: 'Berge, Martine',
		fnr: '11099093151',
		epost: 'martine.berge@asker.kommune.no',
		arbeidssted: 'Asker kommune',
		del1Dato: '2022-01-09T11:15:50.833Z',
		del2Dato: '2022-03-15T10:00:00.000Z',
	},
];

export default Tabell;
