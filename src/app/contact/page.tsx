export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-5xl font-black mb-8 text-gray-900 tracking-tight">Contact Us</h1>
                <p className="text-xl text-gray-600 mb-12">
                    Have questions or feedback? We&apos;d love to hear from you.
                </p>

                <div className="grid md:grid-cols-1 gap-8 mb-12">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📧</div>
                        <h3 className="font-bold text-slate-900 mb-2">Email Support</h3>
                        <p className="text-slate-500 mb-4 text-sm">Get in touch for payment or account issues.</p>
                        <a
                            href="mailto:support@taskspot.site"
                            className="text-indigo-600 font-bold hover:underline"
                        >
                            support@taskspot.site
                        </a>
                    </div>
                </div>

                <div className="glass-card p-10 rounded-3xl border-gray-200">
                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Name</label>
                                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Email</label>
                                <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4" placeholder="john@example.com" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Message</label>
                            <textarea rows={5} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4" placeholder="How can we help?"></textarea>
                        </div>
                        <button className="w-full btn-gradient py-5 rounded-2xl font-bold text-lg shadow-glow transition-all hover:scale-[1.02]">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
