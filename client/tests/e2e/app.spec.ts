import { test, expect } from '@playwright/test';

test('har korrekt tittel', async ({ page }) => {
	await test.step('Gå til hovedside', async () => {
		await page.goto('/');
	});

	await test.step('Verifiser tittel', async () => {
		await expect(page).toHaveTitle(/Godkjenningskurs - fullførte kurs/);
	});
});

test('viser elektrisk rullestol som standard kurs', async ({ page }) => {
	await test.step('Gå til hovedside', async () => {
		await page.goto('/');
	});

	await test.step('Verifiser at elektrisk rullestol vises', async () => {
		await expect(
			page.getByRole('heading', {
				name: /Godkjenningskurs: Elektrisk rullestol/i,
			}),
		).toBeVisible();
	});
});
