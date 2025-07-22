import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'categories', required: false, type: String, description: 'Comma-separated list of categories' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Query('page') pageStr = '1',
    @Query('limit') limitStr = '20',
    @Query('category') category?: string,
    @Query('categories') categories?: string,
    @Query('minPrice') minPriceStr?: string,
    @Query('maxPrice') maxPriceStr?: string,
    @Query('search') search?: string,
  ) {
    const page = parseInt(pageStr) || 1;
    const limit = parseInt(limitStr) || 20;
    const minPrice = minPriceStr ? parseFloat(minPriceStr) : undefined;
    const maxPrice = maxPriceStr ? parseFloat(maxPriceStr) : undefined;
    
    // Handle multiple categories or single category
    let categoryFilter: string[] | undefined;
    if (categories) {
      categoryFilter = categories.split(',').map(cat => cat.trim()).filter(cat => cat);
    } else if (category) {
      categoryFilter = [category];
    }
    
    const skip = (page - 1) * limit;
    return this.productsService.findAll({
      skip,
      take: limit,
      categories: categoryFilter,
      minPrice: isNaN(minPrice) ? undefined : minPrice,
      maxPrice: isNaN(maxPrice) ? undefined : maxPrice,
      search,
    });
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get products by category' })
  async findByCategory(@Param('category') category: string) {
    return this.productsService.findByCategory(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }
}
