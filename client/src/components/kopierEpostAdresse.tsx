import { Button, Tooltip } from '@navikt/ds-react';
import { FilesIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

interface IProps {
	epost: string;
}

const KopierEpostadresse = ({ epost }: IProps) => {
	const [tooltipText, setTooltipText] = useState('Kopier e-postadresse');

	const handleKopier = () => {
		navigator.clipboard.writeText(epost);
		setTooltipText('Kopiert!');

		setTimeout(() => {
			setTooltipText('Kopier e-postadresse');
		}, 2000);
	};

	return (
		<Tooltip content={tooltipText} describesChild>
			<Button
				variant="tertiary"
				size="small"
				onClick={handleKopier}
				style={{ padding: 0 }}
			>
				<FilesIcon aria-hidden />
			</Button>
		</Tooltip>
	);
};

export default KopierEpostadresse;
