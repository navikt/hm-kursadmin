import { useState, useEffect } from 'react';
import { HStack, Pagination, Select, Table, VStack } from '@navikt/ds-react';
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
import { kanRedigere, type KursadminBruker } from '../../types/kursadminbruker';

interface Props {
	sokeverdi: string;
	statusDel2Verdi: string;
	personer: Person[];
	isPending?: boolean;
	onError: (errorMessage: string) => void;
	onClearErrors: () => void;
	valgtkurs: Kurs;
	bruker: KursadminBruker | undefined;
}

const RADER_PER_SIDE_KEY = 'raderPerSide';
const STANDARD_RADER_PER_SIDE = 15;

const ANTALL_KOLONNER_STANDARD = 4;
const ANTALL_KOLONNER_STANDARD_MED_HANDLINGER = 5;
const ANTALL_KOLONNER_ERS = 6;
const ANTALL_KOLONNER_ERS_MED_HANDLINGER = 7;
const ANTALL_KOLONNER_MOBIL = 3;

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
	const [raderPerSide, setRaderPerSide] = useState(() => {
		const lagretVerdi = localStorage.getItem(RADER_PER_SIDE_KEY);
		return lagretVerdi ? Number(lagretVerdi) : STANDARD_RADER_PER_SIDE;
	});
	const [sort, setSort] = useState<ScopedSortState | undefined>();
	const isMobile = useMobile();

	const { handleSortering, sortData } = tabellSortering();
	const { filtrerPersoner } = tabellFiltrering();

	const erElektriskRullestol = erErsKurs(valgtkurs);
	const visHandlingskolonne = erElektriskRullestol && kanRedigere(bruker);

	const getAntallKolonner = () => {
		if (isMobile) return ANTALL_KOLONNER_MOBIL;
		if (!erElektriskRullestol) {
			return kanRedigere(bruker)
				? ANTALL_KOLONNER_STANDARD_MED_HANDLINGER
				: ANTALL_KOLONNER_STANDARD;
		}
		return visHandlingskolonne
			? ANTALL_KOLONNER_ERS_MED_HANDLINGER
			: ANTALL_KOLONNER_ERS;
	};

	const filtrerteData = filtrerPersoner(personer, sokeverdi, statusDel2Verdi);

	const sorterteData = sortData(filtrerteData, sort);
	const paginertData = sorterteData.slice(
		(tabellside - 1) * raderPerSide,
		tabellside * raderPerSide,
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
				<caption className="sr-only">
					{`Personer som har fullført ${valgtkurs.title}`}
				</caption>
				<TabellHeader
					isMobile={isMobile}
					erElektriskRullestol={erElektriskRullestol}
					bruker={bruker}
				/>
				<Table.Body>
					{isPending && (
						<Table.Row>
							<Table.DataCell colSpan={getAntallKolonner()}>
								<output>Laster personer...</output>
							</Table.DataCell>
						</Table.Row>
					)}
					{!isPending && filtrerteData.length === 0 && (
						<Table.Row>
							<Table.DataCell colSpan={getAntallKolonner()}>
								<output>Ingen personer funnet</output>
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
			<HStack justify="space-between" align="start">
				{filtrerteData.length > 0 && (
					<Pagination
						page={tabellside}
						onPageChange={setTabellside}
						count={Math.max(Math.ceil(filtrerteData.length / raderPerSide), 1)}
						size="small"
					/>
				)}
				<Select
					label="Rader per side"
					value={raderPerSide}
					size="small"
					onChange={(e) => {
						const raderPerSide = Number(e.target.value);
						setRaderPerSide(raderPerSide);
						localStorage.setItem(RADER_PER_SIDE_KEY, String(raderPerSide));
						setTabellside(1);
					}}
				>
					<option value={10}>10</option>
					<option value={15}>15</option>
					<option value={20}>20</option>
					<option value={25}>25</option>
					<option value={30}>30</option>
				</Select>
			</HStack>
		</VStack>
	);
};

export default Tabell;
