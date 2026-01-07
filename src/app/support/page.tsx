export default function SupportPage() {
    return (
        <div className="min-h-screen bg-white py-20">
            <div className="container mx-auto px-4 max-w-3xl text-center">
                <h1 className="text-5xl font-black mb-8 text-gray-900 tracking-tight">Direct Support</h1>
                <p className="text-xl text-gray-600 mb-12">Need personalized help? Our agents are online 24/7.</p>

                <div className="glass-card p-12 rounded-3xl border-purple-100 bg-gradient-to-br from-purple-50 to-white">
                    <div className="text-6xl mb-6">🎧</div>
                    <h2 className="text-2xl font-bold mb-4">Open a Ticket</h2>
                    <p className="text-gray-600 mb-8">Average response time: 2 hours</p>
                    <button className="btn-gradient px-12 py-4 rounded-xl font-bold text-lg">
                        Contact Support Team
                    </button>
                    <div className="mt-8 text-sm text-gray-400">
                        Or email us directly at: <span className="font-bold text-purple-600">support@cparewards.com</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
