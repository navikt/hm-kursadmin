import { useState } from 'react';
import { Button, DatePicker, ActionMenu } from '@navikt/ds-react';
import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import FjernGodkjenningModal from './FjernGodkjenningModal';
import type { Person } from '../types/person';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../queryClient';
import { formaterTilISODato, BASE_URL, beskrivFeil } from '../helpers/utils';
import { useMobile } from '../helpers/useMobile';

interface Props {
	person: Person;
	del2Dato: string | null;
	onError: (errorMessage: string) => void;
	onClearErrors: () => void;
}

const GodkjennEllerFjernGodkjenning = ({
	person,
	del2Dato,
	onError,
	onClearErrors,
}: Props) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [datePickerOpen, setDatePickerOpen] = useState(false);
	const isMobile = useMobile();

	const erDatoIFremtiden = (date: Date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return date > today;
	};

	const godkjennDel2Mutation = useMutation({
		mutationFn: async (kursDato: string) => {
			const response = await fetch(
				`${BASE_URL}/personer/${person.id}/godkjenn-del2`,
				{
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ kursDato }),
				},
			);
			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				throw new Error(
					errorData?.message ||
						beskrivFeil(response.status, 'Kunne ikke godkjenne del 2'),
				);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['personer'] });
			setDatePickerOpen(false);
			onClearErrors();
		},
		onError: (error) => {
			onError(error.message);
		},
	});

	if (del2Dato) {
		return (
			<>
				<FjernGodkjenningModal
					person={person}
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					onConfirm={() => setModalOpen(false)}
					onError={onError}
					onClearErrors={onClearErrors}
				/>
				{isMobile ? (
					<Button
						variant="secondary-neutral"
						size="small"
						onClick={() => setModalOpen(true)}
					>
						Fjern godkjenning
					</Button>
				) : (
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
				)}
			</>
		);
	}

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
};
export default GodkjennEllerFjernGodkjenning;
