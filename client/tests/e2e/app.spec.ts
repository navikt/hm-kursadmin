import { test, expect } from '@playwright/test';

test('har korrekt tittel', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/hm-kursadmin/);
});

test('valgt kurs er elektrisk rullestol', async ({ page }) => {
	await page.goto('/');
	await expect(
		page.getByRole('heading', { name: /Godkjenningskurs: Elektrisk rullestol/i }),
	).toBeVisible();
});
