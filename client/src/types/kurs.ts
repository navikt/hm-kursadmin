export interface Kurs {
    id: number;
    title: string;
}

export const PERSONLOFTER_OG_SEIL: Kurs = { id: 7, title: 'Personløfter og seil' };
export const ELEKTRISK_SENG: Kurs = { id: 8, title: 'Elektrisk seng' };
export const EL_RULLESTOL: Kurs = { id: 5, title: 'Elektrisk rullestol' };

export const kursliste: Kurs[] = [EL_RULLESTOL, PERSONLOFTER_OG_SEIL, ELEKTRISK_SENG];

export const finnKurs = (kursId: number): Kurs | undefined => {
    return kursliste.find(kurs => kurs.id === kursId);
};