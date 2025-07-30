# Database Seeding Fix

## Problem
The application was automatically deleting all user data on every restart due to the DatabaseSeeder service running automatically with `onModuleInit()`.

## Solution
Modified the DatabaseSeeder to only run when explicitly requested through environment variables:

### Environment Variables
- `SEED_DATABASE=true` - Enable database seeding
- `CLEAR_DATABASE=true` - Allow clearing existing data before seeding

### Default Behavior (Safe)
- By default, seeding is disabled (`SEED_DATABASE=false`)
- By default, existing data is preserved (`CLEAR_DATABASE=false`)

### Manual Seeding Commands
```bash
# Seed database without clearing existing data
npm run seed

# Seed database and clear existing data first
npm run seed:clear
```

### Environment Configuration
In `.env` file:
```
NODE_ENV=development
SEED_DATABASE=false
CLEAR_DATABASE=false
```

## Files Modified
1. `src/database/database-seeder.service.ts` - Added environment variable checks
2. `scripts/seed.ts` - New manual seeding script
3. `package.json` - Added seeding commands
4. `.env` - Added seeding control variables

## User Data Safety
- User details will no longer be automatically deleted
- Manual seeding only runs when explicitly requested
- Existing data is preserved by default
