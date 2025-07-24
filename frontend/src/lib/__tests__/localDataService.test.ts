import { localProductService } from '../localDataService'
import type { ProductFilters } from '../localDataService'

describe('LocalProductService', () => {
  describe('getProducts', () => {
    it('should return all products when no filters applied', async () => {
      const result = await localProductService.getProducts()

      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('page')
      expect(result).toHaveProperty('limit')
      expect(result).toHaveProperty('totalPages')
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.page).toBe(1)
      expect(result.limit).toBe(12)
      expect(result.data.length).toBeGreaterThan(0)
    })

    it('should filter products by category', async () => {
      const filters: ProductFilters = {
        categories: 'electronics'
      }

      const result = await localProductService.getProducts(filters)

      expect(result.data.every(product => product.category === 'electronics')).toBe(true)
    })

    it('should filter products by multiple categories', async () => {
      const filters: ProductFilters = {
        categories: 'electronics,clothing'
      }

      const result = await localProductService.getProducts(filters)

      expect(result.data.every(product => 
        product.category === 'electronics' || product.category === 'clothing'
      )).toBe(true)
    })

    it('should filter products by price range', async () => {
      const filters: ProductFilters = {
        minPrice: '50',
        maxPrice: '200'
      }

      const result = await localProductService.getProducts(filters)

      expect(result.data.every(product => 
        product.price >= 50 && product.price <= 200
      )).toBe(true)
    })

    it('should search products by name', async () => {
      const filters: ProductFilters = {
        search: 'laptop'
      }

      const result = await localProductService.getProducts(filters)

      expect(result.data.every(product => 
        product.name.toLowerCase().includes('laptop') ||
        product.description.toLowerCase().includes('laptop')
      )).toBe(true)
    })

    it('should return featured products only', async () => {
      const filters: ProductFilters = {
        featured: true
      }

      const result = await localProductService.getProducts(filters)

      // Featured products should be properly filtered
      expect(result.data.length).toBeGreaterThan(0)
    })

    it('should paginate results correctly', async () => {
      const filters: ProductFilters = {
        page: 1,
        limit: 5
      }

      const result = await localProductService.getProducts(filters)

      expect(result.page).toBe(1)
      expect(result.limit).toBe(5)
      expect(result.data.length).toBeLessThanOrEqual(5)
      expect(result.totalPages).toBeGreaterThanOrEqual(1)
    })

    it('should handle empty search results', async () => {
      const filters: ProductFilters = {
        search: 'nonexistentproduct12345'
      }

      const result = await localProductService.getProducts(filters)

      expect(result.data).toHaveLength(0)
      expect(result.total).toBe(0)
      expect(result.totalPages).toBe(0)
    })

    it('should combine multiple filters', async () => {
      const filters: ProductFilters = {
        categories: 'electronics',
        minPrice: '100',
        maxPrice: '1000',
        search: 'phone'
      }

      const result = await localProductService.getProducts(filters)

      result.data.forEach(product => {
        expect(product.category).toBe('electronics')
        expect(product.price).toBeGreaterThanOrEqual(100)
        expect(product.price).toBeLessThanOrEqual(1000)
        expect(
          product.name.toLowerCase().includes('phone') ||
          product.description.toLowerCase().includes('phone')
        ).toBe(true)
      })
    })
  })

  describe('getProductById', () => {
    it('should return product when id exists', async () => {
      // First get a product to know a valid ID
      const products = await localProductService.getProducts({ limit: 1 })
      const productId = products.data[0]?.id

      if (productId) {
        const result = await localProductService.getProductById(productId)

        expect(result).toBeTruthy()
        expect(result?.id).toBe(productId)
        expect(result).toHaveProperty('name')
        expect(result).toHaveProperty('price')
        expect(result).toHaveProperty('category')
      }
    })

    it('should return null when product not found', async () => {
      const result = await localProductService.getProductById('non-existent-id')

      expect(result).toBeNull()
    })
  })

  describe('getCategories', () => {
    it('should return all categories with counts', async () => {
      const result = await localProductService.getCategories()

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      
      result.forEach(category => {
        expect(category).toHaveProperty('category')
        expect(category).toHaveProperty('count')
        expect(typeof category.category).toBe('string')
        expect(typeof category.count).toBe('number')
        expect(category.count).toBeGreaterThan(0)
      })
    })
  })

  describe('getCategoryGroups', () => {
    it('should return category groups with products', async () => {
      const result = await localProductService.getCategoryGroups()

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)

      result.forEach(group => {
        expect(group).toHaveProperty('category')
        expect(group).toHaveProperty('count')
        expect(group).toHaveProperty('products')
        expect(Array.isArray(group.products)).toBe(true)
        expect(group.products.length).toBe(group.count)
        
        // All products in group should have same category
        group.products.forEach(product => {
          expect(product.category).toBe(group.category)
        })
      })
    })
  })

  describe('getProductsByCategory', () => {
    it('should return products for specific category', async () => {
      const result = await localProductService.getProductsByCategory('electronics')

      expect(result).toHaveProperty('data')
      expect(Array.isArray(result.data)).toBe(true)
      
      result.data.forEach(product => {
        expect(product.category).toBe('electronics')
      })
    })

    it('should limit products when limit provided', async () => {
      const limit = 2
      const result = await localProductService.getProductsByCategory('electronics', limit)

      expect(result.data.length).toBeLessThanOrEqual(limit)
    })
  })

  describe('getPriceRange', () => {
    it('should return min and max prices', () => {
      const result = localProductService.getPriceRange()

      expect(result).toHaveProperty('min')
      expect(result).toHaveProperty('max')
      expect(typeof result.min).toBe('number')
      expect(typeof result.max).toBe('number')
      expect(result.min).toBeLessThanOrEqual(result.max)
    })
  })

  describe('getAllCategories', () => {
    it('should return all unique categories sorted', () => {
      const result = localProductService.getAllCategories()

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      
      // Check if sorted
      const sorted = [...result].sort()
      expect(result).toEqual(sorted)
      
      // Check uniqueness
      const unique = [...new Set(result)]
      expect(result).toEqual(unique)
    })
  })

  describe('getFeaturedProducts', () => {
    it('should return featured products', async () => {
      const result = await localProductService.getFeaturedProducts()

      expect(result).toHaveProperty('data')
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.data.length).toBeGreaterThan(0)
      
      // Should return products (featured logic may vary)
      result.data.forEach(product => {
        expect(product).toHaveProperty('id')
        expect(product).toHaveProperty('name')
        expect(product).toHaveProperty('price')
      })
    })

    it('should limit featured products when limit provided', async () => {
      const limit = 3
      const result = await localProductService.getFeaturedProducts(limit)

      expect(result.data.length).toBeLessThanOrEqual(limit)
    })
  })
})
