export default function FAQPage() {
    const faqs = [
        { q: "How much can I earn?", a: "Earnings depend on your activity and location. Active users commonly earn $50-$200 per week." },
        { q: "When do I get paid?", a: "Withdrawals are processed within 24-48 hours once requested. Minimum withdrawal is $5.00." },
        { q: "Is it really free?", a: "Yes, TaskSpot is 100% free to join and use. We earn commission from our advertising partners." },
        { q: "Can I use a VPN?", a: "No, the use of VPNs or proxies is strictly prohibited and will result in an immediate permanent ban." }
    ];

    return (
        <div className="min-h-screen bg-white py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-5xl font-black mb-12 text-gray-900 tracking-tight">Frequently Asked Questions</h1>
                <div className="space-y-8">
                    {faqs.map((faq, i) => (
                        <div key={i} className="glass-card p-8 rounded-2xl border-gray-100">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">{faq.q}</h3>
                            <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
