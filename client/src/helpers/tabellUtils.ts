import type { Person } from '../types/person';

export interface ScopedSortState {
	orderBy: keyof Person;
	direction: 'ascending' | 'descending';
}

export const tabellSortering = () => {
	const handleSortering = (
		currentSort: ScopedSortState | undefined,
		kolonnenavn: ScopedSortState['orderBy']
	): ScopedSortState | undefined => {
		return currentSort &&
			kolonnenavn === currentSort.orderBy &&
			currentSort.direction === 'descending'
			? undefined
			: {
					orderBy: kolonnenavn,
					direction:
						currentSort &&
						kolonnenavn === currentSort.orderBy &&
						currentSort.direction === 'ascending'
							? 'descending'
							: 'ascending',
			  };
	};

	const comparator = <T>(a: T, b: T, orderBy: keyof T): number => {
		if (a[orderBy] == null && b[orderBy] == null) {
			return 0;
		}
		if (a[orderBy] == null) {
			return 1;
		}
		if (b[orderBy] == null) {
			return -1;
		}
		if (b[orderBy] < a[orderBy]) {
			return -1;
		}
		if (b[orderBy] > a[orderBy]) {
			return 1;
		}
		return 0;
	};

	const sortData = <T>(data: T[], sort: ScopedSortState | undefined): T[] => {
		return data.slice().sort((a, b) => {
			if (sort) {
				return sort.direction === 'ascending'
					? comparator(b, a, sort.orderBy as keyof T)
					: comparator(a, b, sort.orderBy as keyof T);
			}
			return 0;
		});
	};

	return { handleSortering, sortData };
};
