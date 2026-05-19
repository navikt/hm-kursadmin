import { useState } from 'react';
import { Checkbox, Heading } from '@navikt/ds-react';
import { useQueryClient } from '@tanstack/react-query';
import { KursadminRolle } from '../../types/kursadminbruker';
import styles from './RolleSwitcher.module.css';

const RolleSwitcher = () => {
	const queryClient = useQueryClient();
	const [kanRedigere, setKanRedigere] = useState(true);

	const handleEndring = (checked: boolean) => {
		setKanRedigere(checked);
		const roller = checked
			? [KursadminRolle.LESE, KursadminRolle.REDIGERE]
			: [KursadminRolle.LESE];
		queryClient.setQueryData(['meg'], { roller });
	};

	return (
		<div className={styles.wrapper}>
			<Heading size="xsmall">[DEBUG]</Heading>
			<Checkbox
				size="small"
				checked={kanRedigere}
				onChange={(e) => handleEndring(e.target.checked)}
				tabIndex={-1}
			>
				HotKurs
			</Checkbox>
		</div>
	);
};

export default RolleSwitcher;
