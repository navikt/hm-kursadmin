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

interface Props {
	sokeverdi: string;
	hjelpemiddelsentralVerdi: string;
	statusDel2Verdi: string;
	personer: Person[];
	isPending?: boolean;
	onError: (errorMessage: string) => void;
	onClearErrors: () => void;
	valgtkurs: Kurs;
}

const Tabell = ({
	sokeverdi,
	hjelpemiddelsentralVerdi,
	statusDel2Verdi,
	personer,
	isPending,
	onError,
	onClearErrors,
	valgtkurs,
}: Props) => {
	const [tabellside, setTabellside] = useState(1);
	const [sort, setSort] = useState<ScopedSortState | undefined>();
	const isMobile = useMobile();
	const raderPerSide = 8;

	const { handleSortering, sortData } = tabellSortering();
	const { filtrerPersoner } = tabellFiltrering();

	const erElektriskRullestol = erErsKurs(valgtkurs);

	const filtrerteData = filtrerPersoner(
		personer,
		sokeverdi,
		hjelpemiddelsentralVerdi,
		statusDel2Verdi,
	);

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
	}, [sokeverdi, hjelpemiddelsentralVerdi, statusDel2Verdi, valgtkurs]);

	return (
		<VStack gap="space-16">
			<Table
				size="medium"
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
								colSpan={isMobile ? 4 : erElektriskRullestol ? 8 : 5}
							>
								Laster personer...
							</Table.DataCell>
						</Table.Row>
					)}
					{!isPending && filtrerteData.length === 0 && (
						<Table.Row>
							<Table.DataCell
								colSpan={isMobile ? 4 : erElektriskRullestol ? 8 : 5}
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
						/>
					))}
				</Table.Body>
			</Table>
			{filtrerteData.length > 0 && (
				<Pagination
					page={tabellside}
					onPageChange={setTabellside}
					count={Math.max(Math.ceil(filtrerteData.length / raderPerSide), 1)}
					size="small"
				/>
			)}
		</VStack>
	);
};

export default Tabell;
