import Script from 'next/script';
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter',
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ['400', '500', '600', '700'],
    variable: '--font-poppins',
});

export const metadata: Metadata = {
    title: "TaskSpot | Earn Crypto, Cash & Rewards by Completing Tasks",
    description: "Join TaskSpot, the best GPT platform to earn money online. Complete surveys, CPAGrip offers, and micro-tasks to get paid in Crypto, PayPal, or Gift Cards. Fast payouts and global access.",
    keywords: [
        "TaskSpot",
        "taskspot.site",
        "earn money online",
        "task earn",
        "gpt earn",
        "offerwall",
        "CPAGrip offers",
        "make money 2026",
        "rewards platform",
        "legit earning site",
        "earn crypto by tasks"
    ],
    authors: [{ name: "TaskSpot Team" }],
    // Google Search Console ভেরিফিকেশন এখানে যোগ করা হয়েছে
    verification: {
        google: "qr54Eel2NO8DtmRm92oVVFT-1VYG8N8moYaxDpdjtTc",
    },
    openGraph: {
        title: "TaskSpot - Earn Rewards Today",
        description: "Join TaskSpot and start earning by completing high-value tasks.",
        url: "https://taskspot.site",
        siteName: "TaskSpot",
        images: [
            {
                url: "/taskspot-logo.png",
                width: 1200,
                height: 630,
                alt: "TaskSpot Banner",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "TaskSpot | Earn Rewards Online",
        description: "Earn money online with TaskSpot by completing simple offers.",
        images: ["/taskspot-logo.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} ${poppins.variable} antialiased`}>
                {/* Crisp Support Chat Script */}
                <Script id="crisp-chat" strategy="afterInteractive">
                    {`
            window.$crisp=[];
            window.CRISP_WEBSITE_ID="d9b40391-5192-42a0-abef-1b677d59b0f4";
            (function(){
              d=document;
              s=d.createElement("script");
              s.src="https://client.crisp.chat/l.js";
              s.async=1;
              d.getElementsByTagName("head")[0].appendChild(s);
            })();
          `}
                </Script>

                <Providers>{children}</Providers>
            </body>
        </html>
    );
}