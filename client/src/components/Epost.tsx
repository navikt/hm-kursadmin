import { BodyShort, HStack, Tooltip, CopyButton } from '@navikt/ds-react';
import { FilesIcon } from '@navikt/aksel-icons';

interface IProps {
	epost: string;
}

const Epost = ({ epost }: IProps) => {
	return (
		<HStack gap="1" align="center">
			<BodyShort>{epost}</BodyShort>
			<Tooltip content="Kopier e-postadresse">
				<CopyButton
					copyText={epost}
					icon={<FilesIcon aria-hidden />}
					size="xsmall"
				/>
			</Tooltip>
		</HStack>
	);
};

export default Epost;
