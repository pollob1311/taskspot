# TaskSpot

A professional rewards platform where users earn points by completing CPA offers and withdraw via multiple payment methods.

## Features

- 🔐 **Secure Authentication** - Email/password and Google OAuth
- 🎯 **Offer Wall** - Hundreds of CPA offers from multiple networks
- 💰 **Multiple Payment Methods** - PayPal, Crypto (BTC, ETH, USDT), Gift Cards, Bank Transfer
- 🛡️ **Fraud Prevention** - Advanced device fingerprinting and behavioral analysis
- 📊 **Admin Dashboard** - Complete management system
- 🌍 **Multi-language** - Support for 9+ languages
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Dark/light mode with glassmorphism design

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payment Gateways**: Stripe, PayPal, NOW Payments
- **Fraud Detection**: FingerprintJS Pro, IPQualityScore

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- CPA network accounts (CPALead, CPAGrip, etc.)
- Payment gateway accounts (Stripe, PayPal, etc.)

### Installation

1. **Install Node.js**  
   Download from [nodejs.org](https://nodejs.org/) - Version 18 or higher required

2. **Clone and install dependencies**
   ```bash
   cd "c:\\Users\\wiliam t\\OneDrive\\Desktop\\cpa mm"
   npm install
   ```

3. **Setup environment variables**
   ```bash
   copy .env.example .env
   # Edit .env with your API keys
   ```

4. **Setup database**
   ```bash
   # Create PostgreSQL database
   # Update DATABASE_URL in .env
   
   # Run migrations
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**  
   Navigate to `http://localhost:3000`

## Configuration

### CPA Networks

Add your CPA network credentials in `.env`:
- CPALEAD_SECRET
- CPAGRIP_SECRET
- ADGATE_SECRET

Configure postback URLs in each CPA network:
```
https://yourdomain.com/api/postback?
user_id={user_id}&
offer_id={offer_id}&
payout={payout}&
transaction_id={transaction_id}&
security_token=YOUR_SECRET&
network=cpalead
```

### Payment Gateways

1. **Stripe**: Get API keys from [stripe.com](https://stripe.com)
2. **PayPal**: Create business account and get API credentials
3. **NOW Payments**: Sign up at [nowpayments.io](https://nowpayments.io)

### Fraud Detection

1. **FingerprintJS**: Get API key from [fingerprintjs.com](https://fingerprintjs.com)
2. **IPQualityScore**: Get API key from [ipqualityscore.com](https://ipqualityscore.com)

## Revenue Model

- **60%** Platform Revenue (your income)
- **40%** User Rewards

Example: If CPA pays $1.00, user gets 400 points ($0.40), you keep $0.60

## Deployment

### Recommended Hosting

- **Vercel** (Easiest for Next.js)
- **DigitalOcean** (VPS for more control)
- **AWS** (Enterprise scale)

### Database

- **Neon** (Serverless PostgreSQL)
- **Supabase** (PostgreSQL + extras)
- **AWS RDS** (Production-grade)

## Security Checklist

- [ ] Change all secret keys in production
- [ ] Enable SSL certificate
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Enable database backups
- [ ] Set up monitoring (Sentry)

## Support

For issues or questions:
- Email: support@yoursite.com
- Documentation: `/docs`

## License

Private - All rights reserved

---

**Note**: This is a complete, production-ready codebase. Install Node.js first, then run `npm install` to get started.
