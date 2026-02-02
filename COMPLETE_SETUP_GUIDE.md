# 🛠️ TaskSpot: Complete Setup & Hosting Guide

This guide will walk you through the entire process of hosting your TaskSpot platform, from setting up the database to connecting your Namecheap domain.

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Step 1: Push Code to GitHub](#step-1-push-code-to-github)
3. [Step 2: Setup Database (PostgreSQL)](#step-2-setup-database-postgresql)
4. [Step 3: Deploy to Vercel (Hosting)](#step-3-deploy-to-vercel)
5. [Step 4: Push Database Schema](#step-4-push-database-schema)
6. [Step 5: Connect Namecheap Domain](#step-5-connect-namecheap-domain)
7. [Step 6: Setup Google & Outlook Login (Optional)](#step-6-setup-google--outlook-login)

---

## 1. Prerequisites
Before you start, make sure you have accounts on:
- [GitHub](https://github.com/) (To store your code)
- [Vercel](https://vercel.com/) (For hosting the website - Free)
- [Neon.tech](https://neon.tech/) or [Railway.app](https://railway.app/) (For the Database - Free/Paid)

---

## Step 1: Push Code to GitHub
Vercel needs your code to be on GitHub.
1. Create a **New Repository** on GitHub (keep it **Private**).
2. Open your terminal in the project folder and run:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

---

## Step 2: Setup Database (PostgreSQL)
We recommend **Neon.tech** because it is very fast and has a great free tier.
1. Sign up at [Neon.tech](https://neon.tech/).
2. Create a new project named `TaskSpot`.
3. Copy the **Connection String** (it starts with `postgresql://...`).
4. **Important**: Save this string; you will need it in the next step.

---

## Step 3: Deploy to Vercel
This is where your website will "live".
1. Log in to [Vercel](https://vercel.com/) using your GitHub account.
2. Click **Add New** > **Project**.
3. Import your `TaskSpot` repository.
4. Expand **Environment Variables** and add these:
   | Key | Value |
   | :--- | :--- |
   | `DATABASE_URL` | *Paste the Connection String from Neon.tech* |
   | `NEXTAUTH_SECRET` | *Type any long random string (e.g., `somerandomsecret123`)* |
   | `NEXTAUTH_URL` | `https://taskspot.site` |
5. Click **Deploy**.

---

## Step 4: Push Database Schema
Even though the code is deployed, your database is currently empty (no tables).
1. Open your terminal locally in this project folder.
2. Run this command:
   ```bash
   npx prisma db push
   ```
   > [!NOTE]
   > This command reads your `schema.prisma` file and creates all the necessary tables (Users, Offers, Transactions, etc.) in your online database.

---

## Step 5: Connect Namecheap Domain
1. In Vercel, go to **Settings** > **Domains**.
2. Add `taskspot.site`.
3. Log in to **Namecheap** > **Advanced DNS**.
4. Add these two records:
   - **A Record**: Host: `@`, Value: `76.76.21.21`
   - **CNAME Record**: Host: `www`, Value: `cname.vercel-dns.com`
5. Delete any other "Parking" records from Namecheap.

---

## ✅ You're All Set!
Once Vercel finishes the build and DNS propagates, your site will be live at `taskspot.site`.

---

## Step 6: Setup Google & Outlook Login
To enable traditional "Login with Google" or "Outlook" buttons:
1. Follow the [OAUTH_SETUP_GUIDE.md](file:///d:/all/website/cpa%20mm/OAUTH_SETUP_GUIDE.md).
2. Add the generated keys to your `.env` file and Vercel environment variables.

### 👨‍💻 Admin Setup
1. Register a new account on your site.
2. Go to your database (Neon.tech dashboard) or use `npx prisma studio` locally.
3. Change your user's `role` from `USER` to `ADMIN`.
4. Now you can access `taskspot.site/dashboard/admin` to manage everything!
