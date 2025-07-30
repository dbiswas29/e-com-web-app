import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseSeeder } from './database-seeder.service';
import { Product, ProductSchema } from '../schemas/product.schema';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/ecommerce';
        console.log('🔗 Connecting to MongoDB:', uri.replace(/\/\/.*@/, '//***:***@'));
        
        return {
          uri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
          socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [DatabaseSeeder],
  exports: [MongooseModule],
})
export class DatabaseModule {}
