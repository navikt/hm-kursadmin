import { describe, it, expect } from 'vitest';
import {
	tabellSortering,
	type ScopedSortState,
} from '../../src/helpers/tabellUtils';
import type { Person } from '../../src/types/person';

const mockPersoner: Person[] = [
	{
		id: 1,
		navn: 'Testberg, Siri',
		epost: 'siri.testberg@testdata.no',
		arbeidssted: 'Diakonhjemmet Sykehus',
		del1Dato: '2025-03-09',
		del2Dato: null,
	},
	{
		id: 2,
		navn: 'Mockdal, Berit',
		epost: 'berit.mockdal@testdata.no',
		arbeidssted: 'Rikshospitalet',
		del1Dato: '2025-01-11',
		del2Dato: '2025-03-05',
	},
	{
		id: 3,
		navn: 'Mockmyr, Astrid',
		epost: 'astrid.mockmyr@example.no',
		arbeidssted: 'Molde Sjukehus',
		del1Dato: '2024-12-20',
		del2Dato: null,
	},
];

describe('tabellSortering', () => {
	const { handleSortering, sortData } = tabellSortering();

	describe('handleSortering', () => {
		it('returnerer ascending når ingen sortering er aktiv', () => {
			const resultat = handleSortering(undefined, 'navn');
			expect(resultat).toEqual({
				orderBy: 'navn',
				direction: 'ascending',
			});
		});

		it('bytter fra ascending til descending på samme kolonne', () => {
			const currentSort: ScopedSortState = {
				orderBy: 'navn',
				direction: 'ascending',
			};
			const resultat = handleSortering(currentSort, 'navn');
			expect(resultat).toEqual({
				orderBy: 'navn',
				direction: 'descending',
			});
		});

		it('returnerer undefined når descending klikkes på samme kolonne', () => {
			const currentSort: ScopedSortState = {
				orderBy: 'navn',
				direction: 'descending',
			};
			const resultat = handleSortering(currentSort, 'navn');
			expect(resultat).toBeUndefined();
		});

		it('starter på ascending når ny kolonne velges', () => {
			const currentSort: ScopedSortState = {
				orderBy: 'navn',
				direction: 'descending',
			};
			const resultat = handleSortering(currentSort, 'epost');
			expect(resultat).toEqual({
				orderBy: 'epost',
				direction: 'ascending',
			});
		});
	});

	describe('sortData', () => {
		it('returnerer uendret liste når sort er undefined', () => {
			const resultat = sortData(mockPersoner, undefined);
			expect(resultat).toEqual(mockPersoner);
		});

		it('sorterer på navn ascending', () => {
			const sort: ScopedSortState = {
				orderBy: 'navn',
				direction: 'ascending',
			};
			const resultat = sortData(mockPersoner, sort);
			expect(resultat[0].navn).toBe('Mockdal, Berit');
			expect(resultat[1].navn).toBe('Mockmyr, Astrid');
			expect(resultat[2].navn).toBe('Testberg, Siri');
		});

		it('sorterer på navn descending', () => {
			const sort: ScopedSortState = {
				orderBy: 'navn',
				direction: 'descending',
			};
			const resultat = sortData(mockPersoner, sort);
			expect(resultat[0].navn).toBe('Testberg, Siri');
			expect(resultat[1].navn).toBe('Mockmyr, Astrid');
			expect(resultat[2].navn).toBe('Mockdal, Berit');
		});

		it('sorterer på epost ascending', () => {
			const sort: ScopedSortState = {
				orderBy: 'epost',
				direction: 'ascending',
			};
			const resultat = sortData(mockPersoner, sort);
			expect(resultat[0].epost).toBe('astrid.mockmyr@example.no');
			expect(resultat[1].epost).toBe('berit.mockdal@testdata.no');
			expect(resultat[2].epost).toBe('siri.testberg@testdata.no');
		});

		it('håndterer null-verdier (setter de sist)', () => {
			const sort: ScopedSortState = {
				orderBy: 'del2Dato',
				direction: 'ascending',
			};
			const resultat = sortData(mockPersoner, sort);
			expect(resultat[0].del2Dato).toBe(null);
			expect(resultat[1].del2Dato).toBe(null);
			expect(resultat[2].del2Dato).toBe('2025-03-05');
		});

		it('håndterer null-verdier descending (setter de fortsatt sist)', () => {
			const sort: ScopedSortState = {
				orderBy: 'del2Dato',
				direction: 'descending',
			};
			const resultat = sortData(mockPersoner, sort);
			expect(resultat[0].del2Dato).toBe('2025-03-05');
			expect(resultat[1].del2Dato).toBe(null);
			expect(resultat[2].del2Dato).toBe(null);
		});

		it('endrer ikke original array (immutable)', () => {
			const original = [...mockPersoner];
			const sort: ScopedSortState = {
				orderBy: 'navn',
				direction: 'ascending',
			};
			sortData(mockPersoner, sort);
			expect(mockPersoner).toEqual(original);
		});
	});
});
