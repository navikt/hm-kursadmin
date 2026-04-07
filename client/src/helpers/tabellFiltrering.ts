import type { Person } from '../types/person';

export const tabellFiltrering = () => {
	const filtrerPersoner = (
		personer: Person[],
		sokeverdi: string,
		hjelpemiddelsentralVerdi: string,
		statusDel2Verdi: string,
	): Person[] => {
		return personer.filter((person) => {
			const matcherSok =
				!sokeverdi ||
				person.navn.toLowerCase().includes(sokeverdi.toLowerCase()) ||
				person.epost.toLowerCase().includes(sokeverdi.toLowerCase());

			const matcherHjelpemiddelsentral =
				!hjelpemiddelsentralVerdi ||
				person.hjelpemiddelsentral === hjelpemiddelsentralVerdi;

			const matcherStatusDel2 =
				!statusDel2Verdi ||
				(statusDel2Verdi === 'fullført' && person.del2Dato !== null) ||
				(statusDel2Verdi === 'ikke-fullført' && person.del2Dato === null);

			return matcherSok && matcherHjelpemiddelsentral && matcherStatusDel2;
		});
	};

	return { filtrerPersoner };
};
