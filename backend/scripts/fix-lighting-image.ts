import { connect, disconnect, model, Schema } from 'mongoose';

// Define Product schema inline for the script
const productSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  images: [String],
  category: String,
  stock: Number,
  rating: Number,
  reviewCount: Number,
  features: [String],
  isActive: Boolean,
}, { timestamps: true });

const Product = model('Product', productSchema);

async function fixLightingImage() {
  try {
    // Connect to MongoDB
    await connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Update the Minimalist Desk Lamp product
    const result = await Product.updateOne(
      { name: 'Minimalist Desk Lamp' },
      {
        $set: {
          imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=600&fit=crop&auto=format',
          images: [
            'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=600&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=600&fit=crop&auto=format'
          ]
        }
      }
    );

    console.log('Update result:', result);
    
    if (result.matchedCount > 0) {
      console.log('✅ Minimalist Desk Lamp image updated successfully!');
    } else {
      console.log('❌ No Minimalist Desk Lamp product found to update');
    }

  } catch (error) {
    console.error('Error updating product:', error);
  } finally {
    await disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixLightingImage();
