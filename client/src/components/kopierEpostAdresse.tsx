import { Button } from '@navikt/ds-react';
import { FilesIcon } from '@navikt/aksel-icons';

interface IProps {
	epost: string;
}

const KopierEpostAdresse = ({ epost }: IProps) => {
	const handleKopier = () => {
		navigator.clipboard.writeText(epost);
	};

	return (
		<Button
			variant="tertiary"
			size="small"
			onClick={handleKopier}
			style={{ padding: 0 }}
		>
			<FilesIcon title="Kopier e-postadresse" />
		</Button>
	);
};

export default KopierEpostAdresse;
