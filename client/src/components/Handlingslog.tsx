import { useRef } from 'react';
import { Button, Modal, BodyLong, Process, BodyShort } from '@navikt/ds-react';
import { ClockDashedIcon } from '@navikt/aksel-icons';

const Handlingslog = () => {
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
					<BodyLong>
						<Process>
							<Process.Event title="02. Jan. 2020. klokken 10:21">
								Din utbetalingsplan har blitt oppdatert, les vedtaket for mer
								informasjon
							</Process.Event>
							<Process.Event title="27. Des. 2019. klokken 14:48">
								<BodyShort>Livsopphold, Husleie er ferdig behandlet</BodyShort>
								<BodyShort textColor="subtle" size="small">
									Et brev fra veileder følger med denne hendelsen
								</BodyShort>
							</Process.Event>
							<Process.Event title="21. Des. 2019. klokken 16:52">
								Du har sendt 10 vedlegg til NAV
							</Process.Event>
						</Process>
					</BodyLong>
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
