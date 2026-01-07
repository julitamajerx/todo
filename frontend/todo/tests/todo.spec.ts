import { test, expect, Page } from '@playwright/test';
import dotenv from 'dotenv';

const testEmail = process.env.TEST_USER_EMAIL || 'fallback@test.pl';
const testPassword = process.env.TEST_USER_PASSWORD || 'default_password';
const loginURL = process.env.TEST_LOGIN_URL || 'http://localhost:4200/#/login';
const name = 'Tester1';
const tagName = `tag-${Date.now()}`;
const listName = `list-${Date.now()}`;
const taskName = `task-${Date.now()}`;

// test('should register and then log in successfully', async ({ page }) => {

//   await page.goto(loginURL);

//   await page.getByRole('link', { name: 'Sign up here' }).click();

//   await page.getByRole('textbox', { name: 'Name:' }).fill(name);
//   await page.getByRole('textbox', { name: 'Email:' }).fill(testEmail);
//   await page.getByRole('textbox', { name: 'Password:' }).fill(testPassword);

//   await page.setInputFiles('input[type="file"]', 'tests/default-avatar.png');

//   await page.getByRole('button', { name: 'Submit' }).click();

//   await expect(page).toHaveURL(/.*login/);

//   await page.getByRole('textbox', { name: 'Email:' }).fill(testEmail);
//   await page.getByRole('textbox', { name: 'Password:' }).fill('123456');
//   await page.getByRole('button', { name: 'Submit' }).click();

//   await expect(page.getByRole('heading', { name: 'Inbox' })).toBeVisible({ timeout: 10000 });

//   await expect(page.getByText(name)).toBeVisible();
// });

async function login(page: Page) {
  await page.goto(loginURL);

  await page.getByRole('textbox', { name: 'Email:' }).click();
  await page.getByRole('textbox', { name: 'Email:' }).fill(testEmail);
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill(testPassword);
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByRole('heading', { name: 'Inbox' })).toBeVisible({ timeout: 10000 });

  await expect(page.getByText(name)).toBeVisible();
}

test('login', async ({ page }) => {
  await login(page);
});

test('add tag', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: '+ Menage Tags' }).click();
  await page.getByRole('textbox', { name: '✚ emoji...' }).click();
  await page.locator('.ng-star-inserted > .emoji-mart-emoji > span').first().click();
  await page.getByRole('textbox', { name: '✚ tag name...' }).click();
  await page.getByRole('textbox', { name: '✚ tag name...' }).fill(tagName);
  await page.locator('app-tags-management button[type="submit"]').click();
  await page.keyboard.press('Escape');

  await expect(page.getByText(tagName)).toBeVisible();
});

test('add list', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: '+ Menage Lists' }).click();
  await page.getByRole('textbox', { name: '✚ Add list...' }).click();
  await page.getByRole('textbox', { name: '✚ Add list...' }).fill(listName);
  await page.locator('app-list-management .add button[type="submit"]').click();
  await page.keyboard.press('Escape');

  await expect(page.getByText(listName)).toBeVisible();
});

test('delete tag', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: '+ Menage Tags' }).click();
  await page.locator('app-tags-management').getByRole('button', { name: 'trash' }).nth(2).click();
  await page.keyboard.press('Escape');
});

test('delete list', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: '+ Menage Lists' }).click();
  await page.locator('app-list-management').getByRole('button', { name: 'trash' }).nth(2).click();
  await page.keyboard.press('Escape');
});

test('add task', async ({ page }) => {
  await login(page);

  await page.getByRole('textbox', { name: '✚ Add task...' }).click();
  await page.getByRole('textbox', { name: '✚ Add task...' }).fill(taskName);
  await page.locator('app-tasks-list .add button[type="submit"]').click();
  await page.locator('label', { hasText: taskName }).click();
  await page.getByRole('button', { name: 'Open date picker' }).click();

  await page.getByRole('button', { name: '✚ tag' }).click();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: '✚ Add Tags' }).click();
  await page.keyboard.press('Escape');

  await page.getByRole('combobox').selectOption('1: 695e33bea6c0928f5cf4e81d');

  await page.locator('.ql-editor').fill('asd');

  await page.getByRole('button', { name: 'save' }).click();

  await page.locator('label', { hasText: taskName }).click();
  await page.getByRole('list').getByRole('checkbox').check();

  await page.locator('div').filter({ hasText: 'Completed' }).nth(3).click();
  await page.locator('label', { hasText: taskName }).click();
  await page.getByRole('button', { name: 'recover' }).click();

  await page.getByText('Inbox').click();
  await page.locator('label', { hasText: taskName }).click();

  await page.getByRole('button', { name: 'delete' }).click();

  await page.locator('div').filter({ hasText: 'Trash' }).nth(3).click();
  await page.locator('label', { hasText: taskName }).click();
  await page.getByRole('button', { name: 'recover' }).click();
});
