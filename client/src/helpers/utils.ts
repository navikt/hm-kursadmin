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
