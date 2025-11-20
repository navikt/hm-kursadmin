export const formaterNorskDato = (dato: string) =>
	new Date(dato).toLocaleString('no', {
		day: 'numeric',
		month: 'numeric',
		year: 'numeric',
	});

export const formaterTilISODato = (date: Date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

export const lagTidsstempel = () => {
	return new Date().toLocaleString('nb-NO', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

export const lagHandlingstekst = (handling: {
	type: 'GODKJENT_DEL2' | 'FJERNET_GODKJENNING';
	personNavn: string;
	kursDato: string;
}) => {
	const datoTekst = new Date(handling.kursDato).toLocaleDateString('nb-NO');

	if (handling.type === 'GODKJENT_DEL2') {
		return `Godkjent del 2 for person: ${handling.personNavn} den ${datoTekst}`;
	} else if (handling.type === 'FJERNET_GODKJENNING') {
		return `Fjernet godkjenning for person: ${handling.personNavn} den ${datoTekst}`;
	}
	return '';
};
