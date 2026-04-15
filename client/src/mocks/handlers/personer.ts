import { HttpResponse, http } from 'msw';
import { type MockPerson, mockPersoner } from '../data/mockPersoner';
import { BASE_URL } from '../../helpers/utils';
import type { Person } from '../../types/person';

const updateDel2Status = (id: string, del2Dato: string | null) => {
	const personIndex = mockPersoner.findIndex(
		(person) => person.id === Number(id),
	);

	if (personIndex === -1) {
		return HttpResponse.json(
			{ message: 'Person ikke funnet' },
			{ status: 404 },
		);
	}

	mockPersoner[personIndex].ersDel2Dato = del2Dato;
	// return HttpResponse.json(mockPersoner[personIndex]);
	return HttpResponse.text('OK', { status: 200 });
};

const kursConfig: Record<
	string,
	{ del1: keyof MockPerson; del2?: keyof MockPerson }
> = {
	'7': { del1: 'personløfterDato' },
	'8': { del1: 'elektriskSengDato' },
	'5': { del1: 'ersDel1Dato', del2: 'ersDel2Dato' },
};

const personerHandler = [
	http.get(`${BASE_URL}/personer/:kursid`, ({ params }) => {
		const { kursid } = params;
		const config = kursConfig[kursid as string];
		if (!config) return HttpResponse.json([]);

		const personer = mockPersoner
			.filter((person) => person[config.del1] !== null)
			.map(
				(person) =>
					({
						...person,
						del1Dato: person[config.del1],
						del2Dato: config.del2 ? person[config.del2] : null,
					}) as Person,
			);

		return HttpResponse.json({ personer });
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
