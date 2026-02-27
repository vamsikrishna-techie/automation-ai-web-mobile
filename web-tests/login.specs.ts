import { test, expect } from '@playwright/test';

test('SauceDemo - successful login', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();

  await expect(page).toHaveURL(/inventory/);
  await expect(page.getByTestId('inventory-container')).toBeVisible();
});