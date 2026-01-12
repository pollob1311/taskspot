export default function LeaderboardPage() {
    return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-3xl flex items-center justify-center text-4xl mb-6">🏆</div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase mb-2">Leaderboard</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">The competition is heating up! The leaderboard will be live starting next week.</p>
        </div>
    );
}
