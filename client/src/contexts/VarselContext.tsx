import { createContext } from 'react';

export type VarselType = 'success' | 'error';

interface VarselContextType {
	visVarsel: (melding: string, type?: VarselType) => void;
}

export const VarselContext = createContext<VarselContextType>({
	visVarsel: () => {},
});
