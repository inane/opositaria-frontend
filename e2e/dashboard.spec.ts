import { expect, test } from '@playwright/test';

test.describe('The dashboard home shell', () => {
  test('redirects visitors from the root path to the dashboard', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('opens and closes the mobile side menu with the burger button', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 720 });
    await page.goto('/dashboard');
    const menuButton = page.getByRole('button', { name: 'Open menu' });
    const sideMenu = page.getByRole('navigation', { name: 'Side menu' });

    await expect(sideMenu).not.toBeVisible();
    await menuButton.click();
    await expect(sideMenu).toBeVisible();
    await page.getByRole('button', { name: 'Close menu' }).click();

    await expect(sideMenu).not.toBeVisible();
  });

  test('closes the mobile side menu by clicking outside the panel', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 720 });
    await page.goto('/dashboard');
    const sideMenu = page.getByRole('navigation', { name: 'Side menu' });

    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(sideMenu).toBeVisible();
    await page.locator('.side-menu-backdrop').click();

    await expect(sideMenu).not.toBeVisible();
  });

  test('expands and collapses the desktop navigation rail with the burger button', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/dashboard');
    const sideMenu = page.getByRole('navigation', { name: 'Side menu' });
    const menuButton = page.getByRole('button', { name: 'Open menu' });
    const visualLabel = page.locator('.side-navigation-label');

    await expect(sideMenu).toBeVisible();
    await expect(visualLabel).not.toBeVisible();

    await menuButton.click();

    await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible();
    await expect(visualLabel).toBeVisible();

    await page.getByRole('button', { name: 'Close menu' }).click();

    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
    await expect(visualLabel).not.toBeVisible();
  });

  test('displays the source ingestion upload experience on the dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByText('Upload your study source')).toBeVisible();
    await expect(page.getByText('Source file')).toBeVisible();
  });

  test('does not expose source ingestion as a standalone route', async ({ page }) => {
    await page.goto('/source-ingestion');

    await expect(page.getByText('Upload your study source')).not.toBeVisible();
    await expect(page.getByRole('banner')).not.toBeVisible();
  });
});
