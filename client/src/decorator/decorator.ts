import { setParams } from '@navikt/nav-dekoratoren-moduler';
import type { DecoratorParams } from '@navikt/nav-dekoratoren-moduler';

const DEFAULT_PARAMS: DecoratorParams = {
	chatbot: false,
	simple: true,
	feedback: false,
	context: 'samarbeidspartner',
};

export const initDecorator = () => {
	setParams(DEFAULT_PARAMS);
};
