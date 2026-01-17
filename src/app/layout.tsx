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
    // গুগল সার্চ কনসোল ভেরিফিকেশন
    verification: {
        google: "qr54Eel2NO8DtmRm92oVVFT-1VYG8N8moYaxDpdjtTc",
    },
    // Canonical URL (গুগলকে আসল সাইট চেনানোর জন্য)
    alternates: {
        canonical: "https://www.taskspot.site",
    },
    openGraph: {
        title: "TaskSpot - Earn Rewards Today",
        description: "Join TaskSpot and start earning by completing high-value tasks.",
        url: "https://www.taskspot.site",
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
        <html lang="en">
            <head>
                {/* Structured Data for Google and AI (Schema Markup) */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            "name": "TaskSpot",
                            "url": "https://www.taskspot.site",
                            "description": "The best GPT platform to earn money online by completing micro-tasks.",
                            "potentialAction": {
                                "@type": "SearchAction",
                                "target": "https://www.taskspot.site/blog?q={search_term_string}",
                                "query-input": "required name=search_term_string"
                            }
                        })
                    }}
                />
            </head>
            <body className={`${inter.variable} ${poppins.variable} antialiased`}>


                <Providers>{children}</Providers>
            </body>
        </html>
    );
}