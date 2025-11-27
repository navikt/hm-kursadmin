import { useState } from 'react';
import { Pagination, Table, VStack } from '@navikt/ds-react';
import type { Person } from '../../types/person';
import { useMobile } from '../../helpers/useMobile';
import {
	useTabellSortering,
	type ScopedSortState,
} from '../../helpers/tabellUtils';
import { useTabellFiltrering } from '../../helpers/tabellFiltrering';
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
				<TabellHeader isMobile={isMobile} />
				<Table.Body>
					{isPending && (
						<Table.Row>
							<Table.DataCell colSpan={isMobile ? 4 : 9}>
								Laster personer...
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
							onLeggTilHandling={onLeggTilHandling}
						/>
					))}
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
