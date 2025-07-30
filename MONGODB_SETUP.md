# MongoDB Setup Guide

## Option 1: Local MongoDB Installation

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Download the Windows version
   - Install with default settings

2. **Start MongoDB Service**
   ```bash
   # MongoDB will auto-start as a Windows service
   # Or manually start with:
   net start MongoDB
   ```

3. **Verify Installation**
   ```bash
   mongo --version
   ```

## Option 2: MongoDB Atlas (Cloud - Recommended)

1. **Create Free Account**
   - Visit: https://cloud.mongodb.com/
   - Sign up for free (512MB storage included)

2. **Create Cluster**
   - Choose "Build a Cluster" → "Shared Clusters" (Free)
   - Select a cloud provider and region
   - Create cluster (takes 1-3 minutes)

3. **Setup Database Access**
   - Go to "Database Access" → "Add New Database User"
   - Create username/password
   - Give "Read and write to any database" permissions

4. **Setup Network Access**
   - Go to "Network Access" → "Add IP Address"
   - Add "0.0.0.0/0" for development (allows all IPs)

5. **Get Connection String**
   - Go to "Clusters" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Update .env File**
   ```env
   # Replace with your actual connection string
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

## Products Added (9 Total)

### Existing Categories:
- **Lighting**: Minimalist Desk Lamp
- **Furniture**: Ergonomic Office Chair, Standing Desk Converter
- **Electronics**: Wireless Charging Pad, Mechanical Keyboard
- **Health & Fitness**: Smart Water Bottle

### New Categories Added:
- **Kitchen & Dining**: Premium Coffee Maker, Stainless Steel Water Bottle
- **Beauty & Personal Care**: Organic Skincare Set

## Start the Application

1. **Setup MongoDB** (choose option 1 or 2 above)
2. **Start Backend**:
   ```bash
   cd backend
   npm run start:dev
   ```
3. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

The database will auto-seed with 9 products across 7 categories on first startup!
