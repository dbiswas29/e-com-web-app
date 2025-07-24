import { NextRequest, NextResponse } from 'next/server';
import { localProductService } from '@/lib/localDataService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      categories: searchParams.get('categories') || undefined,
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
      search: searchParams.get('search') || undefined,
      featured: searchParams.get('featured') === 'true' || undefined,
    };

    const response = await localProductService.getProducts(filters);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
