import { HttpResponse, http } from 'msw';
import type { Person } from '../../types/person';

const mockPersoner: Person[] = [
	{
		id: 1,
		navn: 'Jakobsen, Markus',
		fodselsdato: '1990-05-14',
		epost: 'markus.jakobsen@oslo.kommune.no',
		arbeidssted: 'Oslo kommune',
		del1Dato: '2021-04-28T19:12:14.358Z',
		del2Dato: '2021-06-15T10:30:00.000Z',
	},
	{
		id: 2,
		navn: 'Halvorsen, Mari',
		fodselsdato: '1993-09-16',
		epost: 'mari.halvorsen@bergen.kommune.no',
		arbeidssted: 'Bergen kommune',
		del1Dato: '2022-01-29T09:51:19.833Z',
		del2Dato: null,
	},
	{
		id: 3,
		navn: 'Christiansen, Mathias',
		fodselsdato: '1988-12-03',
		epost: 'mathias.christiansen@trondheim.kommune.no',
		arbeidssted: 'Trondheim kommune',
		del1Dato: '2021-06-04T20:57:29.159Z',
		del2Dato: '2021-08-22T14:00:00.000Z',
	},
	{
		id: 4,
		navn: 'Fredriksen, Leah',
		fodselsdato: '1995-03-22',
		epost: 'leah.fredriksen@oslo.kommune.no',
		arbeidssted: 'Oslo kommune',
		del1Dato: '2021-08-31T15:47:36.293Z',
		del2Dato: null,
	},
	{
		id: 5,
		navn: 'Evensen, Jonas',
		fodselsdato: '1991-11-11',
		epost: 'jonas.evensen@drammen.kommune.no',
		arbeidssted: 'Drammen kommune',
		del1Dato: '2021-07-17T11:13:26.116Z',
		del2Dato: '2021-09-10T13:15:00.000Z',
	},
];

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
