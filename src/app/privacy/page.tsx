export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-5xl font-black mb-12 text-gray-900 tracking-tight">Privacy Policy</h1>
                <div className="prose prose-blue text-gray-600 space-y-8">
                    <p className="text-lg">Your privacy is important to us. This policy explains how we collect and use your data.</p>
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Collection</h2>
                        <p>We collect your email, IP address, and browser information to ensure platform security and prevent fraud.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Third Parties</h2>
                        <p>We share limited data with our advertising partners to track offer completions and credit your account.</p>
                    </section>
                    <section className="pt-8 border-t border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                        <a href="mailto:support@taskspot.site" className="text-indigo-600 font-bold hover:underline">support@taskspot.site</a>
                    </section>
                </div>
            </div>
        </div>
    );
}
