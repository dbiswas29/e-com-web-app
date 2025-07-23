import { test, expect } from '@playwright/test'

test.describe('E-commerce Website E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go to homepage before each test
    await page.goto('/')
  })

  test.describe('Homepage', () => {
    test('should display homepage correctly', async ({ page }) => {
      // Check if homepage loads
      await expect(page).toHaveTitle(/e-commerce/i)
      
      // Check hero section
      await expect(page.locator('h1')).toContainText('Welcome')
      
      // Check navigation
      await expect(page.locator('nav')).toBeVisible()
      await expect(page.getByRole('link', { name: 'Products' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Categories' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'About' })).toBeVisible()
    })

    test('should navigate to products page from hero buttons', async ({ page }) => {
      // Click "Shop Now" button
      await page.getByRole('link', { name: /shop now/i }).click()
      await expect(page).toHaveURL('/products')
      
      // Go back to homepage
      await page.goto('/')
      
      // Click "Browse Categories" button
      await page.getByRole('link', { name: /browse categories/i }).click()
      await expect(page).toHaveURL('/categories')
    })

    test('should display featured products section', async ({ page }) => {
      await expect(page.locator('text=Featured Products')).toBeVisible()
      
      // Check if product cards are displayed
      const productCards = page.locator('[data-testid="product-card"]')
      await expect(productCards.first()).toBeVisible()
    })

    test('should display newsletter signup', async ({ page }) => {
      await expect(page.locator('text=Subscribe to our newsletter')).toBeVisible()
      
      const emailInput = page.locator('input[type="email"]')
      const subscribeButton = page.getByRole('button', { name: /subscribe/i })
      
      await expect(emailInput).toBeVisible()
      await expect(subscribeButton).toBeVisible()
    })
  })

  test.describe('Products Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/products')
    })

    test('should display products grid', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Products')
      
      // Check if products are loaded
      const productCards = page.locator('[data-testid="product-card"]')
      await expect(productCards.first()).toBeVisible()
    })

    test('should filter products by category', async ({ page }) => {
      // Wait for products to load
      await page.waitForLoadState('networkidle')
      
      // Click on a category filter
      const electronicsFilter = page.locator('input[value="electronics"]')
      await electronicsFilter.check()
      
      // Wait for filtered results
      await page.waitForLoadState('networkidle')
      
      // Check URL contains category parameter
      await expect(page).toHaveURL(/categories=electronics/)
    })

    test('should allow multiple category selection', async ({ page }) => {
      await page.waitForLoadState('networkidle')
      
      // Select multiple categories
      await page.locator('input[value="electronics"]').check()
      await page.locator('input[value="clothing"]').check()
      
      await page.waitForLoadState('networkidle')
      
      // Check URL contains both categories
      await expect(page).toHaveURL(/categories=electronics%2Cclothing/)
    })

    test('should filter products by price range', async ({ page }) => {
      await page.waitForLoadState('networkidle')
      
      // Set price range
      await page.locator('input[name="minPrice"]').fill('50')
      await page.locator('input[name="maxPrice"]').fill('200')
      
      // Apply filter (assuming there's an apply button or auto-filter)
      await page.keyboard.press('Enter')
      await page.waitForLoadState('networkidle')
      
      // Check if URL contains price parameters
      await expect(page).toHaveURL(/minPrice=50/)
      await expect(page).toHaveURL(/maxPrice=200/)
    })

    test('should search products', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="Search"]')
      await searchInput.fill('laptop')
      await page.keyboard.press('Enter')
      
      await page.waitForLoadState('networkidle')
      
      // Check if search results are displayed
      await expect(page).toHaveURL(/search=laptop/)
    })
  })

  test.describe('Product Details', () => {
    test('should navigate to product details page', async ({ page }) => {
      await page.goto('/products')
      await page.waitForLoadState('networkidle')
      
      // Click on first product
      const firstProduct = page.locator('[data-testid="product-card"]').first()
      await firstProduct.click()
      
      // Should navigate to product details page
      await expect(page).toHaveURL(/\/products\/[\w-]+$/)
      
      // Check if product details are displayed
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('[data-testid="product-price"]')).toBeVisible()
      await expect(page.locator('[data-testid="add-to-cart-button"]')).toBeVisible()
    })
  })

  test.describe('Authentication', () => {
    test('should navigate to login page', async ({ page }) => {
      await page.getByRole('link', { name: /login/i }).click()
      await expect(page).toHaveURL('/auth/login')
      
      // Check login form elements
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('input[type="password"]')).toBeVisible()
      await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
    })

    test('should navigate to register page', async ({ page }) => {
      await page.getByRole('link', { name: /register/i }).click()
      await expect(page).toHaveURL('/auth/register')
      
      // Check register form elements
      await expect(page.locator('input[name="firstName"]')).toBeVisible()
      await expect(page.locator('input[name="lastName"]')).toBeVisible()
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('input[type="password"]')).toBeVisible()
      await expect(page.getByRole('button', { name: /register/i })).toBeVisible()
    })

    test('should show validation errors for invalid login', async ({ page }) => {
      await page.goto('/auth/login')
      
      // Try to submit with empty fields
      await page.getByRole('button', { name: /login/i }).click()
      
      // Check for validation errors
      await expect(page.locator('text=Email is required')).toBeVisible()
      await expect(page.locator('text=Password is required')).toBeVisible()
    })

    test('should register new user successfully', async ({ page }) => {
      await page.goto('/auth/register')
      
      // Fill registration form
      await page.locator('input[name="firstName"]').fill('John')
      await page.locator('input[name="lastName"]').fill('Doe')
      await page.locator('input[type="email"]').fill(`test${Date.now()}@example.com`)
      await page.locator('input[type="password"]').fill('password123')
      
      // Submit form
      await page.getByRole('button', { name: /register/i }).click()
      
      // Should redirect to homepage or dashboard after successful registration
      await expect(page).toHaveURL(/\/(dashboard)?$/)
    })
  })

  test.describe('Cart Functionality', () => {
    test('should add product to cart when authenticated', async ({ page }) => {
      // First register/login
      await page.goto('/auth/register')
      await page.locator('input[name="firstName"]').fill('John')
      await page.locator('input[name="lastName"]').fill('Doe')
      await page.locator('input[type="email"]').fill(`test${Date.now()}@example.com`)
      await page.locator('input[type="password"]').fill('password123')
      await page.getByRole('button', { name: /register/i }).click()
      
      // Go to products page
      await page.goto('/products')
      await page.waitForLoadState('networkidle')
      
      // Add first product to cart
      const addToCartButton = page.locator('[data-testid="add-to-cart-button"]').first()
      await addToCartButton.click()
      
      // Check for success toast
      await expect(page.locator('text=Item added to cart')).toBeVisible()
      
      // Check cart icon shows updated count
      const cartIcon = page.locator('[data-testid="cart-icon"]')
      await expect(cartIcon).toContainText('1')
    })

    test('should view cart page', async ({ page }) => {
      await page.goto('/cart')
      
      // Should show cart page
      await expect(page.locator('h1')).toContainText('Shopping Cart')
    })

    test('should prompt login when adding to cart without authentication', async ({ page }) => {
      await page.goto('/products')
      await page.waitForLoadState('networkidle')
      
      // Try to add to cart without being logged in
      const addToCartButton = page.locator('[data-testid="add-to-cart-button"]').first()
      await addToCartButton.click()
      
      // Should show login prompt
      await expect(page.locator('text=Please log in to add items to cart')).toBeVisible()
    })
  })

  test.describe('Categories Page', () => {
    test('should display all categories', async ({ page }) => {
      await page.goto('/categories')
      
      await expect(page.locator('h1')).toContainText('Categories')
      
      // Check if category cards are displayed
      const categoryCards = page.locator('[data-testid="category-card"]')
      await expect(categoryCards.first()).toBeVisible()
    })

    test('should navigate to products filtered by category', async ({ page }) => {
      await page.goto('/categories')
      
      // Click on a category
      const firstCategory = page.locator('[data-testid="category-card"]').first()
      await firstCategory.click()
      
      // Should navigate to products page with category filter
      await expect(page).toHaveURL(/\/products.*category=/)
    })
  })

  test.describe('About Page', () => {
    test('should display about page content', async ({ page }) => {
      await page.goto('/about')
      
      await expect(page.locator('h1')).toContainText('About')
      
      // Check for team section
      await expect(page.locator('text=Our Team')).toBeVisible()
      
      // Check for team member cards
      const teamCards = page.locator('[data-testid="team-member"]')
      await expect(teamCards.first()).toBeVisible()
    })
  })

  test.describe('Contact Page', () => {
    test('should display contact form', async ({ page }) => {
      await page.goto('/contact')
      
      await expect(page.locator('h1')).toContainText('Contact')
      
      // Check contact form elements
      await expect(page.locator('input[name="name"]')).toBeVisible()
      await expect(page.locator('input[name="email"]')).toBeVisible()
      await expect(page.locator('textarea[name="message"]')).toBeVisible()
      await expect(page.getByRole('button', { name: /send message/i })).toBeVisible()
    })

    test('should submit contact form', async ({ page }) => {
      await page.goto('/contact')
      
      // Fill contact form
      await page.locator('input[name="name"]').fill('John Doe')
      await page.locator('input[name="email"]').fill('john@example.com')
      await page.locator('textarea[name="message"]').fill('This is a test message')
      
      // Submit form
      await page.getByRole('button', { name: /send message/i }).click()
      
      // Check for success message
      await expect(page.locator('text=Message sent successfully')).toBeVisible()
    })
  })

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      
      await page.goto('/')
      
      // Check if mobile navigation is working
      const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]')
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click()
        await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
      }
      
      // Check if content is responsive
      await expect(page.locator('h1')).toBeVisible()
    })

    test('should work on tablet devices', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 })
      
      await page.goto('/products')
      await page.waitForLoadState('networkidle')
      
      // Check if products grid adapts to tablet size
      const productCards = page.locator('[data-testid="product-card"]')
      await expect(productCards.first()).toBeVisible()
    })
  })
})
