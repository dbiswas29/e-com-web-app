import { cookies } from 'next/headers';
import { Product, Category } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

class ServerApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
      // Important for SSR: disable caching for dynamic data
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, value);
      });
      url += `?${searchParams.toString()}`;
    }

    return this.makeRequest<T>(url);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Specific API methods for your e-commerce app
  async getProducts(params?: {
    limit?: string;
    page?: string;
    category?: string;
    categories?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  }): Promise<ApiResponse<Product[]>> {
    let url = '/products';
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }

    const rawResponse = await this.makeRequest<any>(url);
    // Backend returns { data: Product[], total, page, limit, totalPages }
    // We need to adapt it to our ApiResponse format
    return {
      data: rawResponse.data || [],
      success: true,
      message: `Found ${(rawResponse as any).total || 0} products`,
    };
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    const response = await fetch(`${this.baseURL}/products/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const product = await response.json();
    return {
      data: product,
      success: true,
    };
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    // Make a direct fetch call since the backend returns raw data
    const response = await fetch(`${this.baseURL}/products/categories`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const categories = await response.json() as Category[];
    
    return {
      data: categories,
      success: true,
    };
  }

  async getCategory(id: string): Promise<ApiResponse<Category>> {
    return this.get<Category>(`/categories/${id}`);
  }

  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    const rawResponse = await this.makeRequest<any>('/products?limit=4');
    return {
      data: rawResponse.data || [],
      success: true,
    };
  }

  async getCart(): Promise<ApiResponse<any>> {
    return this.get<any>('/cart');
  }

  async getOrders(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/orders');
  }

  async getOrder(id: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/orders/${id}`);
  }

  async getUser(): Promise<ApiResponse<any>> {
    return this.get<any>('/users/profile');
  }
}

export const serverApiClient = new ServerApiClient();

// Helper function for error handling in server components
export async function handleServerApiCall<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  fallback: T
): Promise<T> {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    console.error('Server API call failed:', error);
    return fallback;
  }
}
