# 🚀 TaskSpot Deployment Guide

Follow these steps to put your site online.

## Prerequisites
1.  **GitHub Account**: [Sign up here](https://github.com/)
2.  **Vercel Account**: [Sign up here](https://vercel.com/) (Login with GitHub)
3.  **Cloud Database**: I suggest **Railway.app** or **Supabase**.

---

## Step 1: Push Code to GitHub
1.  Initialize git if not already: `git init`
2.  Add files: `git add .`
3.  Commit: `git commit -m "Final production ready build"`
4.  Create a **Private** repo on GitHub.
5.  Follow GitHub's instructions to push:
    ```bash
    git remote add origin https://github.com/YOUR_USER/taskmint.git
    git push -u origin main
    ```

## Step 2: Set up Cloud Database (Railway)
1.  Go to [Railway.app](https://railway.app/).
2.  Start a new project > **Provision PostgreSQL**.
3.  Go to the "Variables" tab and copy the `DATABASE_URL`.

## Step 3: Deploy to Vercel
1.  Go to your Vercel Dashboard > **New Project**.
2.  Import your `taskmint` repository.
3.  **Environment Variables**: Add the following:
    - `DATABASE_URL`: (The one from Railway)
    - `NEXTAUTH_SECRET`: (Click "Generate" or type a random long string)
    - `NEXTAUTH_URL`: `https://your-domain.vercel.app`
4.  Click **Deploy**.

## Step 4: Finalize Database
1.  Once Vercel builds the app, navigate to your project folder locally.
2.  Temporarily update your local `.env` with the production Railway URL.
3.  Run: `npx prisma db push`
    > [!IMPORTANT]
    > This puts your tables on the cloud database.

---

## Step 5: Connect Custom Domain (Namecheap)
If you have a Namecheap domain like `taskspot.site`, please follow our specific guide:
👉 [Namecheap Domain Setup Guide](file:///c:/Users/wiliam%20t/OneDrive/Desktop/cpa%20mm/NAMECHEAP_DOMAIN_GUIDE.md)

---

## ✅ You're Live!
Your site will be available at your custom domain once DNS propagates.
