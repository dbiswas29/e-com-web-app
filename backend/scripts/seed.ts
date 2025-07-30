import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DatabaseSeeder } from '../src/database/database-seeder.service';

async function seedDatabase() {
  console.log('🌱 Manual database seeding started...');
  
  // Create the Nest application context
  const app = await NestFactory.createApplicationContext(AppModule);
  
  // Get the seeder service
  const seeder = app.get(DatabaseSeeder);
  
  // Override environment variables for manual seeding
  process.env.SEED_DATABASE = 'true';
  process.env.CLEAR_DATABASE = process.argv.includes('--clear') ? 'true' : 'false';
  
  try {
    // Run the seeding
    await seeder['seedDatabase']();
    console.log('✅ Manual database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
  } finally {
    // Close the application
    await app.close();
  }
}

// Run the seeding
seedDatabase().catch(console.error);
