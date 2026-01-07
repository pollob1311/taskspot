# 🌐 Namecheap Domain Setup Guide

Follow these steps to connect your **taskspot.site** domain from Namecheap to your project (assuming you are using Vercel).

## Step 1: Add Domain to Vercel
1. Go to your **Vercel Dashboard**.
2. Select your project.
3. Go to **Settings** > **Domains**.
4. Type `taskspot.site` and click **Add**.
5. Vercel will show you the **DNS Records** you need to add (an A record and a CNAME record).

---

## Step 2: Configure Namecheap DNS
1. Log in to [Namecheap.com](https://www.namecheap.com/).
2. Go to **Domain List** and click **Manage** next to `taskspot.site`.
3. Click on the **Advanced DNS** tab.
4. Click **Add New Record** and follow these instructions:

### A Record (for the main domain)
- **Type**: `A Record`
- **Host**: `@`
- **Value**: `76.76.21.21` (Vercel IP)
- **TTL**: `Automatic`

### CNAME Record (for www)
- **Type**: `CNAME Record`
- **Host**: `www`
- **Value**: `cname.vercel-dns.com`
- **TTL**: `Automatic`

---

## Step 3: Remove Old Records
If there are any existing **URL Redirect Records** or other A records, delete them so they don't conflict with the new settings.

---

## Step 4: Wait for Propagation
DNS changes can take from **5 minutes to 24 hours** to spread across the internet. 
- You can check the status at [DNSChecker.org](https://dnschecker.org/).
- Vercel will automatically show a green checkmark once the domain is connected.

---

## Step 5: Update `.env` Variable
Don't forget to update your environment variables in Vercel:
- `NEXTAUTH_URL`: Change this to `https://taskspot.site`

---

✅ **Success!** Once the propagation is complete, your site will be live at `https://taskspot.site`.
