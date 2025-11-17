import { HttpResponse, http } from 'msw';
import { mockPersoner } from '../data/mockPersoner';

const personerHandler = [
	http.get('/api/personer', () => {
		return HttpResponse.json(mockPersoner);
	}),
	http.patch('/api/personer/:id/opprett-del2', (req) => {
		const { id } = req.params;

		const personIndex = mockPersoner.findIndex(
			(person) => person.id === Number(id)
		);

		if (personIndex === -1) {
			return HttpResponse.json(
				{ message: 'Person ikke funnet' },
				{ status: 404 }
			);
		}

		mockPersoner[personIndex].del2Dato = new Date().toISOString();

		return HttpResponse.json(mockPersoner[personIndex]);
	}),

	http.patch('/api/personer/:id/fjern-del2', (req) => {
		const { id } = req.params;

		const personIndex = mockPersoner.findIndex(
			(person) => person.id === Number(id)
		);

		if (personIndex === -1) {
			return HttpResponse.json(
				{ message: 'Person ikke funnet' },
				{ status: 404 }
			);
		}

		mockPersoner[personIndex].del2Dato = null;

		return HttpResponse.json(mockPersoner[personIndex]);
	}),
];

export default personerHandler;
