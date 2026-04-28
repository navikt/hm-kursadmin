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
});
