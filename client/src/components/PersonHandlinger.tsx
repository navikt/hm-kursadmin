import { useState } from 'react';
import { MenuElipsisVerticalIcon, PersonCrossIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';
import type { Person } from '../types/person';
import FjernGodkjenningModal from './FjernGodkjenningModal';
import { FjernPersonModal } from './FjernPerson';

interface Props {
	person: Person;
	erElektriskRullestol: boolean;
	onError: (errorMessage: string) => void;
	onClearErrors: () => void;
}

const PersonHandlinger = ({
	person,
	erElektriskRullestol,
	onError,
	onClearErrors,
}: Props) => {
	const [fjernGodkjenningModalOpen, setFjernGodkjenningModalOpen] =
		useState(false);
	const [fjernPersonModalOpen, setFjernPersonModalOpen] = useState(false);

	return (
		<>
			<FjernGodkjenningModal
				person={person}
				open={fjernGodkjenningModalOpen}
				onClose={() => setFjernGodkjenningModalOpen(false)}
				onConfirm={() => setFjernGodkjenningModalOpen(false)}
				onError={onError}
				onClearErrors={onClearErrors}
			/>
			<FjernPersonModal
				person={person}
				open={fjernPersonModalOpen}
				onClose={() => setFjernPersonModalOpen(false)}
				onError={onError}
				onClearErrors={onClearErrors}
			/>
			<ActionMenu>
				<ActionMenu.Trigger>
					<Button
						variant="tertiary-neutral"
						icon={<MenuElipsisVerticalIcon title="Handlinger for person" />}
						size="small"
						aria-label={`Handlinger for ${person.navn}`}
					/>
				</ActionMenu.Trigger>
				<ActionMenu.Content>
					{erElektriskRullestol && person.del2Dato && (
						<ActionMenu.Item
							onSelect={() => setFjernGodkjenningModalOpen(true)}
						>
							Fjern godkjenning
						</ActionMenu.Item>
					)}
					<ActionMenu.Item
						variant="danger"
						icon={<PersonCrossIcon aria-hidden />}
						onSelect={() => setFjernPersonModalOpen(true)}
					>
						Fjern person fra Hotkurs
					</ActionMenu.Item>
				</ActionMenu.Content>
			</ActionMenu>
		</>
	);
};

export default PersonHandlinger;
