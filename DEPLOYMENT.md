# Deployment Guide

This guide covers deploying the E-Commerce Web Application to various platforms and environments.

## 🚀 Deployment Options

### 1. Local Production Deployment
For testing production builds locally before deploying to cloud services.

### 2. Vercel (Frontend) + Railway/Heroku (Backend)
Recommended for easy deployment with minimal configuration.

### 3. AWS/GCP/Azure
For enterprise-grade deployment with full control.

### 4. Docker Containers
For containerized deployment across any platform.

### 5. VPS/Dedicated Server
For self-hosted deployment with full control.

## 🏠 Local Production Deployment

### Prerequisites
- Node.js v22.17.0
- MongoDB installed and running
- Production environment variables configured

### Steps
```bash
# 1. Clone and install dependencies
git clone https://github.com/dbiswas29/e-com-web-app.git
cd e-com-web-app
npm install

# 2. Set up environment variables
cp .env.example .env
cd frontend && cp .env.example .env.local && cd ..
cd backend && cp .env.example .env && cd ..

# 3. Update environment variables for production
# Edit .env files with production values

# 4. Build the applications
npm run build

# 5. Start production servers
npm run start
```

### Environment Variables for Local Production
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=production

# Backend (.env)
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ecommerce_prod
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=http://localhost:3000
```

## ☁️ Cloud Deployment

### Vercel (Frontend Deployment)

#### Prerequisites
- Vercel account
- GitHub repository connected

#### Deployment Steps
1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from frontend directory
   cd frontend
   vercel
   ```

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
   - Root Directory: `frontend`

3. **Environment Variables**
   Add in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com
   NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
   ```

4. **Custom Domain** (Optional)
   - Add custom domain in Vercel dashboard
   - Configure DNS records
   - SSL certificate automatically provided

### Railway (Backend Deployment)

#### Prerequisites
- Railway account
- GitHub repository

#### Deployment Steps
1. **Connect Repository**
   - Go to Railway dashboard
   - Click "New Project"
   - Connect GitHub repository
   - Select backend folder

2. **Configure Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
   JWT_SECRET=your-strong-jwt-secret
   REFRESH_TOKEN_SECRET=your-refresh-token-secret
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

3. **Configure Build**
   Railway automatically detects Node.js and runs:
   ```bash
   npm install
   npm run build
   npm run start:prod
   ```

4. **Custom Domain** (Optional)
   - Add custom domain in Railway settings
   - Configure DNS records

### MongoDB Atlas (Database)

#### Setup
1. **Create Account**
   - Sign up at MongoDB Atlas
   - Create new cluster

2. **Configure Database**
   - Choose cloud provider and region
   - Configure network access (add Railway/Vercel IPs)
   - Create database user

3. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

4. **Seed Database**
   ```bash
   # Update backend .env with Atlas URI
   cd backend
   npm run seed
   ```

## 🐳 Docker Deployment

### Docker Configuration

#### Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:22.17.0-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:22.17.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22.17.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:22.17.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:8.0.12
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: ecommerce
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    restart: always
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:password@mongodb:27017/ecommerce?authSource=admin
      JWT_SECRET: your-jwt-secret
      CORS_ORIGIN: http://localhost:3000
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    restart: always
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### Docker Deployment Commands
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild specific service
docker-compose up -d --build frontend
```

## 🖥️ VPS/Server Deployment

### Prerequisites
- Ubuntu 20.04+ server
- Root or sudo access
- Domain name (optional)

### Server Setup
```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-8.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# 4. Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# 5. Install PM2 for process management
sudo npm install -g pm2

# 6. Install Nginx for reverse proxy
sudo apt install nginx -y
```

### Application Deployment
```bash
# 1. Clone repository
git clone https://github.com/dbiswas29/e-com-web-app.git
cd e-com-web-app

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with production values

# 4. Build applications
npm run build

# 5. Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'ecommerce-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'ecommerce-backend',
      cwd: './backend',
      script: 'npm',
      args: 'run start:prod',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
```

### Nginx Configuration
```nginx
# /etc/nginx/sites-available/ecommerce
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable Nginx Site
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot

# Create certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Environment Variables

### Production Environment Variables

#### Frontend (.env.local)
```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# Analytics (Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA-MEASUREMENT-ID

# External Services (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_SENTRY_DSN=https://...
```

#### Backend (.env)
```bash
# Application
NODE_ENV=production
PORT=3001

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# JWT
JWT_SECRET=your-super-strong-jwt-secret-min-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-super-strong-refresh-secret-min-32-chars
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://your-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (Optional)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key

# Payment (Optional)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Monitoring (Optional)
SENTRY_DSN=https://...
```

## 📊 Monitoring and Maintenance

### Health Checks
```bash
# Frontend health check
curl -f http://localhost:3000/_next/static/chunks/webpack.js

# Backend health check
curl -f http://localhost:3001/health

# Database health check
mongosh --eval "db.runCommand({ ping: 1 })"
```

### Log Management
```bash
# PM2 logs
pm2 logs
pm2 logs ecommerce-frontend
pm2 logs ecommerce-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Backup Strategy
```bash
# Database backup
mongodump --uri="mongodb://localhost:27017/ecommerce" --out=/backup/$(date +%Y%m%d)

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="/backup/mongodb_$DATE"
tar -czf "/backup/mongodb_$DATE.tar.gz" "/backup/mongodb_$DATE"
rm -rf "/backup/mongodb_$DATE"

# Keep only last 7 days of backups
find /backup -name "mongodb_*.tar.gz" -mtime +7 -delete
```

### Update Strategy
```bash
# 1. Backup current version
git stash
git checkout production
git pull origin main

# 2. Install dependencies
npm install

# 3. Build new version
npm run build

# 4. Restart services
pm2 restart all

# 5. Verify deployment
curl -f http://localhost:3000
curl -f http://localhost:3001/health
```

## 🔒 Security Considerations

### Production Security Checklist
- [ ] Strong JWT secrets (min 32 characters)
- [ ] HTTPS enabled with valid SSL certificate
- [ ] Database authentication enabled
- [ ] Environment variables secured
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers implemented
- [ ] Error messages don't expose sensitive data
- [ ] File upload restrictions in place
- [ ] Dependencies regularly updated

### Security Headers
```javascript
// In NestJS main.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### Firewall Configuration
```bash
# UFW firewall setup
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 27017 # Only if MongoDB accessed externally
```

## 🚨 Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Clear caches
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version # Should be v22.17.0
```

#### Database Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection
mongosh --eval "db.runCommand({ ping: 1 })"

# Check firewall
sudo ufw status
```

#### Memory Issues
```bash
# Increase PM2 memory limit
pm2 start ecosystem.config.js --max-memory-restart 1G

# Monitor memory usage
pm2 monit
```

#### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew --dry-run
```

### Performance Optimization
```bash
# Enable Nginx gzip compression
# Add to nginx.conf
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

# Enable browser caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

This deployment guide covers the most common deployment scenarios. Choose the option that best fits your requirements and infrastructure.
