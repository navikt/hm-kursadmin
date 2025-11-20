export interface Handling {
	id: string;
	type: 'GODKJENT_DEL2' | 'FJERNET_GODKJENNING';
	personNavn: string;
	kursDato: string;
	tidspunkt: string;
}
