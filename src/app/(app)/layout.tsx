import UserHeader from '@/components/dashboard/UserHeader'

export const dynamic = 'force-dynamic'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <UserHeader />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
