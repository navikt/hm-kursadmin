import { useState } from 'react';
import { Pagination, Table, VStack } from '@navikt/ds-react';
import type { Person } from '../../types/person';
import { useMobile } from '../../helpers/useMobile';
import {
	useTabellSortering,
	type ScopedSortState,
} from '../../helpers/tabellUtils';
import { useTabellFiltrering } from '../../helpers/tabellFiltrering';
import MobilTabellRad from './MobilTabellRad';
import DesktopTabellRad from './DesktopTabellRad';

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

	const { handleSortering, sortData } = useTabellSortering();
	const { filtrerPersoner } = useTabellFiltrering();

	const filtrerteData = filtrerPersoner(
		personer,
		sokeverdi,
		hjelpemiddelsentralVerdi,
		statusDel2Verdi
	);

	const sorterteData = sortData(filtrerteData, sort);
	const paginertData = sorterteData.slice(
		(tabellside - 1) * raderPerSide,
		tabellside * raderPerSide
	);

	const handleSort = (kolonnenavn: ScopedSortState['orderBy']) => {
		setSort(handleSortering(sort, kolonnenavn));
	};

	return (
		<VStack gap="space-16">
			<Table
				size="medium"
				sort={sort}
				onSortChange={(sorteringsnøkkel) =>
					handleSort(sorteringsnøkkel as ScopedSortState['orderBy'])
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
					{paginertData.map((person) =>
						isMobile ? (
							<MobilTabellRad
								key={person.id}
								person={person}
								onError={onError}
								onClearErrors={onClearErrors}
								onLeggTilHandling={onLeggTilHandling}
							/>
						) : (
							<DesktopTabellRad
								key={person.id}
								person={person}
								onError={onError}
								onClearErrors={onClearErrors}
								onLeggTilHandling={onLeggTilHandling}
							/>
						)
					)}
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
