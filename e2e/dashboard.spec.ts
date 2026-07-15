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
    await page.setViewportSize({ width: 600, height: 720 });
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
    await page.setViewportSize({ width: 600, height: 720 });
    await page.goto('/dashboard');
    const sideMenu = page.getByRole('navigation', { name: 'Side menu' });

    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(sideMenu).toBeVisible();
    await page.locator('.side-menu-backdrop').click();

    await expect(sideMenu).not.toBeVisible();
  });

  test('expands and collapses the desktop navigation rail with the burger button', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/dashboard');
    const sideMenu = page.getByRole('navigation', { name: 'Side menu' });
    const menuButton = page.getByRole('button', { name: 'Open menu' });
    const visualLabel = page.locator('.side-navigation-label').first();

    await expect(sideMenu).toBeVisible();
    await expect(visualLabel).toHaveCSS('opacity', '0');

    await menuButton.click();

    await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible();
    await expect(visualLabel).toHaveCSS('opacity', '1');

    await page.getByRole('button', { name: 'Close menu' }).click();

    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
    await expect(visualLabel).toHaveCSS('opacity', '0');
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

  test('shows educational sidebar entries on desktop', async ({ page }) => {
    await page.goto('/dashboard');
    await page.setViewportSize({ width: 1280, height: 720 });

    const sideMenu = page.getByRole('navigation', { name: 'Side menu' });

    await expect(sideMenu).toBeVisible();

    await page.getByRole('button', { name: 'Open menu' }).click();

    await expect(sideMenu.getByText('Dashboard')).toBeVisible();
    await expect(sideMenu.getByText('Syllabus')).toBeVisible();
    await expect(sideMenu.getByText('Profile')).toBeVisible();
    await expect(sideMenu.getByText('Settings')).toBeVisible();
  });

  test('expands Syllabus group and navigates to Progress', async ({ page }) => {
    await page.goto('/dashboard');
    await page.setViewportSize({ width: 1280, height: 720 });

    await page.getByRole('button', { name: 'Open menu' }).click();

    const syllabusButton = page.getByRole('button', { name: 'Syllabus' });
    await syllabusButton.click();
    await expect(page.getByText('My topics')).toBeVisible();
    await expect(page.getByText('Progress')).toBeVisible();

    await page.getByText('Progress').click();
    await expect(page).toHaveURL('/dashboard/syllabus/progress');
  });

  test('expands Tests group and navigates to Mock exams', async ({ page }) => {
    await page.goto('/dashboard');
    await page.setViewportSize({ width: 1280, height: 720 });

    await page.getByRole('button', { name: 'Open menu' }).click();

    const testsButton = page.getByRole('button', { name: 'Tests' });
    await testsButton.click();
    await expect(page.getByText('New test')).toBeVisible();
    await expect(page.getByText('Mock exams')).toBeVisible();

    await page.getByText('Mock exams').click();
    await expect(page).toHaveURL('/dashboard/tests/mock-exams');
  });

  test('shows active link class after navigating to Profile', async ({ page }) => {
    await page.goto('/dashboard');
    await page.setViewportSize({ width: 1280, height: 720 });

    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByText('Profile').click();
    await expect(page).toHaveURL('/dashboard/profile');

    const profileLink = page.locator('[href="/dashboard/profile"].active-link');
    await expect(profileLink).toBeVisible();
  });

  test('closes mobile drawer after selecting a navigation destination', async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 720 });
    await page.goto('/dashboard');
    const sideMenu = page.getByRole('navigation', { name: 'Side menu' });

    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(sideMenu).toBeVisible();

    await page.getByText('Settings').click();
    await expect(page).toHaveURL('/dashboard/settings');
    await expect(sideMenu).not.toBeVisible();
  });

  test('renders safe fallback for unknown dashboard routes', async ({ page }) => {
    await page.goto('/dashboard/unknown-route');

    await expect(page).toHaveURL('/dashboard');
  });
});
