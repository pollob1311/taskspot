# 📦 Installation Guide - TaskSpot

## Prerequisites

Before you begin, ensure you have:
- [ ] Windows 10/11
- [ ] Internet connection
- [ ] Administrator access
- [ ] Email account (for testing)

---

## Step 1: Install Node.js

### Download Node.js
1. Open browser and go to: **https://nodejs.org/**
2. Download **"LTS" version** (Recommended for most users)
3. Run the installer
4. Click "Next" through all steps (use default settings)
5. Check "Automatically install necessary tools" if prompted
6. Click "Finish"

### Verify Installation
1. Open **PowerShell** (search in Windows menu)
2. Type: `node --version`
3. You should see: `v18.x.x` or `v20.x.x`
4. Type: `npm --version`
5. You should see: `9.x.x` or `10.x.x`

✅ If both commands work, Node.js is installed correctly!

---

## Step 2: Install PostgreSQL Database

### Option A: Local Installation (Recommended for Development)

1. **Download PostgreSQL**
   - Go to: https://www.postgresql.org/download/windows/
   - Download the installer (latest version)

2. **Install PostgreSQL**
   - Run the installer
   - Set password: `postgres` (remember this!)
   - Port: `5432` (default)
   - Install all components

3. **Create Database**
   - Open **pgAdmin 4** (installed with PostgreSQL)
   - Right-click "Databases" → "Create" → "Database"
   - Name: `cpa_rewards`
   - Click "Save"

4. **Get Connection URL**
   ```
   postgresql://postgres:postgres@localhost:5432/cpa_rewards
   ```

### Option B: Cloud Database (Easier, No Install)

**Using Neon (Free tier available)**:
1. Go to: https://neon.tech/
2. Sign up (free)
3. Create new project: "TaskSpot"
4. Copy the connection string (starts with `postgresql://`)

**Using Supabase (Free tier)**:
1. Go to: https://supabase.com/
2. Sign up
3. Create new project
4. Go to Settings → Database
5. Copy "Connection String" (URI format)

✅ Save your database connection URL for later!

---

## Step 3: Install Project Dependencies

### Open Command Prompt
1. Press `Win + R`
2. Type: `cmd` and press Enter
3. Navigate to project folder:
   ```bash
   cd "C:\Users\wiliam t\OneDrive\Desktop\cpa mm"
   ```

### Install Dependencies
```bash
npm install
```

This will take 2-5 minutes. You'll see lots of text scrolling.

**Wait for**:
```
added XXX packages in Xs
```

✅ If you see this, installation was successful!

### Common Errors:

**Error: "npm not recognized"**
- Solution: Restart PowerShell/CMD after installing Node.js

**Error: "network timeout"**
- Solution: Check internet connection, try again

**Error: "permission denied"**
- Solution: Run CMD as Administrator (right-click → Run as Administrator)

---

## Step 4: Configure Environment Variables

### Create .env file

1. Open project folder in File Explorer
2. Find `.env.example` file
3. Right-click → Copy
4. Right-click in empty space → Paste
5. Rename to `.env` (remove `.example`)

### Edit .env file

1. Right-click `.env` → "Open with" → Notepad
2. Update these values:

```env
# Database (from Step 2)
DATABASE_URL="postgresql://user:password@host:5432/cpa_rewards"

# NextAuth (generate random string)
NEXTAUTH_SECRET="your-random-secret-key-at-least-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"

# Points System
USER_REWARD_PERCENTAGE="0.40"
POINTS_PER_DOLLAR="1000"
```

### Generate Random Secret
Option 1: https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")
Option 2: In PowerShell:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

✅ Save the file!

---

## Step 5: Setup Database Tables

### Run Migrations

In your command prompt (still in project folder):

```bash
npx prisma migrate dev --name init
```

You'll see:
```
✔ Applying migration init
Your database is now in sync with your schema.
✅ Generated Prisma Client
```

### Verify Tables Created

**Option 1 - Using pgAdmin**:
1. Open pgAdmin
2. Navigate: Servers → PostgreSQL → Databases → cpa_rewards → Schemas → public → Tables
3. You should see 8 tables:
   - User
   - Offer
   - UserOffer
   - Transaction
   - Withdrawal
   - Referral
   - AdView
   - FraudLog

**Option 2 - Using Prisma Studio** (Easier):
```bash
npx prisma studio
```
Browser will open to `http://localhost:5555`
You can view/edit tables here.

✅ If you see the tables, database is ready!

---

## Step 6: Start Development Server

### Run the server

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.1.0
- Local:   http://localhost:3000
- Network: http://192.168.x.x:3000

✓ Ready in 2.5s
```

### Open in Browser

1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see the **landing page**! 🎉

**What you'll see**:
- Hero section with gradient background
- "Earn Rewards by Completing Simple Offers" headline
- "Get Started Free" button
- Payment method badges
- Footer

✅ If the page loads, installation is complete!

---

## Step 7: Create Admin Account (Manual Database Insert)

Since we haven't built the registration page yet, create admin manually:

### Option 1: Using Prisma Studio
```bash
npx prisma studio
```

1. Click "User" table
2. Click "Add Record"
3. Fill in:
   - email: `admin@example.com`
   - passwordHash: (we'll set this via script)
   - role: `ADMIN`
   - status: `ACTIVE`
   - emailVerified: `true`

### Option 2: Create hash script

Create file: `scripts/create-admin.ts`
```typescript
import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/db';

async function main() {
  const password = 'Admin@123';
  const hash = await bcrypt.hash(password, 12);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: hash,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      referralCode: 'ADMIN001',
    },
  });
  
  console.log('Admin created:', admin.email);
}

main();
```

Run:
```bash
npx tsx scripts/create-admin.ts
```

✅ Admin account created!

---

## Step 8: Test Postback Handler (Optional)

### Test with curl (or browser)

```bash
curl "http://localhost:3000/api/postback?user_id=USER_ID&offer_id=OFFER_ID&payout=1.00&transaction_id=TEST123&security_token=your-cpalead-secret&network=cpalead"
```

Expected response:
```json
{
  "status": "OK",
  "message": "Postback processed successfully",
  "rewardPoints": 400
}
```

✅ Postback handler is working!

---

## Troubleshooting

### Port 3000 Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Use different port
npm run dev -- -p 3001
```
Then open: http://localhost:3001

### Database Connection Error

**Error**: `Can't reach database server`

**Solutions**:
1. Verify PostgreSQL is running (check Services)
2. Check DATABASE_URL is correct
3. Try: `postgresql://postgres:postgres@localhost:5432/cpa_rewards`
4. Restart PostgreSQL service

### Prisma Client Error

**Error**: `@prisma/client did not initialize yet`

**Solution**:
```bash
npx prisma generate
npm run dev
```

### Module Not Found

**Error**: `Cannot find module '@/lib/...'`

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

---

## Next Steps

Now that installation is complete:

1. **Build Authentication Pages**
   - Registration form
   - Login form
   - Email verification

2. **Build Dashboard**
   - User stats
   - Offer wall
   - Withdrawal page

3. **Build Admin Panel**
   - User management
   - Withdrawal approvals
   - Fraud logs

4. **Get CPA Network Accounts**
   - Sign up for CPAlead, CPAGrip
   - Get API keys
   - Configure postbacks

5. **Setup Payment Gateways**
   - Stripe account
   - PayPal business account
   - NOW Payments (crypto)

---

## Support

If you run into issues:

1. Check the error message carefully
2. Search error on Google
3. Check Next.js docs: nextjs.org
4. Check Prisma docs: prisma.io

---

## ✅ Installation Complete!

You now have:
- ✅ Node.js installed
- ✅ PostgreSQL database running
- ✅ All dependencies installed
- ✅ Database tables created
- ✅ Development server running
- ✅ Landing page accessible

**You're ready to start building!** 🚀

---

*Last Updated: December 2025*
