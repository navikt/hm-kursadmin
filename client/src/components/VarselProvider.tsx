import { type PropsWithChildren, useState, useCallback, useMemo } from 'react';
import { InlineMessage, Box } from '@navikt/ds-react';
import { VarselContext, type VarselType } from '../contexts/VarselContext';

interface Varsel {
	id: string;
	melding: string;
	type: VarselType;
}

const VARSEL_VARIGHET = 5000;

const VarselProvider = ({ children }: PropsWithChildren) => {
	const [varsler, setVarsler] = useState<Varsel[]>([]);

	const fjernVarsel = useCallback((id: string) => {
		setVarsler((prev) => prev.filter((varsel) => varsel.id !== id));
	}, []);

	const visVarsel = useCallback(
		(melding: string, type: VarselType = 'success') => {
			const id = Date.now().toString();
			setVarsler((prev) => [...prev, { id, melding, type }]);
			setTimeout(() => fjernVarsel(id), VARSEL_VARIGHET);
		},
		[fjernVarsel],
	);

	const contextValue = useMemo(() => ({ visVarsel }), [visVarsel]);

	return (
		<VarselContext.Provider value={contextValue}>
			{children}
			<div className="varsel-container">
				{varsler.map((varsel) => (
					<Box.New
						key={varsel.id}
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
				))}
			</div>
		</VarselContext.Provider>
	);
};

export default VarselProvider;
