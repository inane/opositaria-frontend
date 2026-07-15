import { expect, test } from '@playwright/test';

test.describe('The study spaces dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => localStorage.setItem('opositaria_token', 'test-token'));
  });

  test('redirects visitors from the root path to the dashboard', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: 'Opositaria' })).toBeVisible();
  });

  test('shows study spaces dashboard without a side navigation menu', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByRole('heading', { name: 'Opositaria' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Side menu' })).not.toBeVisible();
    await expect(page.getByRole('tablist', { name: 'Study space filters' })).toBeVisible();
  });

  test('displays filter tabs for all, my spaces, and featured', async ({ page }) => {
    await page.goto('/dashboard');

    const tabs = page.getByRole('tablist', { name: 'Study space filters' });
    await expect(tabs.getByRole('tab', { name: 'All' })).toBeVisible();
    await expect(tabs.getByRole('tab', { name: 'My spaces' })).toBeVisible();
    await expect(tabs.getByRole('tab', { name: 'Featured' })).toBeVisible();
  });

  test('shows a create-new button on the dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByRole('button', { name: /create/i }).first()).toBeVisible();
  });

  test('creates a saved study space after uploading an accepted source', async ({ page }) => {
    await page.goto('/dashboard');

    await page.getByRole('button', { name: /create/i }).first().click();
    await expect(page.getByText('Upload your study source')).toBeVisible();
    await page.getByLabel('Upload source').setInputFiles({
      name: 'exam.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('pdf content'),
    });
    await page.getByRole('button', { name: 'Start ingestion' }).click();
    await page.getByTestId('refresh-ingestion').click();
    await page.getByTestId('refresh-ingestion').click();

    await expect(page.getByRole('heading', { name: 'Save study space' })).toBeVisible();
    await page.getByLabel('Study space name').fill('Constitución Española');
    await page.getByRole('button', { name: 'Save study space' }).click();

    await expect(page.getByText('Constitución Española')).toBeVisible();
    await expect(page.getByText('1 source')).toBeVisible();
  });

  test('renders safe fallback for unknown dashboard routes', async ({ page }) => {
    await page.goto('/dashboard/unknown-route');

    await expect(page).toHaveURL('/dashboard');
  });

  test('does not expose source ingestion as a standalone route', async ({ page }) => {
    await page.goto('/source-ingestion');

    await expect(page.getByText('Upload your study source')).not.toBeVisible();
  });
});
