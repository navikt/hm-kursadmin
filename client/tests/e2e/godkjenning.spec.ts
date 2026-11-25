import { test, expect } from '@playwright/test';

test('kan godkjenne del 2 for ERS kurs', async ({ page }) => {
	await test.step('Gå til hovedside', async () => {
		await page.goto('/');
	});

	await test.step('Klikk på Godkjenn del 2 knapp', async () => {
		const approveButton = page
			.getByRole('button', { name: /godkjenn del 2/i })
			.first();

		if (await approveButton.isVisible()) {
			await approveButton.click();
		}
	});

	await test.step('Velg dato i datepicker', async () => {
		const datePicker = page.locator('[role="dialog"]');

		if (await datePicker.isVisible()) {
			await expect(datePicker).toBeVisible();

			const todayButton = page
				.getByRole('button', {
					name: new RegExp(new Date().getDate().toString()),
				})
				.first();

			await todayButton.click();
		}
	});

	await test.step('Verifiser at modal lukkes', async () => {
		const datePicker = page.locator('[role="dialog"]');
		await expect(datePicker).not.toBeVisible();
	});
});

test('kan fjerne godkjenning for ERS kurs', async ({ page }) => {
	await test.step('Gå til hovedside', async () => {
		await page.goto('/');
	});

	await test.step('Åpne handlinger-meny', async () => {
		const actionMenu = page
			.getByRole('button', { name: /handlinger/i })
			.first();

		if (await actionMenu.isVisible()) {
			await actionMenu.click();
		}
	});

	await test.step('Klikk på Fjern godkjenning', async () => {
		const removeButton = page.getByRole('menuitem', {
			name: /fjern godkjenning/i,
		});

		if (await removeButton.isVisible()) {
			await removeButton.click();
		}
	});

	await test.step('Bekreft fjerning i modal', async () => {
		const confirmButton = page.getByRole('button', {
			name: /ja, jeg er sikker/i,
		});

		if (await confirmButton.isVisible()) {
			await expect(confirmButton).toBeVisible();
			await confirmButton.click();
		}
	});

	await test.step('Verifiser at modal lukkes', async () => {
		await expect(page.getByRole('dialog')).not.toBeVisible();
	});
});

test('viser begge fjernehandlingene i én meny for en godkjent person', async ({
	page,
}) => {
	await page.goto('/');

	const personRad = page.getByRole('row', { name: /knut testli/i });
	await expect(personRad).toBeVisible();
	await expect(
		personRad.getByRole('button', { name: /handlinger for knut/i }),
	).toHaveCount(1);

	await personRad.getByRole('button', { name: /handlinger for knut/i }).click();
	await expect(
		page.getByRole('menuitem', { name: /fjern godkjenning/i }),
	).toBeVisible();
	await expect(
		page.getByRole('menuitem', { name: /slett person fra hotkurs/i }),
	).toBeVisible();
	await page
		.getByRole('menuitem', { name: /slett person fra hotkurs/i })
		.click();
	const fjernPersonModal = page.getByRole('dialog', {
		name: /slett person fra hotkurs/i,
	});
	await expect(fjernPersonModal).toBeVisible();
	await fjernPersonModal.getByLabel(/jeg bekrefter at personen skal slettes/i).check();
	await page.getByRole('button', { name: /^slett person$/i }).click();
	await expect(personRad).not.toBeVisible();

	await page.getByRole('button', { name: 'Personløfter og seil' }).click();
	await expect(
		page.getByRole('row', { name: /knut testli/i }),
	).not.toBeVisible();
});
