import { BodyShort, Button, HStack, Tooltip } from '@navikt/ds-react';
import { FilesIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

interface IProps {
	epost: string;
}

const Epost = ({ epost }: IProps) => {
	const [tooltipText, setTooltipText] = useState('Kopier e-postadresse');

	const handleKopierEpost = () => {
		navigator.clipboard
			.writeText(epost)
			.then(() => {
				setTooltipText('Kopiert!');
				setTimeout(() => {
					setTooltipText('Kopier e-postadresse');
				}, 1000);
			})
			.catch((error) => {
				setTooltipText('Feil ved kopiering');
				console.error('Kunne ikke kopiere e-postadresse:', error);
				setTimeout(() => {
					setTooltipText('Kopier e-postadresse');
				}, 1000);
			});
	};

	return (
		<HStack>
			<BodyShort>{epost}</BodyShort>
			<Tooltip content={tooltipText} describesChild>
				<Button
					variant="tertiary"
					size="small"
					onClick={handleKopierEpost}
					style={{ padding: 0 }}
				>
					<FilesIcon aria-hidden />
				</Button>
			</Tooltip>
		</HStack>
	);
};

export default Epost;
