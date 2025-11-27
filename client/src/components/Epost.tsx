import { BodyShort, HStack, Tooltip, CopyButton } from '@navikt/ds-react';
import { FilesIcon } from '@navikt/aksel-icons';

interface Props {
	epost: string;
}

const Epost = ({ epost }: Props) => {
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
