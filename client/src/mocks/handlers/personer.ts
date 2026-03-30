import { HttpResponse, http } from 'msw';
import { mockPersoner } from '../data/mockPersoner';
import { BASE_URL } from '../../App';
import type { Person } from '../../types/person';

const updateDel2Status = (id: string, del2Dato: string | null) => {
	const personIndex = mockPersoner.findIndex(
		(person) => person.id === Number(id)
	);

	if (personIndex === -1) {
		return HttpResponse.json(
			{ message: 'Person ikke funnet' },
			{ status: 404 }
		);
	}

	mockPersoner[personIndex].ersDel2Dato = del2Dato;
	// return HttpResponse.json(mockPersoner[personIndex]);
	return HttpResponse.text('OK', { status: 200 });
};

const personerHandler = [
	http.get(`${BASE_URL}/personer/:kursid`, (req) => {
		const { kursid } = req.params;
		if (kursid == '2') {
			const personer = mockPersoner.filter((person) => person.personløfterDato !== null);
			return HttpResponse.json({ personer: personer.map((person) => ({ ...person, del1Dato: person.personløfterDato, del2Dato: null } as Person)) });
		}
		if (kursid == '3') {
			const personer = mockPersoner.filter((person) => person.elektriskSengDato !== null);
			return HttpResponse.json({ personer: personer.map((person) => ({ ...person, del1Dato: person.elektriskSengDato, del2Dato: null } as Person)) });
		}
		if (kursid == '5') {
			const personer = mockPersoner.filter((person) => person.ersDel1Dato !== null);
			return HttpResponse.json({ personer: personer.map((person) => ({ ...person, del1Dato: person.ersDel1Dato, del2Dato: person.ersDel2Dato } as Person)) });
		}
		return HttpResponse.json([]);
	}),
	http.patch(`${BASE_URL}/personer/:id/godkjenn-del2`, async (req) => {
		const { id } = req.params;
		const body = (await req.request.json()) as { kursDato: string };
		return updateDel2Status(id as string, body.kursDato);
	}),
	http.patch(`${BASE_URL}/personer/:id/fjern-del2`, (req) => {
		const { id } = req.params;
		return updateDel2Status(id as string, null);
	}),
];

export default personerHandler;
