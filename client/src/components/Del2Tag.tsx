import { Tag } from '@navikt/ds-react';

interface Props {
	del2Dato: string | null;
}

const Del2Tag = ({ del2Dato }: Props) => {
	if (del2Dato) {
		return <Tag variant="success">Fullført</Tag>;
	} else {
		return <Tag variant="neutral">Ikke fullført</Tag>;
	}
};

export default Del2Tag;
