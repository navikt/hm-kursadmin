import { Search } from '@navikt/ds-react';
import { useTablet } from '../../helpers/useResponsive';

interface Props {
	sokeverdi: string;
	setSokeverdi: (verdi: string) => void;
}

const Sok = ({ sokeverdi, setSokeverdi }: Props) => {
	const isMobile = useTablet();
	let sokBredde = 45;

	if (isMobile) {
		sokBredde = 30;
	}

	return (
		<form role="search" onSubmit={(e) => e.preventDefault()}>
			<Search
				label="Søk på navn eller e-post"
				variant="primary"
				hideLabel={false}
				autoComplete="off"
				htmlSize={sokBredde}
				value={sokeverdi}
				onChange={(verdi) => setSokeverdi(verdi)}
				size="small"
			/>
		</form>
	);
};

export default Sok;
