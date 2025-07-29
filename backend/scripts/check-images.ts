import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProductImages() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        imageUrl: true,
      },
      orderBy: { category: 'asc' }
    });

    console.log('Products by category with images:');
    
    const groupedByCategory = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {} as Record<string, typeof products>);

    Object.entries(groupedByCategory).forEach(([category, categoryProducts]) => {
      console.log(`\n${category} (${categoryProducts.length} products):`);
      categoryProducts.forEach((product, index) => {
        const marker = index === 0 ? '🏠 ' : '  '; // Mark the first product (used for home page)
        console.log(`${marker}- ${product.name}`);
        console.log(`    Image: ${product.imageUrl}`);
      });
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProductImages();
