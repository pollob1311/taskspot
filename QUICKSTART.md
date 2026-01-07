# TaskSpot - Quick Start Guide

## ✅ What You've Built

Your platform now has:

### 🎯 **Core Features**
- ✅ User Registration & Login
- ✅ Google OAuth Integration  
- ✅ Dashboard with Stats
- ✅ Offer Wall (Browse CPA Offers)
- ✅ Welcome Bonus (50 points)
- ✅ Fraud Detection System
- ✅ Payment Gateway Integration
- ✅ CPA Postback Handler

---

## 🚀 How to Use Your Platform

### 1. Start the Server
```bash
npm run dev
```
Open: **http://localhost:3000**

### 2. Create Your Account
- Go to http://localhost:3000/register
- Fill in your details
- You'll get 50 welcome points!

### 3. Login
- Go to http://localhost:3000/login
- Use your credentials or Google sign-in
- You'll be redirected to dashboard

### 4. View Dashboard
- See your balance (starts with $0.05 from welcome bonus)
- View stats (total earned, pending, completed offers)
- Quick actions: Browse Offers, Refer Friends

### 5. Browse Offers
- Click "Browse Offers" from dashboard
- Filter by category and country
- Click "Start Offer" to begin earning

---

## 📊 Testing the Platform

### Add Test Offers (Manual)

Since CPA networks aren't connected yet, add test offers manually via Prisma Studio:

```bash
npx prisma studio
```

1. Open `Offer` table
2. Click "Add Record"
3. Fill in:
   - title: "Download Free App"
   - cpaNetwork: "cpalead"
   - externalOfferId: "12345"
   - payout: 1.00
   - userReward: 0.40 (40% of payout)
   - rewardPoints: 400
   - countries: ["US", "GB", "CA"]
   - deviceTypes: ["mobile", "desktop"]
   - category: "app"
   - difficulty: "EASY"
   - isActive: true
   - isFeatured: true
4. Click "Save"

Now you'll see this offer on the Offer Wall!

### Simulate Postback (Test Rewards)

Test the reward system by simulating a CPA postback:

```bash
curl "http://localhost:3000/api/postback?user_id=YOUR_USER_ID&offer_id=YOUR_OFFER_ID&payout=1.00&transaction_id=TEST123&security_token=your-cpalead-secret&network=cpalead"
```

Replace:
- `YOUR_USER_ID` - Copy from Prisma Studio (User table)
- `YOUR_OFFER_ID` - Copy from Prisma Studio (Offer table)
- `your-cpalead-secret` - From your `.env` file

**Expected Response**:
```json
{
  "status": "OK",
  "message": "Postback processed successfully",
  "rewardPoints": 400
}
```

Check dashboard - you should see **+400 points** in pending balance!

---

## 🔧 What's Missing (Next Steps)

To make this production-ready, you still need:

### High Priority:
1. **Connect Real CPA Networks**
   - Sign up for CPALead, CPAGrip
   - Get API keys
   - Update `.env` with real secrets
   - Configure postback URLs in their dashboards

2. **Email Verification**
   - Set up SMTP (Gmail, SendGrid)
   - Add email templates
   - Send verification emails on registration

3. **Withdrawal Pages**
   - Build withdrawal request form
   - Add payment method selection
   - Create withdrawal history page

4. **Admin Panel**
   - User management
   - Withdrawal approvals
   - Fraud logs viewer
   - Analytics dashboard

### Medium Priority:
5. **Referral System UI**
   - Show referral link
   - Display commission earnings
   - Referral leaderboard

6. **Transaction History**
   - List all points earned/spent
   - Filter by type
   - Export to CSV

### Low Priority:
7. **Profile Settings**
   - Edit profile
   - Change password
   - Upload avatar

8. **Legal Pages**
   - Terms & Conditions
   - Privacy Policy
   - Disclaimer

---

## 🎨 Customization

### Change Colors
Edit `src/app/globals.css`:
```css
:root {
  --primary: #667eea; /* Your brand color */
  --secondary: #f093fb;
}
```

### Change Welcome Bonus
Edit `src/app/api/auth/register/route.ts`:
```typescript
points: 50, // Change to any amount
```

### Change Revenue Split
Edit `.env`:
```
USER_REWARD_PERCENTAGE=0.40  # 40% to users
PLATFORM_REVENUE_PERCENTAGE=0.60  # 60% to you
```

---

## 🐛 Common Issues

### Issue: "Unauthorized" error on dashboard
**Fix**: Make sure you're logged in. Check if session is working by logging `console.log(session)`.

### Issue: Offers not showing
**Fix**: Add test offers via Prisma Studio (see "Add Test Offers" above).

### Issue: Google sign-in not working
**Fix**: You need to configure Google OAuth:
1. Go to https://console.cloud.google.com/
2. Create OAuth 2.0 credentials
3. Add to `.env`:
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```

---

## 📱 Deployment

When ready to launch:

### Option 1: Vercel (Easiest)
```bash
npm install -g vercel
vercel
```

### Option 2: Railway
- Push to GitHub
- Connect repository on Railway.app
- Add environment variables
- Deploy

### Option 3: DigitalOcean
- Create Droplet (Ubuntu)
- Install Node.js, PostgreSQL, Nginx
- Clone repo and run

---

## 💰 Revenue Calculation

Example with 1000 users:
- 1000 users complete 5 offers each = 5000 completions
- Average CPA payout = $1.00
- Total CPA revenue = $5,000
- **Your Earnings (60%)** = **$3,000**
- **User Rewards (40%)** = **$2,000**

---

## 🎉 You're Ready!

Your TaskSpot platform is **functional and ready for testing**.  

**Next immediate steps:**
1. Add test offers via Prisma Studio
2. Test registration → login → dashboard → offers flow
3. Simulate postback to test rewards
4. Build admin panel for withdrawal approvals

**Questions?**  
Check the `README.md` and `INSTALLATION.md` files!

---

*Platform created: December 2025*  
*Status: Phase 2 Complete - Core User Flow Working* ✅
