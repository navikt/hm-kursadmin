import { Select } from '@navikt/ds-react';

interface Props {
	statusDel2Verdi: string;
	setStatusDel2Verdi: (verdi: string) => void;
}

const StatusDel2Filter = ({ statusDel2Verdi, setStatusDel2Verdi }: Props) => {
	return (
		<Select
			label="Velg status Del 2"
			value={statusDel2Verdi}
			onChange={(e) => setStatusDel2Verdi(e.target.value)}
		>
			<option value="">- Velg status Del 2 -</option>
			<option value="ikke-fullført">Ikke fullført</option>
			<option value="fullført">Fullført</option>
		</Select>
	);
};

export default StatusDel2Filter;
