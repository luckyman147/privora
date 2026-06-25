export default function ResultsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-8" />
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-slate-100 rounded mb-2 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
