import { Product } from '@/types';
import productsData from '@/data/products.json';

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Category {
  category: string;
  count: number;
}

export interface CategoryGroup {
  category: string;
  count: number;
  products: Product[];
}

export interface ProductFilters {
  categories?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}

class LocalProductService {
  private products: Product[] = productsData.data as Product[];

  /**
   * Get all products with filtering and pagination
   */
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        let filteredProducts = [...this.products];

        // Apply category filter
        if (filters.categories) {
          const selectedCategories = filters.categories.split(',').map(cat => cat.trim());
          filteredProducts = filteredProducts.filter(product => 
            selectedCategories.includes(product.category)
          );
        } else if (filters.category) {
          filteredProducts = filteredProducts.filter(product => 
            product.category === filters.category
          );
        }

        // Apply price filters
        if (filters.minPrice) {
          const minPrice = parseFloat(filters.minPrice);
          filteredProducts = filteredProducts.filter(product => product.price >= minPrice);
        }

        if (filters.maxPrice) {
          const maxPrice = parseFloat(filters.maxPrice);
          filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
        }

        // Apply search filter
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
          );
        }

        // Apply featured filter
        if (filters.featured) {
          // For featured products, we'll take products with high ratings
          filteredProducts = filteredProducts
            .filter(product => product.rating >= 4.5)
            .sort((a, b) => b.rating - a.rating);
        }

        // Calculate pagination
        const page = filters.page || 1;
        const limit = filters.limit || 12;
        const total = filteredProducts.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        resolve({
          data: paginatedProducts,
          total,
          page,
          limit,
          totalPages
        });
      }, 300); // 300ms delay to simulate network
    });
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit: number = 4): Promise<{ data: Product[] }> {
    const response = await this.getProducts({ featured: true, limit });
    return { data: response.data };
  }

  /**
   * Get all categories with product counts
   */
  async getCategories(): Promise<Category[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categoryMap = new Map<string, number>();
        
        this.products.forEach(product => {
          const count = categoryMap.get(product.category) || 0;
          categoryMap.set(product.category, count + 1);
        });

        const categories: Category[] = Array.from(categoryMap.entries()).map(([category, count]) => ({
          category,
          count
        }));

        resolve(categories);
      }, 200);
    });
  }

  /**
   * Get categories grouped with their products
   */
  async getCategoryGroups(): Promise<CategoryGroup[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categoryMap = new Map<string, Product[]>();
        
        this.products.forEach(product => {
          if (!categoryMap.has(product.category)) {
            categoryMap.set(product.category, []);
          }
          categoryMap.get(product.category)!.push(product);
        });

        const categoryGroups: CategoryGroup[] = Array.from(categoryMap.entries()).map(([category, products]) => ({
          category,
          count: products.length,
          products
        }));

        resolve(categoryGroups);
      }, 200);
    });
  }

  /**
   * Get a single product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = this.products.find(p => p.id === id);
        resolve(product || null);
      }, 100);
    });
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string, limit?: number): Promise<{ data: Product[] }> {
    const response = await this.getProducts({ category, limit });
    return { data: response.data };
  }

  /**
   * Get price range for products
   */
  getPriceRange(): { min: number; max: number } {
    const prices = this.products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }

  /**
   * Get all unique categories
   */
  getAllCategories(): string[] {
    const categories = [...new Set(this.products.map(p => p.category))];
    return categories.sort();
  }
}

export const localProductService = new LocalProductService();
