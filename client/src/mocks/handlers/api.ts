import { http, HttpHandler, HttpResponse } from 'msw';
import { BASE_URL } from '../../helpers/utils';
import { KursadminRolle } from '../../types/kursadminbruker';

export const apiHandlers: HttpHandler[] = [
    http.get(`${BASE_URL}/meg`, ({  }) => {
		return HttpResponse.json({roller : [KursadminRolle.LESE, KursadminRolle.REDIGERE] });
	})]
