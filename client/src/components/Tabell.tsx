import { useState } from 'react';
import { Pagination, Table, VStack } from '@navikt/ds-react';
import type { SortState } from '@navikt/ds-react';
import { formaterNorskDato } from '../helpers/utils';
import Del2Tag from './Del2Tag';
import GodkjennEllerFjernGodkjenning from './GodkjennEllerFjernGodkjenning';
import type { Person } from '../types/person';
import Epost from './Epost';
import { useMobile } from '../helpers/useMobile';

interface ScopedSortState extends SortState {
	orderBy: keyof Person;
}

interface Props {
	sokeverdi: string;
	hjelpemiddelsentralVerdi: string;
	statusDel2Verdi: string;
	personer: Person[];
	isPending?: boolean;
	onError: (errorMessage: string) => void;
	onClearErrors: () => void;
	onLeggTilHandling: (data: {
		type: 'GODKJENT_DEL2' | 'FJERNET_GODKJENNING';
		personNavn: string;
		kursDato: string;
	}) => void;
}

const Tabell = ({
	sokeverdi,
	hjelpemiddelsentralVerdi,
	statusDel2Verdi,
	personer,
	isPending,
	onError,
	onClearErrors,
	onLeggTilHandling,
}: Props) => {
	const [tabellside, setTabellside] = useState(1);
	const [sort, setSort] = useState<ScopedSortState | undefined>();
	const isMobile = useMobile();
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
			person.hjelpemiddelsentral === hjelpemiddelsentralVerdi;

		const matcherStatusDel2 =
			!statusDel2Verdi ||
			(statusDel2Verdi === 'fullført' && person.del2Dato !== null) ||
			(statusDel2Verdi === 'ikke-fullført' && person.del2Dato === null);

		return matcherSok && matcherHjelpemiddelsentral && matcherStatusDel2;
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
						{isMobile && <Table.HeaderCell scope="col"></Table.HeaderCell>}
						<Table.ColumnHeader sortKey="navn" sortable>
							Navn
						</Table.ColumnHeader>
						{!isMobile && (
							<>
								<Table.HeaderCell scope="col">E-post</Table.HeaderCell>
								<Table.HeaderCell scope="col">Arbeidssted</Table.HeaderCell>
							</>
						)}
						<Table.HeaderCell scope="col">HMS</Table.HeaderCell>
						{!isMobile && (
							<>
								<Table.ColumnHeader scope="col" sortKey="del1Dato" sortable>
									Dato for del 1
								</Table.ColumnHeader>
								<Table.ColumnHeader scope="col" sortKey="del2Dato" sortable>
									Dato for del 2
								</Table.ColumnHeader>
							</>
						)}
						<Table.HeaderCell scope="col">Status del 2</Table.HeaderCell>
						{!isMobile && (
							<Table.HeaderCell
								scope="col"
								aria-label="Handlinger"
							></Table.HeaderCell>
						)}
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{isPending && (
						<Table.Row>
							<Table.DataCell colSpan={isMobile ? 4 : 9}>
								Laster personer...
							</Table.DataCell>
						</Table.Row>
					)}
					{sortData.map((person) => {
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
												<strong>Dato for del 1:</strong>{' '}
												{formaterNorskDato(del1Dato)}
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
