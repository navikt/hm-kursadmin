import { delay, http, HttpHandler, HttpResponse } from 'msw';
import { BASE_URL } from '../../helpers/utils';
import { KursadminRolle } from '../../types/kursadminbruker';

export const apiHandlers: HttpHandler[] = [
	http.get(`${BASE_URL}/meg`, async () => {
		await delay(1000); // simulerer at endepunktet bruker 1 sek på å svare. 
		return HttpResponse.json({ roller: [KursadminRolle.LESE, KursadminRolle.REDIGERE] });
	}),
];
