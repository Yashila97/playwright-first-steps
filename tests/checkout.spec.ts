import { test, expect } from '@playwright/test';

/**
 * Four tests against Swag Labs, a public practice site.
 *
 * This is a learning exercise, not a framework. No page objects, no fixtures,
 * no CI — those come later and adding them now would be cargo-culting a
 * structure I do not yet understand well enough to defend.
 *
 * What I am practising here is expressing checks I already know how to do by
 * hand. The assertions are the part I brought with me; the syntax is the part
 * I am learning.
 */

test('a customer can log in', async ({ page }) => {
  await page.goto('/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page.locator('.inventory_list')).toBeVisible();
});

test('invalid credentials are refused', async ({ page }) => {
  await page.goto('/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('wrong_password');
  await page.locator('#login-button').click();

  await expect(page.locator('[data-test="error"]')).toContainText('do not match');
  // Still on the login page - a refused login that navigates anyway would be
  // a real defect and is easy to miss if you only assert the message.
  await expect(page.locator('#login-button')).toBeVisible();
});

test('an item added to the cart appears in the cart', async ({ page }) => {
  await page.goto('/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await page.locator('.inventory_item').first()
    .getByRole('button', { name: 'Add to cart' }).click();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});

test('the checkout total equals subtotal plus tax', async ({ page }) => {
  await page.goto('/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await page.locator('.inventory_item').first()
    .getByRole('button', { name: 'Add to cart' }).click();
  await page.locator('.shopping_cart_link').click();
  await page.locator('#checkout').click();

  await page.locator('#first-name').fill('Naga');
  await page.locator('#last-name').fill('Araveti');
  await page.locator('#postal-code').fill('CV1 2TT');
  await page.locator('#continue').click();

  // The one test here I actually care about. A checkout that shows the wrong
  // total is invisible to a test that only checks the confirmation page
  // appeared, and on a payment journey it is the defect that matters most.
  const parse = async (selector: string) => {
    const text = await page.locator(selector).innerText();
    const match = text.match(/\$([\d.]+)/);
    expect(match, `no amount found in "${text}"`).not.toBeNull();
    return Number(match![1]);
  };

  const subtotal = await parse('.summary_subtotal_label');
  const tax = await parse('.summary_tax_label');
  const total = await parse('.summary_total_label');

  expect(total).toBeCloseTo(subtotal + tax, 2);
});
