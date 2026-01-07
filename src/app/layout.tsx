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
    title: "TaskSpot - Earn Rewards by Completing Simple Tasks",
    description: "Join TaskSpot and earn money online by completing simple tasks and offers. Get paid in crypto, PayPal, gift cards, and more. Instant withdrawals, global access, and $500k+ already paid out.",
    keywords: "earn money online, complete tasks, rewards platform, CPA offers, PayPal rewards, cryptocurrency earnings, gift cards, make money, online income, task rewards, cash back, TaskSpot",
    authors: [{ name: "TaskSpot" }],
    openGraph: {
        title: "TaskSpot - Earn Rewards Completing Tasks",
        description: "Join thousands earning money by completing simple tasks. Get paid in crypto, PayPal, or gift cards.",
        type: "website",
        siteName: "TaskSpot",
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
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
