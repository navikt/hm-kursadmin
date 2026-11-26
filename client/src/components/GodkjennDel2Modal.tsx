import { useEffect, useId, useRef, useState } from 'react';
import {
	Button,
	DatePicker,
	ErrorSummary,
	Heading,
	Modal,
	Radio,
	RadioGroup,
	TextField,
	VStack,
	useDatepicker,
} from '@navikt/ds-react';
import { useMutation } from '@tanstack/react-query';
import { BASE_URL, beskrivFeil, formaterTilISODato } from '../helpers/utils';
import { queryClient } from '../queryClient';
import { useVarsel } from '../hooks/useVarsel';
import type { Person } from '../types/person';

type Godkjenningsmetode = 'registrering' | 'kursbevis';

interface Feil {
	kursDato?: string;
	verifikasjonskode?: string;
	server?: string;
}

interface Props {
	person: Person;
	onClose: () => void;
	onClearErrors: () => void;
}

const GodkjennDel2Modal = ({ person, onClose, onClearErrors }: Props) => {
	const [metode, setMetode] = useState<Godkjenningsmetode>('registrering');
	const [verifikasjonskode, setVerifikasjonskode] = useState('');
	const [feil, setFeil] = useState<Feil>({});
	const [datoFeil, setDatoFeil] = useState<string>();
	const modalRef = useRef<HTMLDialogElement>(null);
	const errorSummaryRef = useRef<HTMLDivElement>(null);
	const id = useId();
	const datoId = `${id}-dato`;
	const kodeId = `${id}-kode`;
	const formId = `${id}-form`;
	const { visVarsel } = useVarsel();
	const lukkModal = () => modalRef.current?.close();
	const { datepickerProps, inputProps, selectedDay } = useDatepicker({
		required: true,
		toDate: new Date(),
		onDateChange: () => setFeil({}),
		onValidate: ({ isValidDate, isAfter }) =>
			setDatoFeil(
				isValidDate
					? undefined
					: isAfter
						? 'Datoen for gjennomføring kan ikke være i fremtiden.'
						: 'Skriv en gyldig dato på formen DD.MM.ÅÅÅÅ.',
			),
	});

	useEffect(() => {
		if (Object.keys(feil).length > 0) {
			errorSummaryRef.current?.focus();
		}
	}, [feil]);

	const mutation = useMutation({
		mutationFn: async (body: { kursDato: string; verifikasjonskode?: string }) => {
			const endepunkt =
				metode === 'kursbevis' ? 'gjenopprett-del2' : 'godkjenn-del2';
			const response = await fetch(
				`${BASE_URL}/personer/${person.id}/${endepunkt}`,
				{
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body),
				},
			);
			if (!response.ok) {
				const standardFeil = beskrivFeil(
					response.status,
					metode === 'kursbevis'
						? 'Kunne ikke gjenopprette del 2'
						: 'Kunne ikke godkjenne del 2',
				);
				const contentType = response.headers.get('Content-Type');
				if (contentType?.includes('json')) {
					const data: { detail?: string; message?: string } =
						await response.json();
					throw new Error(data.detail || data.message || standardFeil);
				}
				throw new Error(standardFeil);
			}
		},
		onSuccess: () => {
			onClearErrors();
			visVarsel(
				metode === 'kursbevis'
					? `Del 2 gjenopprettet for ${person.navn}`
					: `Del 2 godkjent for ${person.navn}`,
			);
			lukkModal();
			void queryClient.invalidateQueries({ queryKey: ['personer'] });
		},
		onError: (error) =>
			setFeil({
				server:
					error instanceof TypeError
						? 'Kunne ikke kontakte tjenesten. Kontroller nettforbindelsen og prøv igjen.'
						: error instanceof SyntaxError
							? 'Kunne ikke lese svaret fra tjenesten. Prøv igjen senere.'
							: error.message,
			}),
	});

	const submit = () => {
		const nyeFeil: Feil = {};
		if (!selectedDay) {
			nyeFeil.kursDato = inputProps.value
				? datoFeil || 'Skriv en gyldig dato på formen DD.MM.ÅÅÅÅ.'
				: 'Du må oppgi datoen for gjennomføring.';
		}
		const kode = verifikasjonskode.trim().toUpperCase();
		if (
			metode === 'kursbevis' &&
			!/^[A-Z2-7]{4}-[A-Z2-7]{4}-[A-Z2-7]{4}$/.test(kode)
		) {
			nyeFeil.verifikasjonskode = kode
				? 'Verifikasjonskoden må ha formatet BBNU-BDXH-4QPF.'
				: 'Du må oppgi verifikasjonskoden fra kursbeviset.';
		}
		setFeil(nyeFeil);
		if (Object.keys(nyeFeil).length > 0 || !selectedDay || mutation.isPending) {
			return;
		}
		mutation.mutate({
			kursDato: formaterTilISODato(selectedDay),
			...(metode === 'kursbevis' ? { verifikasjonskode: kode } : {}),
		});
	};

	return (
		<Modal
			ref={modalRef}
			open
			onClose={onClose}
			onBeforeClose={() => !mutation.isPending}
			header={{
				heading: 'Godkjenn del 2',
				size: 'medium',
				closeButton: false,
			}}
			width="medium"
		>
			<Modal.Body>
				<form
					id={formId}
					noValidate
					onSubmit={(event) => {
						event.preventDefault();
						submit();
					}}
				>
					<VStack gap="4">
						<Heading size="medium" level="2" spacing>
							{person.navn}
						</Heading>
						<RadioGroup
							legend="Hvordan skal del 2 godkjennes?"
							value={metode}
							disabled={mutation.isPending}
							onChange={(value: Godkjenningsmetode) => {
								setMetode(value);
								setFeil({});
							}}
						>
							<Radio value="registrering">Registrer gjennomført kurs</Radio>
							<Radio value="kursbevis">Gjenopprett fra kursbevis</Radio>
						</RadioGroup>
						<DatePicker
							{...datepickerProps}
							open={mutation.isPending ? false : datepickerProps.open}
							dropdownCaption
						>
							<DatePicker.Input
								{...inputProps}
								id={datoId}
								label="Dato for gjennomføring"
								description={
									metode === 'kursbevis'
										? 'Bruk datoen som står på kursbeviset (DD.MM.ÅÅÅÅ).'
										: 'Oppgi datoen da del 2 ble gjennomført (DD.MM.ÅÅÅÅ).'
								}
								disabled={mutation.isPending}
								error={feil.kursDato}
							/>
						</DatePicker>
						{metode === 'kursbevis' && (
							<TextField
								id={kodeId}
								htmlSize={22}
								label="Verifikasjonskode"
								description="Skriv koden fra kursbeviset, for eksempel BBNU-BDXH-4QPF."
								value={verifikasjonskode}
								onChange={(event) => {
									setVerifikasjonskode(event.target.value);
									setFeil({});
								}}
								autoComplete="off"
								spellCheck={false}
								disabled={mutation.isPending}
								error={feil.verifikasjonskode}
							/>
						)}
						{Object.keys(feil).length > 0 && (
							<ErrorSummary ref={errorSummaryRef}>
								{feil.kursDato && (
									<ErrorSummary.Item href={`#${datoId}`}>
										{feil.kursDato}
									</ErrorSummary.Item>
								)}
								{feil.verifikasjonskode && (
									<ErrorSummary.Item href={`#${kodeId}`}>
										{feil.verifikasjonskode}
									</ErrorSummary.Item>
								)}
								{feil.server && (
									<ErrorSummary.Item>{feil.server}</ErrorSummary.Item>
								)}
							</ErrorSummary>
						)}
					</VStack>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<Button type="submit" form={formId} loading={mutation.isPending}>
					{metode === 'kursbevis' ? 'Verifiser og gjenopprett' : 'Godkjenn del 2'}
				</Button>
				<Button
					type="button"
					variant="secondary-neutral"
					onClick={lukkModal}
					disabled={mutation.isPending}
				>
					Avbryt
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default GodkjennDel2Modal;
