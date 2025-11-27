import { Button, Tooltip } from '@navikt/ds-react';
import { FilesIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

interface Props {
	epost: string;
}

const KopierEpostadresse = ({ epost }: Props) => {
	const [tooltipText, setTooltipText] = useState('Kopier e-postadresse');

	const handleKopier = () => {
		navigator.clipboard
			.writeText(epost)
			.then(() => {
				setTooltipText('Kopiert!');
				setTimeout(() => {
					setTooltipText('Kopier e-postadresse');
				}, 2000);
			})
			.catch((error) => {
				setTooltipText('Feil ved kopiering');
				console.error('Kunne ikke kopiere e-postadresse:', error);
				setTimeout(() => {
					setTooltipText('Kopier e-postadresse');
				}, 2000);
			});
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
