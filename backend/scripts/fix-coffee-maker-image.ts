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

async function fixCoffeeMakerImage() {
  try {
    // Connect to MongoDB
    await connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Update the Premium Coffee Maker product
    const result = await Product.updateOne(
      { name: 'Premium Coffee Maker' },
      {
        $set: {
          imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop&auto=format',
          images: [
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1514066558159-fc8c737ef259?w=600&h=600&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop&auto=format'
          ]
        }
      }
    );

    console.log('Update result:', result);
    
    if (result.matchedCount > 0) {
      console.log('✅ Premium Coffee Maker image updated successfully!');
    } else {
      console.log('❌ No Premium Coffee Maker product found to update');
    }

  } catch (error) {
    console.error('Error updating product:', error);
  } finally {
    await disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixCoffeeMakerImage();
