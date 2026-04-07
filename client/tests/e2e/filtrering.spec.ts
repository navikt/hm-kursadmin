import { test, expect } from '@playwright/test';

test('kan søke på navn', async ({ page }) => {
	await test.step('Gå til hovedside', async () => {
		await page.goto('/');
	});

	await test.step('Søk etter person', async () => {
		const searchInput = page.getByRole('searchbox');
		await searchInput.fill('Ola');
	});

	await test.step('Verifiser at tabell vises', async () => {
		await expect(page.getByRole('table')).toBeVisible();
	});
});

test('kan filtrere på hjelpemiddelsentral', async ({ page }) => {
	await test.step('Gå til hovedside', async () => {
		await page.goto('/');
	});

	await test.step('Velg hjelpemiddelsentral', async () => {
		const hmsFilter = page.getByLabel(/velg hjelpemiddelsentral/i);
		await hmsFilter.selectOption({ index: 1 });
	});

	await test.step('Verifiser at tabell vises med filtrering', async () => {
		await expect(page.getByRole('table')).toBeVisible();
	});
});

test('kan filtrere på status del 2 (ERS kurs)', async ({ page }) => {
	await test.step('Gå til hovedside', async () => {
		await page.goto('/');
	});

	await test.step('Velg status del 2 filter', async () => {
		const statusFilter = page.getByRole('combobox', { name: /status del 2/i });

		if (await statusFilter.isVisible()) {
			await statusFilter.click();
			await page.getByRole('option', { name: /ikke fullført/i }).click();
		}
	});

	await test.step('Verifiser at tabell vises med filtrering', async () => {
		await expect(page.getByRole('table')).toBeVisible();
	});
});

test('kan nullstille filtre', async ({ page }) => {
	await test.step('Gå til hovedside', async () => {
		await page.goto('/');
	});

	await test.step('Søk etter person', async () => {
		await page.getByRole('searchbox').fill('Test');
	});

	await test.step('Nullstill filtre', async () => {
		const resetButton = page.getByRole('button', { name: /nullstill/i });
		await resetButton.click();
	});

	await test.step('Verifiser at søkefelt er tomt', async () => {
		await expect(page.getByRole('searchbox')).toHaveValue('');
	});
});
