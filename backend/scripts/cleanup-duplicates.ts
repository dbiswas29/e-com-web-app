import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupDuplicates() {
  console.log('Starting cleanup of duplicate products...');

  try {
    // Get all products
    const allProducts = await prisma.product.findMany({
      orderBy: { createdAt: 'asc' } // Keep the oldest one
    });

    console.log(`Found ${allProducts.length} total products`);

    // Group by name to find duplicates
    const productGroups = new Map<string, any[]>();
    
    allProducts.forEach(product => {
      const key = product.name.toLowerCase();
      if (!productGroups.has(key)) {
        productGroups.set(key, []);
      }
      productGroups.get(key)!.push(product);
    });

    let duplicatesRemoved = 0;

    // Remove duplicates (keep the first one, delete the rest)
    for (const [name, products] of productGroups) {
      if (products.length > 1) {
        console.log(`Found ${products.length} duplicates for "${name}"`);
        
        // Keep the first one, delete the rest
        const toDelete = products.slice(1);
        
        for (const product of toDelete) {
          await prisma.product.delete({
            where: { id: product.id }
          });
          console.log(`Deleted duplicate: ${product.id}`);
          duplicatesRemoved++;
        }
      }
    }

    console.log(`Cleanup complete! Removed ${duplicatesRemoved} duplicate products.`);
    
    // Show final count
    const finalCount = await prisma.product.count();
    console.log(`Final product count: ${finalCount}`);

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicates();
