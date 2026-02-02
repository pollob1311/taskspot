# 🔐 TaskSpot OAuth Setup Guide

To enable "Login with Google" and "Login with Outlook" (Azure AD), you need to create accounts in their developer portals and get your **Client ID** and **Client Secret**.

---

## 🔵 Part 1: Setup Google Login

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a **New Project** named `TaskSpot`.
3.  Go to **APIs & Services** > **OAuth consent screen**.
    -   Select **External**.
    -   Fill in the App Name (`TaskSpot`) and User support email.
    -   Add `taskspot.site` to **Authorized domains**.
4.  Go to **APIs & Services** > **Credentials**.
5.  Click **Create Credentials** > **OAuth client ID**.
    -   Application Type: **Web application**.
    -   **Authorized JavaScript origins**:
        -   `http://localhost:3000`
        -   `https://taskspot.site`
    -   **Authorized redirect URIs**:
        -   `http://localhost:3000/api/auth/callback/google`
        -   `https://taskspot.site/api/auth/callback/google`
6.  Copy the **Client ID** and **Client Secret**.
7.  Add them to your `.env` file:
    ```env
    GOOGLE_CLIENT_ID="your_google_client_id"
    GOOGLE_CLIENT_SECRET="your_google_client_secret"
    ```

---

## 🟠 Part 2: Setup Outlook Login (Azure AD)

1.  Go to the [Azure Portal](https://portal.azure.com/).
2.  Search for **App registrations** and click **New registration**.
    -   Name: `TaskSpot`.
    -   Supported account types: **Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)**.
    -   Redirect URI (Optional): Select **Web** and enter `https://taskspot.site/api/auth/callback/azure-ad`.
        -   *Note: For local testing, add `http://localhost:3000/api/auth/callback/azure-ad` later.*
3.  After registering, copy the **Application (client) ID** and **Directory (tenant) ID**.
4.  Go to **Certificates & secrets** > **New client secret**.
    -   Description: `TaskSpot Secret`.
    -   Copy the **Value** (not the Secret ID).
5.  Add them to your `.env` file:
    ```env
    AZURE_AD_CLIENT_ID="your_azure_ad_client_id"
    AZURE_AD_CLIENT_SECRET="your_azure_ad_secret_value"
    AZURE_AD_TENANT_ID="common" 
    ```
    *Note: Use `common` for `AZURE_AD_TENANT_ID` if you want to allow any Microsoft account.*

---

## 🔄 After Updating `.env`

1.  Restart your development server: `npm run dev`.
2.  If you are using Vercel, make sure to add these environment variables in the **Vercel Dashboard** > **Settings** > **Environment Variables**.
3.  Deploy again if necessary.
