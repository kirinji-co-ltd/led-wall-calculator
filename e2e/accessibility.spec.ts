import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have accessible form inputs', async ({ page }) => {
    await page.goto('/');

    // Check that all form inputs have associated labels
    const inputs = await page.locator('input[type="number"]').all();
    
    for (const input of inputs) {
      const label = await input.getAttribute('aria-label') || 
                    await input.evaluate((el) => {
                      const id = el.id;
                      const label = document.querySelector(`label[for="${id}"]`);
                      return label?.textContent || '';
                    });
      
      expect(label).toBeTruthy();
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check that h1 exists
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Check that h2 headings follow h1
    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThan(0);
  });

  test('should have keyboard accessible interactive elements', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    let focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();

    // Continue tabbing to verify all interactive elements are reachable
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    }
  });

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/');

    // Tab to first interactive element
    await page.keyboard.press('Tab');

    // Check that focused element has visible outline or focus ring
    const hasOutline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const styles = window.getComputedStyle(el);
      const outline = styles.outline || styles.outlineStyle;
      const boxShadow = styles.boxShadow;
      
      return outline !== 'none' || 
             outline !== '0px' || 
             boxShadow.includes('ring') ||
             boxShadow !== 'none';
    });

    expect(hasOutline).toBeTruthy();
  });

  test('should have proper ARIA roles for interactive components', async ({ page }) => {
    await page.goto('/');

    // Open preset selector
    await page.getByRole('button', { name: /プリセットから選択/ }).click();

    // Check that dropdown has proper role
    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible();

    // Check that options have proper role
    const options = page.getByRole('option');
    expect(await options.count()).toBeGreaterThan(0);
  });

  test('should have proper ARIA attributes for modal', async ({ page }) => {
    await page.goto('/');

    // Open preset manager modal
    await page.getByRole('button', { name: /プリセット管理/ }).click();

    // Check that modal has proper role and attributes
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');

    // Check all images have alt text
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeDefined();
    }
  });

  test('should support screen reader navigation', async ({ page }) => {
    await page.goto('/');

    // Check for landmarks
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );

    expect(contrastViolations).toHaveLength(0);
  });

  test('should have accessible error messages', async ({ page }) => {
    await page.goto('/');

    // Trigger validation error
    await page.getByLabel('LEDパネル幅').fill('0');
    await page.getByLabel('LEDパネル幅').blur();

    // Check that error message is accessible
    const errorMessage = page.locator('[role="alert"], [aria-live="polite"]');
    await expect(errorMessage.first()).toBeVisible({ timeout: 2000 });
  });

  test('should not have any WCAG 2.1 Level AA violations on form interaction', async ({ page }) => {
    await page.goto('/');

    // Interact with form
    await page.getByLabel('LEDパネル幅').fill('500');
    await page.getByLabel('LEDパネル高さ').fill('500');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have any WCAG 2.1 Level AA violations with modal open', async ({ page }) => {
    await page.goto('/');

    // Open modal
    await page.getByRole('button', { name: /プリセット管理/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
