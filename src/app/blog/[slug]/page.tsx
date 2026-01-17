import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/lib/blog-data';

export function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = blogPosts.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/blog" className="inline-flex items-center text-indigo-600 font-bold mb-8 hover:underline">
                    ← Back to Blog
                </Link>

                <article className="bg-white p-8 md:p-16 rounded-[50px] shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>

                    <div className="flex flex-wrap items-center gap-4 text-indigo-600 font-bold mb-8">
                        <span className="px-4 py-1.5 bg-indigo-50 rounded-full text-xs uppercase tracking-widest">{post.category}</span>
                        <span className="text-slate-400 text-sm">{post.date}</span>
                        <span className="text-slate-400 text-sm">• {post.readTime}</span>
                        <span className="text-slate-400 text-sm">• By {post.author}</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
                        {post.title}
                    </h1>

                    <div className="prose prose-lg text-slate-600 space-y-8 max-w-none">
                        {post.content}
                    </div>

                    <div className="mt-12 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-slate-500 font-medium">Ready to start earning?</p>
                        <Link href="/register" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl hover:scale-105 active:scale-95">
                            JOIN TASKSPOT NOW
                        </Link>
                    </div>
                </article>
            </div>
        </div>
    );
}
