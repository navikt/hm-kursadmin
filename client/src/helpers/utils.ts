import type { Kurs } from '../types/kurs';

export const BASE_URL = '/api';

export function beskrivFeil(status: number, feilmelding: string): string {
	switch (status) {
		case 401:
		case 403:
			return 'Sesjonen din har utløpt. Last inn siden på nytt for å logge inn igjen.';
		case 502:
		case 503:
		case 504:
			return `${feilmelding}. Tjenesten er midlertidig utilgjengelig – prøv igjen om litt.`;
		case 404:
			return `${feilmelding}. Dataene ble ikke funnet.`;
		case 500:
			return `${feilmelding}. En intern serverfeil oppstod – prøv igjen senere.`;
		default:
			return `${feilmelding} (feilkode ${status}). Prøv igjen senere.`;
	}
}

export const formaterNorskDato = (dato: string) =>
	new Date(dato).toLocaleString('no', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});

export const formaterTilISODato = (date: Date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

export const erErsKurs = (kurs: Kurs): boolean => {
	return kurs.id === 5;
};
