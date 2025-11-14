import { HttpResponse, http } from 'msw';

export interface Person {
	navn: string;
	fnr: string;
	epost: string;
	arbeidssted: string;
	del1Dato: string;
	del2Dato: string | null;
}

const mockPersoner: Person[] = [
	{
		navn: 'Jakobsen, Markus',
		fnr: '03099265463',
		epost: 'markus.jakobsen@oslo.kommune.no',
		arbeidssted: 'Oslo kommune',
		del1Dato: '2021-04-28T19:12:14.358Z',
		del2Dato: '2021-06-15T10:30:00.000Z',
	},
	{
		navn: 'Halvorsen, Mari',
		fnr: '16099334134',
		epost: 'mari.halvorsen@bergen.kommune.no',
		arbeidssted: 'Bergen kommune',
		del1Dato: '2022-01-29T09:51:19.833Z',
		del2Dato: null,
	},
	{
		navn: 'Christiansen, Mathias',
		fnr: '18099441438',
		epost: 'mathias.christiansen@trondheim.kommune.no',
		arbeidssted: 'Trondheim kommune',
		del1Dato: '2021-06-04T20:57:29.159Z',
		del2Dato: '2021-08-22T14:00:00.000Z',
	},
	{
		navn: 'Fredriksen, Leah',
		fnr: '24099080180',
		epost: 'leah.fredriksen@oslo.kommune.no',
		arbeidssted: 'Oslo kommune',
		del1Dato: '2021-08-31T15:47:36.293Z',
		del2Dato: null,
	},
	{
		navn: 'Evensen, Jonas',
		fnr: '18099648460',
		epost: 'jonas.evensen@drammen.kommune.no',
		arbeidssted: 'Drammen kommune',
		del1Dato: '2021-07-17T11:13:26.116Z',
		del2Dato: '2021-09-10T13:15:00.000Z',
	},
];

const personerHandler = [
	http.get<never, never, Person[]>('/api/personer', () => {
		return HttpResponse.json(mockPersoner);
	}),
];

export default personerHandler;
