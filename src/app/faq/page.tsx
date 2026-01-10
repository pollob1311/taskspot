export default function FAQPage() {
    const faqs = [
        {
            question: "How can I earn money online in the world with TaskSpot?",
            answer: "TaskSpot is the easiest way to earn money online in the world. By joining our legit micro-task platform, you can complete simple CPAGrip and CPALead offers, take surveys, and earn rewards that can be converted into Cash or Crypto."
        },
        {
            question: "Is TaskSpot.site a legit earning platform or a scam?",
            answer: "TaskSpot is a 100% legit earning platform with thousands of active members. we prioritize security and provide fast withdrawal options for our global users, making us the best offerwall site for 2026."
        },
        {
            question: "How to earn from taskspot.site efficiently?",
            answer: "To maximize your earnings on taskspot.site, we recommend checking the 'Featured Offers' daily. These are usually high-paying tasks from networks like CPAGrip and earnstar that give the most reward for your time."
        },
        {
            question: "What are the withdrawal methods on TaskSpot?",
            answer: "We offer multiple payout options including PayPal rewards, Cryptocurrency (Bitcoin/Litecoin), and Gift Cards. As a top-tier rewards platform, we ensure your hard-earned money reaches you within 30minute-24hour payout."
        },
        {
            question: "Can I use a VPN to complete tasks on TaskSpot?",
            answer: "No. To maintain a secure and legit earning environment, using VPNs or proxies is strictly prohibited on taskspot.site. Accounts using such tools will be permanently banned."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-4xl font-black text-slate-900 mb-12 text-center">
                    Frequently Asked Questions | TaskSpot Help
                </h1>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-indigo-600 mb-4">{faq.question}</h3>
                            <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center p-10 bg-indigo-600 rounded-[40px] text-white">
                    <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                    <p className="mb-8 opacity-90">Can&apos;t find the answer you&apos;re looking for? Reach out to our team.</p>
                    <a href="mailto:support@taskspot.site" className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-black hover:scale-105 transition-all inline-block">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}