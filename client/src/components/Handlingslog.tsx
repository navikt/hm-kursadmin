import { useRef } from 'react';
import { Button, Modal, Process, BodyShort } from '@navikt/ds-react';
import { ClockDashedIcon } from '@navikt/aksel-icons';
import type { Handling } from '../types/handling';
import { lagHandlingstekst } from '../helpers/utils';

interface Props {
	handlinger: Handling[];
}

const Handlingslog = ({ handlinger }: Props) => {
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
