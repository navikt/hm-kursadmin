import { HStack, VStack, Button } from '@navikt/ds-react';
import { XMarkIcon } from '@navikt/aksel-icons';
import Sok from './Sok';
import HjelpemiddelsentralFilter from './HjelpemiddelsentralFilter';
import type { Person } from '../../types/person';
import StatusDel2Filter from './StatusDel2Filter';
import { useMobile } from '../../helpers/useMobile';

interface Props {
	sokeverdi: string;
	setSokeverdi: (verdi: string) => void;
	hjelpemiddelsentralVerdi: string;
	setHjelpemiddelsentralVerdi: (verdi: string) => void;
	statusDel2Verdi: string;
	setStatusDel2Verdi: (verdi: string) => void;
	personer: Person[];
}

const Filtrering = ({
	sokeverdi,
	setSokeverdi,
	hjelpemiddelsentralVerdi,
	setHjelpemiddelsentralVerdi,
	statusDel2Verdi,
	setStatusDel2Verdi,
	personer,
}: Props) => {
	const isMobile = useMobile();
	const StackComponent = isMobile ? VStack : HStack;
	const alignValue = isMobile ? 'start' : 'end';

	const handleReset = () => {
		setSokeverdi('');
		setHjelpemiddelsentralVerdi('');
		setStatusDel2Verdi('');
	};

	const harAktiveFiltre =
		sokeverdi !== '' ||
		hjelpemiddelsentralVerdi !== '' ||
		statusDel2Verdi !== '';

	return (
		<StackComponent gap={'4'} align={alignValue}>
			<Sok sokeverdi={sokeverdi} setSokeverdi={setSokeverdi} />
			<HjelpemiddelsentralFilter
				hjelpemiddelsentralVerdi={hjelpemiddelsentralVerdi}
				setHjelpemiddelsentralVerdi={setHjelpemiddelsentralVerdi}
				personer={personer}
			/>
			<StatusDel2Filter
				statusDel2Verdi={statusDel2Verdi}
				setStatusDel2Verdi={setStatusDel2Verdi}
			/>
			{harAktiveFiltre && (
				<Button
					variant="tertiary"
					icon={<XMarkIcon aria-hidden />}
					onClick={handleReset}
				>
					Nullstill filtre
				</Button>
			)}
		</StackComponent>
	);
};

export default Filtrering;
