import { test, expect } from '@playwright/test';

test('kan bytte kurs med chips', async ({ page }) => {
	await test.step('Gå til hovedside', async () => {
		await page.goto('/');
	});

	await test.step('Verifiser at standard kurs (Elektrisk rullestol) er valgt', async () => {
		const chip = page.getByRole('button', { name: 'Elektrisk rullestol' });
		await expect(chip).toHaveAttribute('aria-pressed', 'true');
	});

	await test.step('Velg Personløfter og seil kurs', async () => {
		await page.getByRole('button', { name: 'Personløfter og seil' }).click();
	});

	await test.step('Verifiser at Personløfter og seil er valgt', async () => {
		const chip = page.getByRole('button', { name: 'Personløfter og seil' });
		await expect(chip).toHaveAttribute('aria-pressed', 'true');
	});

	await test.step('Verifiser at kun én chip er valgt om gangen', async () => {
		const elRullestolChip = page.getByRole('button', { name: 'Elektrisk rullestol' });
		await expect(elRullestolChip).toHaveAttribute('aria-pressed', 'false');
	});

	await test.step('Verifiser ARIA live region oppdatering', async () => {
		const liveRegion = page.locator('[role="status"][aria-live="polite"]').filter({ hasText: 'er valgt' });
		await expect(liveRegion).toContainText('Personløfter og seil');
	});

	await test.step('Bytt til Elektrisk seng', async () => {
		await page.getByRole('button', { name: 'Elektrisk seng' }).click();
	});

	await test.step('Verifiser at Elektrisk seng er valgt', async () => {
		const chip = page.getByRole('button', { name: 'Elektrisk seng' });
		await expect(chip).toHaveAttribute('aria-pressed', 'true');
	});

	await test.step('Velg Bestilling og Batteri', async () => {
		await page.getByRole('button', { name: 'Bestilling' }).click();
		await expect(
			page.getByRole('table').getByText('Siri Marie Testberg'),
		).toBeVisible();
		await expect(page.getByRole('cell', { name: '15.05.2025', exact: true })).toBeVisible();
		await expect(page.getByRole('table').getByRole('row')).toHaveCount(3);
		await expect(page.getByText('Invalid Date')).toHaveCount(0);

		await page.getByRole('button', { name: 'Batteri' }).click();
		await expect(
			page.getByRole('table').getByText('Berit Elise Mockdal'),
		).toBeVisible();
		await expect(page.getByRole('cell', { name: '05.06.2025', exact: true })).toBeVisible();
		await expect(page.getByRole('table').getByRole('row')).toHaveCount(2);
		await expect(page.getByText('Invalid Date')).toHaveCount(0);
	});
});

for (const mobil of [false, true]) {
	test(`viser bestillerkurs uten epost (${mobil ? 'mobil' : 'desktop'})`, async ({ page }) => {
		if (mobil) {
			await page.setViewportSize({ width: 390, height: 844 });
		}
		await page.goto('/');
		await page.getByRole('button', { name: 'Bestilling' }).click();
		const rad = page.getByRole('row').filter({ hasText: 'Testperson Uten Epost' });
		await expect(rad).toBeVisible();
		if (mobil) {
			await rad.getByRole('button').click();
		}
		await expect(page.getByRole('table').getByText('–', { exact: true })).toBeVisible();
		await page.getByRole('searchbox').fill('Uten Testperson');
		await expect(rad).toBeVisible();
		await page.getByRole('searchbox').fill('finnesikke@example.no');
		await expect(page.getByText('Ingen personer funnet')).toBeVisible();
	});
}
