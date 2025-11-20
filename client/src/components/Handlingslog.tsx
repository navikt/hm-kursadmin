import React, { useRef, useState } from 'react';
import { Button, Modal, Process, BodyShort } from '@navikt/ds-react';
import { ClockDashedIcon } from '@navikt/aksel-icons';
import { lagHandlingstekst, lagTidsstempel } from '../helpers/utils';

interface Handling {
	id: string;
	type: 'GODKJENT_DEL2' | 'FJERNET_GODKJENNING';
	personNavn: string;
	kursDato: string;
	tidspunkt: string;
}

declare global {
	interface Window {
		leggTilHandling?: (data: Omit<Handling, 'id' | 'tidspunkt'>) => void;
	}
}

const handlinger: Handling[] = [];

const Handlingslog = () => {
	const ref = useRef<HTMLDialogElement>(null);
	const [, forceUpdate] = useState({});

	React.useEffect(() => {
		window.leggTilHandling = (data: Omit<Handling, 'id' | 'tidspunkt'>) => {
			handlinger.unshift({
				...data,
				id: crypto.randomUUID(),
				tidspunkt: lagTidsstempel(),
			});
			forceUpdate({});
		};
	}, [forceUpdate]);

	return (
		<>
			<Button
				variant="tertiary-neutral"
				icon={<ClockDashedIcon title="Handlingslogg" />}
				size="medium"
				aria-label="Handlingslogg"
				onClick={() => ref.current?.showModal()}
			/>

			<Modal
				placement="top"
				ref={ref}
				header={{
					icon: <ClockDashedIcon aria-hidden />,
					heading: 'Handlingslogg',
				}}
			>
				<Modal.Body>
					{handlinger.length === 0 ? (
						<BodyShort>Ingen handlinger registrert ennå.</BodyShort>
					) : (
						<Process>
							{handlinger.map((handling) => (
								<Process.Event key={handling.id} title={handling.tidspunkt}>
									<BodyShort>{lagHandlingstekst(handling)}</BodyShort>
								</Process.Event>
							))}
						</Process>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button type="button" onClick={() => ref.current?.close()}>
						Lukk
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default Handlingslog;
