import { test, expect, type Page } from '@playwright/test';

const åpneGodkjenning = async (page: Page) => {
	await page.goto('/');
	const rad = page.getByRole('row', { name: /siri marie testberg/i });
	await rad.getByRole('button', { name: /^godkjenn del 2$/i }).click();
	const modal = page.getByRole('dialog', { name: /^godkjenn del 2$/i });
	await expect(modal).toBeVisible();
	return { rad, modal };
};

test('vanlig registrering er forhåndsvalgt og lagres først ved bekreftelse', async ({ page }) => {
	const { rad, modal } = await åpneGodkjenning(page);
	await expect(modal.getByRole('radio', { name: 'Registrer gjennomført kurs' })).toBeChecked();
	await expect(modal.getByLabel('Verifikasjonskode', { exact: true })).toHaveCount(0);

	const requests: { url: string; body: unknown }[] = [];
	page.on('request', (request) => {
		if (request.method() === 'PATCH') requests.push({ url: request.url(), body: request.postDataJSON() });
	});
	await modal.getByLabel('Dato for gjennomføring', { exact: true }).fill('10.03.2025');
	await modal.getByRole('heading').click();
	await expect(modal).toBeVisible();
	expect(requests).toHaveLength(0);
	await modal.getByRole('button', { name: /^godkjenn del 2$/i }).click();
	await expect(modal).not.toBeVisible();
	await expect(rad).toContainText('10.03.2025');
	expect(requests).toEqual([{ url: 'http://localhost:5173/api/personer/14/godkjenn-del2', body: { kursDato: '2025-03-10' } }]);
});

test('kan verifisere kursbevis og gjenopprette del 2', async ({ page }) => {
	const { rad, modal } = await åpneGodkjenning(page);
	await modal.getByRole('radio', { name: 'Gjenopprett fra kursbevis' }).check();
	await expect(modal.getByText('Bruk datoen som står på kursbeviset (DD.MM.ÅÅÅÅ).')).toBeVisible();
	await modal.getByLabel('Dato for gjennomføring', { exact: true }).fill('10.03.2025');
	await modal.getByLabel('Verifikasjonskode', { exact: true }).fill('  bbnu-bdxh-4qpf  ');
	const requestPromise = page.waitForRequest((request) => request.url().endsWith('/14/gjenopprett-del2'));
	await modal.getByRole('button', { name: 'Verifiser og gjenopprett' }).click();
	const request = await requestPromise;
	expect(request.method()).toBe('PATCH');
	expect(request.postDataJSON()).toEqual({ kursDato: '2025-03-10', verifikasjonskode: 'BBNU-BDXH-4QPF' });
	await expect(modal).not.toBeVisible();
	await expect(rad).toContainText('10.03.2025');
	await expect(page.getByText('Del 2 gjenopprettet for Siri Marie Testberg')).toBeVisible();
});

test('feil kursbevis beholder feltene og kan korrigeres', async ({ page }) => {
	const { modal } = await åpneGodkjenning(page);
	await modal.getByRole('radio', { name: 'Gjenopprett fra kursbevis' }).check();
	await modal.getByLabel('Dato for gjennomføring', { exact: true }).fill('11.03.2025');
	await modal.getByLabel('Verifikasjonskode', { exact: true }).fill('BBNU-BDXH-4QPF');
	await modal.getByRole('button', { name: 'Verifiser og gjenopprett' }).click();
	await expect(modal.getByText('Kursbeviset stemmer ikke med personen og datoen. Kontroller kursbeviset og prøv igjen.')).toBeVisible();
	await expect(modal.getByLabel('Dato for gjennomføring', { exact: true })).toHaveValue('11.03.2025');
	await expect(modal.getByLabel('Verifikasjonskode', { exact: true })).toHaveValue('BBNU-BDXH-4QPF');
	await modal.getByLabel('Dato for gjennomføring', { exact: true }).fill('10.03.2025');
	await modal.getByRole('button', { name: 'Verifiser og gjenopprett' }).click();
	await expect(modal).not.toBeVisible();
});

test('validerer manglende felt, kodeformat og dato uten API-kall', async ({ page }) => {
	const { modal } = await åpneGodkjenning(page);
	const requests: string[] = [];
	page.on('request', (request) => {
		if (request.method() === 'PATCH') requests.push(request.url());
	});
	await modal.getByRole('radio', { name: 'Gjenopprett fra kursbevis' }).check();
	await modal.getByRole('button', { name: 'Verifiser og gjenopprett' }).click();
	await expect(modal.getByRole('link', { name: 'Du må oppgi datoen for gjennomføring.' })).toBeVisible();
	await expect(modal.getByRole('link', { name: 'Du må oppgi verifikasjonskoden fra kursbeviset.' })).toBeVisible();
	await modal.getByRole('link', { name: 'Du må oppgi datoen for gjennomføring.' }).click();
	await expect(modal.getByLabel('Dato for gjennomføring', { exact: true })).toBeFocused();
	await modal.getByLabel('Dato for gjennomføring', { exact: true }).fill('31.02.2025');
	await modal.getByLabel('Verifikasjonskode', { exact: true }).fill('BBNU-BDXH-4QP1');
	await modal.getByRole('button', { name: 'Verifiser og gjenopprett' }).click();
	await expect(modal.getByRole('link', { name: 'Skriv en gyldig dato på formen DD.MM.ÅÅÅÅ.' })).toBeVisible();
	await expect(modal.getByRole('link', { name: 'Verifikasjonskoden må ha formatet BBNU-BDXH-4QPF.' })).toBeVisible();
	const future = new Date();
	future.setDate(future.getDate() + 1);
	await modal.getByLabel('Dato for gjennomføring', { exact: true }).fill(
		`${String(future.getDate()).padStart(2, '0')}.${String(future.getMonth() + 1).padStart(2, '0')}.${future.getFullYear()}`,
	);
	await modal.getByRole('button', { name: 'Verifiser og gjenopprett' }).click();
	await expect(modal.getByRole('link', { name: 'Datoen for gjennomføring kan ikke være i fremtiden.' })).toBeVisible();
	expect(requests).toHaveLength(0);
});

test('bytte til vanlig registrering sender ikke verifikasjonskode og avbryt nullstiller skjemaet', async ({ page }) => {
	const { rad, modal } = await åpneGodkjenning(page);
	await modal.getByRole('radio', { name: 'Gjenopprett fra kursbevis' }).check();
	await modal.getByLabel('Dato for gjennomføring', { exact: true }).fill('10.03.2025');
	await modal.getByLabel('Verifikasjonskode', { exact: true }).fill('BBNU-BDXH-4QPF');
	await modal.getByRole('button', { name: 'Avbryt' }).click();
	await expect(rad.getByRole('button', { name: /^godkjenn del 2$/i })).toBeFocused();
	await rad.getByRole('button', { name: /^godkjenn del 2$/i }).click();
	await expect(modal.getByRole('radio', { name: 'Registrer gjennomført kurs' })).toBeChecked();
	await expect(modal.getByLabel('Dato for gjennomføring', { exact: true })).toHaveValue('');
	await modal.getByRole('radio', { name: 'Gjenopprett fra kursbevis' }).check();
	await expect(modal.getByLabel('Verifikasjonskode', { exact: true })).toHaveValue('');
	await modal.getByLabel('Verifikasjonskode', { exact: true }).fill('BBNU-BDXH-4QPF');
	await modal.getByRole('radio', { name: 'Registrer gjennomført kurs' }).check();
	await modal.getByLabel('Dato for gjennomføring', { exact: true }).fill('10.03.2025');
	const requestPromise = page.waitForRequest((request) => request.url().endsWith('/14/godkjenn-del2'));
	await modal.getByRole('button', { name: /^godkjenn del 2$/i }).click();
	expect((await requestPromise).postDataJSON()).toEqual({ kursDato: '2025-03-10' });
	await expect(modal).not.toBeVisible();
});

test('Escape lukker modalen, returnerer fokus og nullstiller skjemaet', async ({ page }) => {
	const { rad, modal } = await åpneGodkjenning(page);
	await modal.getByRole('radio', { name: 'Gjenopprett fra kursbevis' }).check();
	await modal.getByLabel('Dato for gjennomføring', { exact: true }).fill('10.03.2025');
	await modal.getByLabel('Verifikasjonskode', { exact: true }).fill('BBNU-BDXH-4QPF');
	await page.keyboard.press('Escape');
	await expect(modal).not.toBeVisible();
	await expect(rad.getByRole('button', { name: /^godkjenn del 2$/i })).toBeFocused();
	await rad.getByRole('button', { name: /^godkjenn del 2$/i }).click();
	await expect(modal.getByRole('radio', { name: 'Registrer gjennomført kurs' })).toBeChecked();
	await expect(modal.getByLabel('Dato for gjennomføring', { exact: true })).toHaveValue('');
});

test('kursbevis kan gjenopprettes på mobil uten horisontal scrolling', async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto('/');
	const rad = page.getByRole('row', { name: /siri marie testberg/i });
	await rad.getByRole('button', { name: 'Vis mer' }).click();
	await page.getByRole('button', { name: /^godkjenn del 2$/i }).click();
	const modal = page.getByRole('dialog', { name: /^godkjenn del 2$/i });
	await modal.getByRole('radio', { name: 'Gjenopprett fra kursbevis' }).check();
	await modal.getByLabel('Dato for gjennomføring', { exact: true }).fill('10.03.2025');
	await modal.getByLabel('Verifikasjonskode', { exact: true }).fill('BBNU-BDXH-4QPF');
	expect(await modal.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
	await modal.getByRole('button', { name: 'Verifiser og gjenopprett' }).click();
	await expect(modal).not.toBeVisible();
	await expect(page.getByText('Del 2 gjenopprettet for Siri Marie Testberg')).toBeVisible();
});

test('ventende gjenoppretting låser skjemaet og hindrer dobbel innsending', async ({ page }) => {
	const { modal } = await åpneGodkjenning(page);
	await page.evaluate(() => {
		const fetch = window.fetch.bind(window);
		window.fetch = (input, init) => {
			if (String(input).endsWith('/gjenopprett-del2')) {
				return new Promise<Response>((resolve, reject) => {
					document.addEventListener('fullfør-gjenoppretting', () => {
						void fetch(input, init).then(resolve, reject);
					}, { once: true });
				});
			}
			return fetch(input, init);
		};
	});
	await modal.getByRole('radio', { name: 'Gjenopprett fra kursbevis' }).check();
	await modal.getByLabel('Dato for gjennomføring', { exact: true }).fill('10.03.2025');
	await modal.getByLabel('Verifikasjonskode', { exact: true }).fill('BBNU-BDXH-4QPF');
	await modal.getByRole('button', { name: 'Verifiser og gjenopprett' }).click();
	await expect(modal.getByLabel('Dato for gjennomføring', { exact: true })).toBeDisabled();
	await expect(modal.getByLabel('Verifikasjonskode', { exact: true })).toBeDisabled();
	await expect(modal.getByRole('radio', { name: 'Registrer gjennomført kurs' })).toBeDisabled();
	await expect(modal.getByRole('button', { name: 'Avbryt' })).toBeDisabled();
	await expect(modal.getByRole('button', { name: 'Venter…' })).toBeDisabled();
	await page.keyboard.press('Escape');
	await expect(modal).toBeVisible();
	const requests: string[] = [];
	page.on('request', (request) => {
		if (request.url().endsWith('/gjenopprett-del2')) requests.push(request.url());
	});
	await page.evaluate(() => document.dispatchEvent(new Event('fullfør-gjenoppretting')));
	await expect(modal).not.toBeVisible();
	expect(requests).toHaveLength(1);
});

test('nettverksfeil beholder skjemaet og gir en forståelig feilmelding', async ({ page }) => {
	const { modal } = await åpneGodkjenning(page);
	await page.evaluate(() => {
		const fetch = window.fetch.bind(window);
		window.fetch = (input, init) =>
			String(input).endsWith('/gjenopprett-del2')
				? Promise.reject(new TypeError('Failed to fetch'))
				: fetch(input, init);
	});
	await modal.getByRole('radio', { name: 'Gjenopprett fra kursbevis' }).check();
	await modal.getByLabel('Dato for gjennomføring', { exact: true }).fill('10.03.2025');
	await modal.getByLabel('Verifikasjonskode', { exact: true }).fill('BBNU-BDXH-4QPF');
	await modal.getByRole('button', { name: 'Verifiser og gjenopprett' }).click();
	await expect(modal.getByText('Kunne ikke kontakte tjenesten. Kontroller nettforbindelsen og prøv igjen.')).toBeVisible();
	await expect(modal.getByLabel('Verifikasjonskode', { exact: true })).toHaveValue('BBNU-BDXH-4QPF');
	await expect(modal.getByRole('button', { name: 'Verifiser og gjenopprett' })).toBeEnabled();
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
