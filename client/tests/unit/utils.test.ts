import { describe, it, expect } from 'vitest';
import {
	beskrivFeil,
	formaterNorskDato,
	formaterTilISODato,
	erErsKurs,
} from '../../src/helpers/utils';
import type { Kurs } from '../../src/types/kurs';

describe('beskrivFeil', () => {
	it('returnerer riktig melding for 401 Unauthorized', () => {
		const melding = beskrivFeil(401, 'Kunne ikke hente data');
		expect(melding).toBe(
			'Sesjonen din har utløpt. Last inn siden på nytt for å logge inn igjen.',
		);
	});

	it('returnerer riktig melding for 403 Forbidden', () => {
		const melding = beskrivFeil(403, 'Ingen tilgang');
		expect(melding).toBe(
			'Sesjonen din har utløpt. Last inn siden på nytt for å logge inn igjen.',
		);
	});

	it('returnerer riktig melding for 404 Not Found', () => {
		const melding = beskrivFeil(404, 'Kunne ikke hente person');
		expect(melding).toBe('Kunne ikke hente person. Dataene ble ikke funnet.');
	});

	it('returnerer riktig melding for 500 Internal Server Error', () => {
		const melding = beskrivFeil(500, 'Kunne ikke lagre');
		expect(melding).toBe(
			'Kunne ikke lagre. En intern serverfeil oppstod – prøv igjen senere.',
		);
	});

	it('returnerer riktig melding for 502 Bad Gateway', () => {
		const melding = beskrivFeil(502, 'Tjeneste nede');
		expect(melding).toBe(
			'Tjeneste nede. Tjenesten er midlertidig utilgjengelig – prøv igjen om litt.',
		);
	});

	it('returnerer riktig melding for 503 Service Unavailable', () => {
		const melding = beskrivFeil(503, 'Ikke tilgjengelig');
		expect(melding).toBe(
			'Ikke tilgjengelig. Tjenesten er midlertidig utilgjengelig – prøv igjen om litt.',
		);
	});

	it('returnerer riktig melding for 504 Gateway Timeout', () => {
		const melding = beskrivFeil(504, 'Timeout');
		expect(melding).toBe(
			'Timeout. Tjenesten er midlertidig utilgjengelig – prøv igjen om litt.',
		);
	});

	it('returnerer generisk melding for andre statuskoder', () => {
		const melding = beskrivFeil(418, 'Teapot error');
		expect(melding).toBe('Teapot error (feilkode 418). Prøv igjen senere.');
	});
});

describe('formaterNorskDato', () => {
	it('formaterer ISO-dato til norsk datoformat', () => {
		const dato = formaterNorskDato('2024-03-15');
		expect(dato).toBe('15.03.2024');
	});

	it('håndterer dato med tidspunkt', () => {
		const dato = formaterNorskDato('2024-12-31T23:59:59');
		expect(dato).toBe('31.12.2024');
	});

	it('håndterer første dag i måneden', () => {
		const dato = formaterNorskDato('2024-01-01');
		expect(dato).toBe('01.01.2024');
	});
});

describe('formaterTilISODato', () => {
	it('formaterer Date-objekt til ISO-datostreng', () => {
		const date = new Date(2024, 2, 15); // Måned er 0-indeksert
		const isoString = formaterTilISODato(date);
		expect(isoString).toBe('2024-03-15');
	});

	it('legger til leading zero for måned og dag', () => {
		const date = new Date(2024, 0, 1);
		const isoString = formaterTilISODato(date);
		expect(isoString).toBe('2024-01-01');
	});

	it('håndterer siste dag i måneden', () => {
		const date = new Date(2024, 11, 31);
		const isoString = formaterTilISODato(date);
		expect(isoString).toBe('2024-12-31');
	});
});

describe('erErsKurs', () => {
	it('returnerer true for ERS-kurs (id 5)', () => {
		const kurs: Kurs = { id: 5, title: 'ERS-kurs' };
		expect(erErsKurs(kurs)).toBe(true);
	});

	it('returnerer false for andre kurs', () => {
		const kurs: Kurs = { id: 1, title: 'Grunnkurs' };
		expect(erErsKurs(kurs)).toBe(false);
	});

	it('returnerer false for kurs med id 0', () => {
		const kurs: Kurs = { id: 0, title: 'Test' };
		expect(erErsKurs(kurs)).toBe(false);
	});
});
