import { useState } from 'react';
import { Button, Pagination, Table, Tag, VStack } from '@navikt/ds-react';
import { fodselsnummerTilDato, formaterNorskDato } from '../helpers/utils';

const Tabell = () => {
	const [page, setPage] = useState(1);
	const [tableData, setTableData] = useState(data);
	const rowsPerPage = 8;

	let sortData = tableData;
	sortData = sortData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

	const godkjennKurs = (fnr: string) => {
		setTableData(
			tableData.map((row) =>
				row.fnr === fnr ? { ...row, del2Dato: new Date().toISOString() } : row
			)
		);
	};

	const fjernGodkjenning = (fnr: string) => {
		setTableData(
			tableData.map((row) =>
				row.fnr === fnr ? { ...row, del2Dato: null } : row
			)
		);
	};

	return (
		<VStack gap="space-16">
			<Table size="medium">
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell scope="col">Fødselsdato</Table.HeaderCell>
						<Table.HeaderCell scope="col">Navn</Table.HeaderCell>
						<Table.HeaderCell scope="col">E-post</Table.HeaderCell>
						<Table.HeaderCell scope="col">Arbeidssted</Table.HeaderCell>
						<Table.HeaderCell scope="col">Dato tatt del 1</Table.HeaderCell>
						<Table.HeaderCell scope="col">Dato tatt del 2</Table.HeaderCell>
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
										{del2Dato ? (
											<Tag variant="success">Fullført</Tag>
										) : (
											<Tag variant="neutral">Ikke fullført</Tag>
										)}
									</Table.DataCell>
									<Table.DataCell>
										{!del2Dato ? (
											<Button
												size="small"
												variant="primary-neutral"
												onClick={() => godkjennKurs(fnr)}
											>
												Godkjenn del 2
											</Button>
										) : (
											<Button
												size="small"
												variant="secondary-neutral"
												onClick={() => fjernGodkjenning(fnr)}
											>
												Fjern godkjenning
											</Button>
										)}
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
