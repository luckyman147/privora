export function DashboardLoading() {
  return (
    <>
      <div className="flex items-center justify-between px-10 pt-10 pb-8">
        <div className="space-y-2">
          <div className="h-7 w-32 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-4 w-40 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="h-10 w-28 bg-slate-100 rounded-xl animate-pulse" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 px-10 pb-10 items-start">
        <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>

        <div className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-56 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    </>
  )
}

export default function Loading() {
  return <DashboardLoading />
}
