import { BodyShort, HStack } from '@navikt/ds-react';

interface Props {
	epost: string;
}

const Epost = ({ epost }: Props) => {
	const parts = epost.split(/([@.])/).map((part, index) => {
		const shouldBreak = part === '@' || part === '.';
		return (
			<span key={index}>
				{part}
				{shouldBreak && <wbr />}
			</span>
		);
	});

	return (
		<HStack gap="1" align="center" className="epost-lengde">
			<BodyShort>{parts}</BodyShort>
		</HStack>
	);
};

export default Epost;
