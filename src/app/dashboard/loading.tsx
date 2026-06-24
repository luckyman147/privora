export function DashboardLoading() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
      ))}
    </div>
  )
}

export default function Loading() {
  return <DashboardLoading />
}
