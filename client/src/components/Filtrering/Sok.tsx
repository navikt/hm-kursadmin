import { Search } from '@navikt/ds-react';

interface Props {
	sokeverdi: string;
	setSokeverdi: (verdi: string) => void;
}

const Sok = ({ sokeverdi, setSokeverdi }: Props) => {
	return (
		<form role="search" onSubmit={(e) => e.preventDefault()}>
			<Search
				label="Søk på navn eller e-post"
				variant="secondary"
				hideLabel={false}
				htmlSize="30"
				autoFocus
				autoComplete="off"
				value={sokeverdi}
				onChange={(verdi) => setSokeverdi(verdi)}
			/>
		</form>
	);
};

export default Sok;
