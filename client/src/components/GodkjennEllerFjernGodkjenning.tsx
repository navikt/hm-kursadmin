import { useState } from 'react';
import { Button, DatePicker, ActionMenu } from '@navikt/ds-react';
import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import FjernGodkjenningModal from './FjernGodkjenningModal';
import type { Person } from '../types/person';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../queryClient';
import { formaterTilISODato } from '../helpers/utils';

interface Props {
	person: Person;
	del2Dato: string | null;
	onError: (errorMessage: string) => void;
	onClearErrors: () => void;
	onLeggTilHandling: (data: {
		type: 'GODKJENT_DEL2' | 'FJERNET_GODKJENNING';
		personNavn: string;
		kursDato: string;
	}) => void;
}

const GodkjennEllerFjernGodkjenning = ({
	person,
	del2Dato,
	onError,
	onClearErrors,
	onLeggTilHandling,
}: Props) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [datePickerOpen, setDatePickerOpen] = useState(false);

	const erDatoIFremtiden = (date: Date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return date > today;
	};

	const godkjennDel2Mutation = useMutation({
		mutationFn: (kursDato: string) => {
			return fetch(`/api/personer/${person.id}/godkjenn-del2`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ kursDato }),
			}).then((response) => {
				if (!response.ok) {
					return response
						.json()
						.catch(() => ({ message: 'Ukjent feil' }))
						.then((errorData) => {
							throw new Error(
								errorData.message ||
									`HTTP ${response.status}: ${response.statusText}`
							);
						});
				}
				return response.json();
			});
		},
		onSuccess: (_, kursDato) => {
			queryClient.invalidateQueries({ queryKey: ['personer'] });
			setDatePickerOpen(false);
			onClearErrors();

			onLeggTilHandling({
				type: 'GODKJENT_DEL2',
				personNavn: person.navn,
				kursDato: kursDato,
			});
		},
		onError: (error) => {
			onError(`Kunne ikke godkjenne del 2: ${error.message}`);
		},
	});

	if (!del2Dato) {
		return (
			<DatePicker
				onSelect={(date) => {
					if (date) {
						const kursDato = formaterTilISODato(date);
						godkjennDel2Mutation.mutate(kursDato);
					}
				}}
				mode="single"
				onClose={() => setDatePickerOpen(false)}
				open={datePickerOpen}
				disabled={[erDatoIFremtiden]}
			>
				<Button
					size="small"
					variant="primary-neutral"
					onClick={() => setDatePickerOpen(!datePickerOpen)}
					loading={godkjennDel2Mutation.isPending}
				>
					{datePickerOpen ? 'Avbryt' : 'Godkjenn del 2'}
				</Button>
			</DatePicker>
		);
	} else {
		return (
			<>
				<FjernGodkjenningModal
					person={person}
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					onConfirm={() => setModalOpen(false)}
					onError={onError}
					onClearErrors={onClearErrors}
					onLeggTilHandling={onLeggTilHandling}
				/>
				<ActionMenu>
					<ActionMenu.Trigger>
						<Button
							variant="tertiary-neutral"
							icon={<MenuElipsisVerticalIcon title="Handlinger" />}
							size="small"
							aria-label="Handlinger"
						/>
					</ActionMenu.Trigger>
					<ActionMenu.Content>
						<ActionMenu.Item onSelect={() => setModalOpen(true)}>
							Fjern godkjenning
						</ActionMenu.Item>
					</ActionMenu.Content>
				</ActionMenu>
			</>
		);
	}
};
export default GodkjennEllerFjernGodkjenning;
