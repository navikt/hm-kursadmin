import { Table } from '@navikt/ds-react';

interface Props {
	isMobile: boolean;
}

const TabellHeader = ({ isMobile }: Props) => {
	if (isMobile) {
		return (
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell scope="col"></Table.HeaderCell>
					<Table.ColumnHeader sortKey="navn" sortable>
						Navn
					</Table.ColumnHeader>
					<Table.HeaderCell scope="col">HMS</Table.HeaderCell>
					<Table.HeaderCell scope="col">Status del 2</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
		);
	}

	return (
		<Table.Header>
			<Table.Row>
				<Table.ColumnHeader sortKey="navn" sortable>
					Navn
				</Table.ColumnHeader>
				<Table.HeaderCell scope="col">E-post</Table.HeaderCell>
				<Table.HeaderCell scope="col">Arbeidssted</Table.HeaderCell>
				<Table.HeaderCell scope="col">HMS</Table.HeaderCell>
				<Table.ColumnHeader scope="col" sortKey="del1Dato" sortable>
					Dato for del 1
				</Table.ColumnHeader>
				<Table.ColumnHeader scope="col" sortKey="del2Dato" sortable>
					Dato for del 2
				</Table.ColumnHeader>
				<Table.HeaderCell scope="col">Status del 2</Table.HeaderCell>
				<Table.HeaderCell
					scope="col"
					aria-label="Handlinger"
				></Table.HeaderCell>
			</Table.Row>
		</Table.Header>
	);
};

export default TabellHeader;
