import { describe, it, expect } from 'vitest';
import { tabellFiltrering } from '../../src/helpers/tabellFiltrering';
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
	{
		id: 4,
		navn: 'Testmo, Gunnhild',
		epost: 'gunnhild.testmo@example.no',
		arbeidssted: 'Fredrikstad Blødersenter',
		del1Dato: '2024-11-12',
		del2Dato: null,
	},
];

describe('tabellFiltrering', () => {
	const { filtrerPersoner } = tabellFiltrering();

	describe('søkefilter', () => {
		it('returnerer alle personer når søkeverdi er tom', () => {
			const resultat = filtrerPersoner(mockPersoner, '', '');
			expect(resultat).toHaveLength(4);
		});

		it('filtrerer på navn (case-insensitive)', () => {
			const resultat = filtrerPersoner(mockPersoner, 'siri', '');
			expect(resultat).toHaveLength(1);
			expect(resultat[0].navn).toBe('Testberg, Siri');
		});

		it('filtrerer på navn med store bokstaver', () => {
			const resultat = filtrerPersoner(mockPersoner, 'BERIT', '');
			expect(resultat).toHaveLength(1);
			expect(resultat[0].navn).toBe('Mockdal, Berit');
		});

		it('filtrerer på deler av navn', () => {
			const resultat = filtrerPersoner(mockPersoner, 'mock', '');
			expect(resultat).toHaveLength(2);
			expect(resultat.map((p) => p.navn)).toContain('Mockdal, Berit');
			expect(resultat.map((p) => p.navn)).toContain('Mockmyr, Astrid');
		});

		it('filtrerer på epost', () => {
			const resultat = filtrerPersoner(mockPersoner, 'astrid.mockmyr', '');
			expect(resultat).toHaveLength(1);
			expect(resultat[0].navn).toBe('Mockmyr, Astrid');
		});

		it('returnerer tom liste når ingen matcher søk', () => {
			const resultat = filtrerPersoner(mockPersoner, 'xyz123', '');
			expect(resultat).toHaveLength(0);
		});

		it('håndterer personer uten epost ved søk og filtrering', () => {
			const person = { ...mockPersoner[0], epost: null };
			expect(filtrerPersoner([person], '', '')).toEqual([person]);
			expect(filtrerPersoner([person], 'siri testberg', '')).toEqual([person]);
			expect(filtrerPersoner([person], 'siri', 'ikke-fullført')).toEqual([person]);
			expect(filtrerPersoner([person], 'testdata.no', '')).toEqual([]);
		});
	});

	describe('statusDel2-filter', () => {
		it('filtrerer på fullført del 2', () => {
			const resultat = filtrerPersoner(mockPersoner, '', 'fullført');
			expect(resultat).toHaveLength(1);
			expect(resultat.every((p) => p.del2Dato !== null)).toBe(true);
		});

		it('filtrerer på ikke-fullført del 2', () => {
			const resultat = filtrerPersoner(mockPersoner, '', 'ikke-fullført');
			expect(resultat).toHaveLength(3);
			expect(resultat.every((p) => p.del2Dato === null)).toBe(true);
		});

		it('returnerer alle når statusDel2Verdi er tom', () => {
			const resultat = filtrerPersoner(mockPersoner, '', '');
			expect(resultat).toHaveLength(4);
		});
	});

	describe('kombinerte filtre', () => {
		it('filtrerer på søk og status', () => {
			const resultat = filtrerPersoner(mockPersoner, 'mock', 'fullført');
			expect(resultat).toHaveLength(1);
			expect(resultat[0].navn).toBe('Mockdal, Berit');
		});

		it('returnerer tom liste når kombinerte filtre ikke matcher', () => {
			const resultat = filtrerPersoner(mockPersoner, 'siri', 'fullført');
			expect(resultat).toHaveLength(0);
		});
	});
});
