import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function removeDuplicateProducts() {
  console.log('Starting duplicate product removal...');
  
  try {
    // Find all products grouped by name and category
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'asc' } // Keep the oldest ones
    });
    
    console.log(`Total products found: ${products.length}`);
    
    // Group products by name to find duplicates
    const productGroups = new Map<string, any[]>();
    
    products.forEach(product => {
      const key = `${product.name}-${product.category}`;
      if (!productGroups.has(key)) {
        productGroups.set(key, []);
      }
      productGroups.get(key)!.push(product);
    });
    
    let duplicatesFound = 0;
    let duplicatesRemoved = 0;
    
    // Process each group
    for (const [key, group] of productGroups) {
      if (group.length > 1) {
        duplicatesFound += group.length - 1;
        console.log(`Found ${group.length} products with key: ${key}`);
        
        // Keep the first one (oldest), remove the rest
        const toKeep = group[0];
        const toRemove = group.slice(1);
        
        console.log(`Keeping product: ${toKeep.name} (ID: ${toKeep.id})`);
        
        for (const duplicate of toRemove) {
          console.log(`Removing duplicate: ${duplicate.name} (ID: ${duplicate.id})`);
          await prisma.product.delete({
            where: { id: duplicate.id }
          });
          duplicatesRemoved++;
        }
      }
    }
    
    console.log(`\nSummary:`);
    console.log(`- Total duplicates found: ${duplicatesFound}`);
    console.log(`- Total duplicates removed: ${duplicatesRemoved}`);
    console.log(`- Unique products remaining: ${products.length - duplicatesRemoved}`);
    
  } catch (error) {
    console.error('Error removing duplicates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeDuplicateProducts();
