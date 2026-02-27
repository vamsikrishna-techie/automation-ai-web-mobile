import { test, expect } from '@playwright/test';

test('SauceDemo - complete checkout flow', async ({ page }) => {
  // Step 1: Go to login page
  await page.goto('https://www.saucedemo.com/');

  // Step 2: Login
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();

  // Step 3: Verify inventory page loaded
  await expect(page).toHaveURL(/inventory/);
  await expect(page.getByTestId('inventory-container')).toBeVisible();

  // Step 4: Add item to cart
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();

  // Step 5: Open cart
  await page.getByTestId('shopping-cart-link').click();

  // Step 6: Verify item is in cart
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();

  // Step 7: Click checkout
  await page.getByTestId('checkout').click();

  // Step 8: Fill checkout info
  await page.getByTestId('firstName').fill('John');
  await page.getByTestId('lastName').fill('Doe');
  await page.getByTestId('postalCode').fill('98052');

  // Step 9: Continue
  await page.getByTestId('continue').click();

  // Step 10: Finish checkout
  await page.getByTestId('finish').click();

  // Step 11: Verify success message
  await expect(page.getByText('Thank you for your order!')).toBeVisible();

});