export default function HelpPage() {
    return (
        <div className="min-h-screen bg-white py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-5xl font-black mb-8 text-gray-900 tracking-tight">Help Center</h1>
                <p className="text-xl text-gray-600 mb-12">Find answers and help for common issues.</p>

                <div className="grid gap-6">
                    <div className="glass-card p-6 rounded-2xl border-gray-100 flex items-center justify-between group cursor-pointer">
                        <div>
                            <h3 className="font-bold text-gray-900">Getting Started</h3>
                            <p className="text-sm text-gray-500">Learn how to make your first dollar</p>
                        </div>
                        <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border-gray-100 flex items-center justify-between group cursor-pointer">
                        <div>
                            <h3 className="font-bold text-gray-900">Missing Credits</h3>
                            <p className="text-sm text-gray-500">What to do if an offer didn&apos;t track</p>
                        </div>
                        <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border-gray-100 flex items-center justify-between group cursor-pointer">
                        <div>
                            <h3 className="font-bold text-gray-900">Account Issues</h3>
                            <p className="text-sm text-gray-500">Security, password and login help</p>
                        </div>
                        <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
