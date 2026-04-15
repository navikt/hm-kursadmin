import { useState, useEffect } from 'react';
import { Pagination, Table, VStack } from '@navikt/ds-react';
import type { Person } from '../../types/person';
import type { Kurs } from '../../types/kurs';
import { useMobile } from '../../helpers/useResponsive';
import { erErsKurs } from '../../helpers/utils';
import {
	tabellSortering,
	type ScopedSortState,
} from '../../helpers/tabellUtils';
import { tabellFiltrering } from '../../helpers/tabellFiltrering';
import TabellHeader from './TabellHeader';
import TabellRad from './TabellRad';
import type { KursadminBruker } from '../../types/kursadminbruker';

interface Props {
	sokeverdi: string;
	statusDel2Verdi: string;
	personer: Person[];
	isPending?: boolean;
	onError: (errorMessage: string) => void;
	onClearErrors: () => void;
	valgtkurs: Kurs;
	bruker: KursadminBruker
}

const RADER_PER_SIDE = 10;
const ANTALL_KOLONNER_STANDARD = 5;
const ANTALL_KOLONNER_ERS = 7;
const ANTALL_KOLONNER_MOBIL = 4;

const Tabell = ({
	sokeverdi,
	statusDel2Verdi,
	personer,
	isPending,
	onError,
	onClearErrors,
	valgtkurs,
	bruker,
}: Props) => {
	const [tabellside, setTabellside] = useState(1);
	const [sort, setSort] = useState<ScopedSortState | undefined>();
	const isMobile = useMobile();

	const { handleSortering, sortData } = tabellSortering();
	const { filtrerPersoner } = tabellFiltrering();

	const erElektriskRullestol = erErsKurs(valgtkurs);

	const filtrerteData = filtrerPersoner(personer, sokeverdi, statusDel2Verdi);

	const sorterteData = sortData(filtrerteData, sort);
	const paginertData = sorterteData.slice(
		(tabellside - 1) * RADER_PER_SIDE,
		tabellside * RADER_PER_SIDE,
	);

	const handleSort = (kolonnenavn: ScopedSortState['orderBy']) => {
		setSort(handleSortering(sort, kolonnenavn));
	};

	useEffect(() => {
		setTabellside(1);
	}, [sokeverdi, statusDel2Verdi, valgtkurs]);

	return (
		<VStack gap="space-16">
			<Table
				size="small"
				zebraStripes
				sort={sort}
				onSortChange={(sorteringsnøkkel) =>
					handleSort(sorteringsnøkkel as ScopedSortState['orderBy'])
				}
			>
				<TabellHeader
					isMobile={isMobile}
					erElektriskRullestol={erElektriskRullestol}
				/>
				<Table.Body>
					{isPending && (
						<Table.Row>
							<Table.DataCell
								colSpan={
									isMobile
										? ANTALL_KOLONNER_MOBIL
										: erElektriskRullestol
											? ANTALL_KOLONNER_ERS
											: ANTALL_KOLONNER_STANDARD
								}
							>
								Laster personer...
							</Table.DataCell>
						</Table.Row>
					)}
					{!isPending && filtrerteData.length === 0 && (
						<Table.Row>
							<Table.DataCell
								colSpan={
									isMobile
										? ANTALL_KOLONNER_MOBIL
										: erElektriskRullestol
											? ANTALL_KOLONNER_ERS
											: ANTALL_KOLONNER_STANDARD
								}
							>
								Ingen personer funnet
							</Table.DataCell>
						</Table.Row>
					)}
					{paginertData.map((person) => (
						<TabellRad
							key={person.id}
							isMobile={isMobile}
							person={person}
							onError={onError}
							onClearErrors={onClearErrors}
							erElektriskRullestol={erElektriskRullestol}
							bruker={bruker}
						/>
					))}
				</Table.Body>
			</Table>
			{filtrerteData.length > 0 && (
				<Pagination
					page={tabellside}
					onPageChange={setTabellside}
					count={Math.max(Math.ceil(filtrerteData.length / RADER_PER_SIDE), 1)}
					size="small"
				/>
			)}
		</VStack>
	);
};

export default Tabell;
