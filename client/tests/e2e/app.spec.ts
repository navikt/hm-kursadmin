import { test, expect } from '@playwright/test';

test('har korrekt tittel', async ({ page }) => {
	await test.step('Gå til hovedside', async () => {
		await page.goto('/');
	});

	await test.step('Verifiser tittel', async () => {
		await expect(page).toHaveTitle(/Godkjenningskurs - fullførte kurs/);
	});
});

test('Viser header', async ({ page }) => {
	await test.step('Gå til hovedside', async () => {
		await page.goto('/');
	});

	await test.step('Viser header for siden', async () => {
		await expect(
			page.getByRole('heading', {
				name: /Godkjenningskurs - fullførte kurs/i,
			}),
		).toBeVisible();
	});
});
