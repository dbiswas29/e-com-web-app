import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProductPrices() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
      },
      orderBy: { price: 'asc' }
    });
    
    console.log('Product prices:');
    products.forEach(product => {
      console.log(`- ${product.name}: $${product.price} (${product.category})`);
    });
    
    const minPrice = Math.min(...products.map(p => p.price));
    const maxPrice = Math.max(...products.map(p => p.price));
    
    console.log(`\nPrice range: $${minPrice} - $${maxPrice}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProductPrices();
