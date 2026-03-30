import { HttpResponse, http } from 'msw';
import { mockPersoner } from '../data/mockPersoner';
import { BASE_URL } from '../../App';

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

	mockPersoner[personIndex].del2Dato = del2Dato;
	// return HttpResponse.json(mockPersoner[personIndex]);
	return HttpResponse.text('OK', { status: 200 });
};

const personerHandler = [
	http.get(`${BASE_URL}/personer`, () => {
		return HttpResponse.json({ personer: mockPersoner });
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
