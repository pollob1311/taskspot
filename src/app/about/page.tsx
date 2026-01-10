export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* ৫ নম্বর লাইন - এসইও ফ্রেন্ডলি টাইটেল */}
                <h1 className="text-5xl font-black mb-8 text-gray-900 tracking-tight">
                    TaskSpot | Best Offerwall Site in the world
                </h1>

                <div className="prose prose-lg text-gray-600 space-y-6">
                    {/* ৮-৯ নম্বর লাইন - প্রথম প্যারাগ্রাফ */}
                    <p className="text-xl leading-relaxed">
                        Welcome to <strong>TaskSpot</strong>, the world&apos;s leading premium rewards platform and a
                        <strong> legit earning platform</strong>. We connect high-value users with top-tier brands
                        and global networks like CPAGrip,CPAlead,MyLead,earnstar,etc to provide the best high-paying tasks.
                    </p>

                    {/* ১১-১২ নম্বর লাইন - দ্বিতীয় প্যারাগ্রাফ */}
                    <p>
                        Founded in 2025, our mission is to provide an elite environment where users can earn
                        significant rewards by engaging with content they love. If you are looking for
                        <strong> how to earn from taskspot.site</strong>, simply complete micro-tasks, surveys,
                        and offers to get <strong>instant payouts</strong>. We prioritize security and a premium user experience.
                    </p>

                    <div className="grid grid-cols-2 gap-8 py-10">
                        <div className="glass-card p-6 rounded-2xl border-gray-100">
                            <h3 className="text-3xl font-bold text-purple-600 mb-2">500k+</h3>
                            <p className="text-sm">Active Members</p>
                        </div>
                        <div className="glass-card p-6 rounded-2xl border-gray-100">
                            <h3 className="text-3xl font-bold text-blue-600 mb-2">$2.5M</h3>
                            <p className="text-sm">Total Paid Out</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}