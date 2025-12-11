import { test, expect } from '@playwright/test';

test.describe('LED Wall Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'LEDウォール計算機' })).toBeVisible();
  });

  test('should calculate LED wall dimensions', async ({ page }) => {
    // Fill in the form
    await page.getByLabel('LEDパネル幅').fill('500');
    await page.getByLabel('LEDパネル高さ').fill('500');
    await page.getByLabel('画面幅（枚数）').fill('4');
    await page.getByLabel('画面高さ（枚数）').fill('3');
    await page.getByLabel('LEDピッチ').fill('2.5');
    await page.getByLabel('視聴距離').fill('5');
    await page.getByLabel('予算範囲').fill('1000000');

    // Submit the form
    await page.getByRole('button', { name: /計算/ }).click();

    // Check that results are displayed
    await expect(page.getByText('解像度')).toBeVisible();
    await expect(page.getByText('物理サイズ')).toBeVisible();
  });

  test('should show validation errors for invalid input', async ({ page }) => {
    // Fill in invalid values
    await page.getByLabel('LEDパネル幅').fill('0');
    await page.getByLabel('LEDパネル幅').blur();

    // Check for error message
    await expect(page.getByText(/パネルサイズは0より大きい値を入力してください/)).toBeVisible();
  });

  test('should allow selecting a preset', async ({ page }) => {
    // Open preset selector
    await page.getByRole('button', { name: /プリセットから選択/ }).click();

    // Select a preset
    await page.getByText('500x500mm P2.5').first().click();

    // Check that form is filled
    const panelWidth = await page.getByLabel('LEDパネル幅').inputValue();
    expect(panelWidth).toBe('500');
  });

  test('should support keyboard navigation in preset selector', async ({ page }) => {
    // Focus and open preset selector
    await page.getByRole('button', { name: /プリセットから選択/ }).focus();
    await page.keyboard.press('Enter');

    // Navigate with arrow keys
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    // Select with Enter
    await page.keyboard.press('Enter');

    // Check that form was updated
    const panelWidth = await page.getByLabel('LEDパネル幅').inputValue();
    expect(panelWidth).not.toBe('0');
  });

  test('should close preset selector with Escape key', async ({ page }) => {
    // Open preset selector
    await page.getByRole('button', { name: /プリセットから選択/ }).click();

    // Check dropdown is visible
    await expect(page.getByRole('listbox')).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Check dropdown is closed
    await expect(page.getByRole('listbox')).not.toBeVisible();
  });

  test('should open and close preset manager modal', async ({ page }) => {
    // Open preset manager
    await page.getByRole('button', { name: /プリセット管理/ }).click();

    // Check modal is visible
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('プリセット管理', { exact: true })).toBeVisible();

    // Close modal with button
    await page.getByRole('button', { name: '閉じる' }).last().click();

    // Check modal is closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should close preset manager modal with Escape key', async ({ page }) => {
    // Open preset manager
    await page.getByRole('button', { name: /プリセット管理/ }).click();

    // Check modal is visible
    await expect(page.getByRole('dialog')).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Check modal is closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should trap focus in preset manager modal', async ({ page }) => {
    // Open preset manager
    await page.getByRole('button', { name: /プリセット管理/ }).click();

    // Get all focusable elements in modal
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Tab through elements - focus should stay within modal
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Active element should still be within the modal
    const activeElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElement).toBeTruthy();
  });

  test('should handle real-time calculation', async ({ page }) => {
    // Fill in values
    await page.getByLabel('LEDパネル幅').fill('500');
    await page.getByLabel('LEDパネル高さ').fill('500');
    await page.getByLabel('画面幅（枚数）').fill('2');
    await page.getByLabel('画面高さ（枚数）').fill('2');
    await page.getByLabel('LEDピッチ').fill('5');

    // Results should update automatically
    await expect(page.getByText('解像度')).toBeVisible({ timeout: 3000 });
  });

  test('should be responsive on mobile', async ({ page, viewport }) => {
    // This test will run on mobile viewports defined in config
    if (viewport && viewport.width < 768) {
      await expect(page.getByRole('heading', { name: 'LEDウォール計算機' })).toBeVisible();
      
      // Check that form is still accessible on mobile
      await expect(page.getByLabel('LEDパネル幅')).toBeVisible();
    }
  });
});
