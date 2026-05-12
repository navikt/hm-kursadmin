import { useContext } from 'react';
import { VarselContext } from '../contexts/VarselContext';

export const useVarsel = () => useContext(VarselContext);
