import { HttpResponse, http } from 'msw';
import { mockPersoner } from '../data/mockPersoner';

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
	return HttpResponse.json(mockPersoner[personIndex]);
};

const personerHandler = [
	http.get('/api/personer', () => {
		return HttpResponse.json(mockPersoner);
	}),
	http.patch('/api/personer/:id/godkjenn-del2', async (req) => {
		const { id } = req.params;
		const body = (await req.request.json()) as { kursDato: string };
		return updateDel2Status(id as string, body.kursDato);
	}),
	http.patch('/api/personer/:id/fjern-del2', (req) => {
		const { id } = req.params;
		return updateDel2Status(id as string, null);
	}),
];

export default personerHandler;
