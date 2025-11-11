export const formaterNorskDato = (dato: string) =>
	new Date(dato).toLocaleString('no', {
		day: 'numeric',
		month: 'numeric',
		year: 'numeric',
	});

export const fodselsnummerTilDato = (fnr: string) => {
	const dag = fnr.slice(0, 2);
	const maned = fnr.slice(2, 4);
	const ar = Number(fnr.slice(4, 6));
	const individnummer = Number(fnr.slice(6, 9));

	let arhundre = 1900;
	if (individnummer >= 500 && individnummer <= 749 && ar >= 54) arhundre = 1800;
	else if (individnummer >= 500 && individnummer <= 999 && ar < 40)
		arhundre = 2000;
	else if (individnummer >= 900 && ar >= 40) arhundre = 1900;

	const dato = new Date(arhundre + ar, Number(maned) - 1, Number(dag));
	return formaterNorskDato(dato.toISOString());
};
