export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-5xl font-black mb-12 text-gray-900 tracking-tight">Terms & Conditions</h1>
                <div className="prose prose-blue text-gray-600 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing and using TaskSpot, you agree to be bound by these Terms and Conditions and our Privacy Policy.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
                        <p>You must be at least 18 years old or the legal age of majority in your jurisdiction to use this platform.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Prohibited Activities</h2>
                        <p>Multiple accounts, VPN usage, automated bots, and fraudulent offer completions are strictly forbidden.</p>
                    </section>
                    <section className="pt-8 border-t border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Contact Us</h2>
                        <p>If you have any questions regarding these terms, please contact our support team at:</p>
                        <a href="mailto:support@taskspot.site" className="text-indigo-600 font-bold hover:underline">support@taskspot.site</a>
                    </section>
                </div>
            </div>
        </div>
    );
}
