import { NextRequest, NextResponse } from 'next/server';
import { localProductService } from '@/lib/localDataService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const grouped = searchParams.get('grouped') === 'true';
    
    if (grouped) {
      const categoryGroups = await localProductService.getCategoryGroups();
      return NextResponse.json({ data: categoryGroups });
    } else {
      const categories = await localProductService.getCategories();
      return NextResponse.json({ data: categories });
    }
  } catch (error) {
    console.error('Error in categories API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
