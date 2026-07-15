import { expect, test } from '@playwright/test';

test.describe('The login page', () => {
  test('redirects unauthenticated root path to login', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: 'Opositaria' })).toBeVisible();
  });

  test('shows a USUARIO field, PASSWORD field, Recordar password checkbox, and login button', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('textbox', { name: 'USUARIO' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'PASSWORD' })).toBeVisible();
    await expect(page.getByRole('checkbox')).toBeVisible();
    await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible();
  });

  test('shows an error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('textbox', { name: 'USUARIO' }).fill('wrong@example.com');
    await page.getByRole('textbox', { name: 'PASSWORD' }).fill('wrongpassword');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('redirects authenticated users from login to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => localStorage.setItem('opositaria_token', 'test-token'));

    await page.goto('/');

    await expect(page).toHaveURL('/dashboard');
  });
});