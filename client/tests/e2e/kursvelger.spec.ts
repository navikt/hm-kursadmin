import { test, expect } from '@playwright/test';

test('kan bytte kurs', async ({ page }) => {
	await test.step('Gå til hovedside', async () => {
		await page.goto('/');
	});

	await test.step('Velg Personløfter kurs', async () => {
		const kursvelger = page.getByLabel(/velg godkjenningskurs/i);
		await kursvelger.selectOption('2');
	});

	await test.step('Verifiser at Personløfter vises', async () => {
		await expect(
			page.getByRole('heading', {
				name: /Godkjenningskurs: Personløfter/i,
			}),
		).toBeVisible();
	});
});
