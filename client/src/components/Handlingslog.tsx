import { useRef } from 'react';
import { Button, Modal, Process, BodyShort } from '@navikt/ds-react';
import { ClockDashedIcon } from '@navikt/aksel-icons';
import { lagHandlingstekst } from '../helpers/utils';

interface Handling {
	id: string;
	type: 'GODKJENT_DEL2' | 'FJERNET_GODKJENNING';
	personNavn: string;
	kursDato: string;
	tidspunkt: string;
}

interface HandlingslogProps {
	handlinger: Handling[];
}

const Handlingslog = ({ handlinger }: HandlingslogProps) => {
	const ref = useRef<HTMLDialogElement>(null);

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
