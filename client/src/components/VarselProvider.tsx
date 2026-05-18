import {
	type PropsWithChildren,
	useState,
	useRef,
	useCallback,
	useMemo,
} from 'react';
import { InlineMessage, Box } from '@navikt/ds-react';
import { VarselContext, type VarselType } from '../contexts/VarselContext';

interface Varsel {
	melding: string;
	type: VarselType;
}

const VARSEL_VARIGHET = 5000;

const VarselProvider = ({ children }: PropsWithChildren) => {
	const [varsel, setVarsel] = useState<Varsel | null>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

	const visVarsel = useCallback(
		(melding: string, type: VarselType = 'success') => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			setVarsel({ melding, type });
			timeoutRef.current = setTimeout(() => setVarsel(null), VARSEL_VARIGHET);
		},
		[],
	);

	const contextValue = useMemo(() => ({ visVarsel }), [visVarsel]);

	return (
		<VarselContext.Provider value={contextValue}>
			{children}
			{varsel && (
				<div className="varsel-container">
					<Box.New
						background={
							varsel.type === 'success' ? 'success-soft' : 'danger-soft'
						}
						padding="4"
						borderRadius="8"
						className="varsel"
					>
						<InlineMessage status={varsel.type} size="small" role="alert">
							{varsel.melding}
						</InlineMessage>
					</Box.New>
				</div>
			)}
		</VarselContext.Provider>
	);
};

export default VarselProvider;
