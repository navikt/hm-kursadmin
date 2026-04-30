import type { Person } from '../types/person';

export const tabellFiltrering = () => {
	const filtrerPersoner = (
		personer: Person[],
		sokeverdi: string,
		statusDel2Verdi: string,
	): Person[] => {
		const sok = sokeverdi.trim().toLowerCase();
		const baseFilter = (person: Person) => {
			const matcherSok =
				!sok ||
				person.navn.toLowerCase().includes(sok) ||
				person.epost.toLowerCase().includes(sok);

			const matcherStatusDel2 =
				!statusDel2Verdi ||
				(statusDel2Verdi === 'fullført' && person.del2Dato !== null) ||
				(statusDel2Verdi === 'ikke-fullført' && person.del2Dato === null);

			return matcherSok && matcherStatusDel2;
		};

		if (!sok) {
			return personer.filter(baseFilter);
		}

		const sokOrd = sok.split(/\s+/);
		const rekkefriFilter = (person: Person) => {
			const navn = person.navn.toLowerCase();
			const epost = person.epost.toLowerCase();
			const matcherAlleOrd = sokOrd.every(
				(ord) => navn.includes(ord) || epost.includes(ord),
			);
			const matcherStatusDel2 =
				!statusDel2Verdi ||
				(statusDel2Verdi === 'fullført' && person.del2Dato !== null) ||
				(statusDel2Verdi === 'ikke-fullført' && person.del2Dato === null);
			return matcherAlleOrd && matcherStatusDel2;
		};
		return personer.filter(rekkefriFilter);
	};

	return { filtrerPersoner };
};
