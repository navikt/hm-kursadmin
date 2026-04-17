export const KursadminRolle = {
  REDIGERE: "REDIGERE",
  LESE: "LESE",
} as const;

export type KursadminRolle = (typeof KursadminRolle)[keyof typeof KursadminRolle];

export interface KursadminBruker {
  roller: KursadminRolle[];
}

export function kanRedigere(bruker: KursadminBruker | undefined): boolean {
  return bruker?.roller.includes(KursadminRolle.REDIGERE)?? false;
}

export function kanLese(bruker: KursadminBruker | undefined): boolean {
  return bruker?.roller.includes(KursadminRolle.LESE) || kanRedigere(bruker);
}