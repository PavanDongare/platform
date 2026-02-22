import { getUserContext } from '@/lib/auth/get-user-context'
import { TenantProvider } from '@/lib/auth/tenant-context'
import { redirect } from 'next/navigation'
import { UserNav } from '@/components/navigation/user-nav'

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode
}) {
  const ctx = await getUserContext()

  if (!ctx) {
    redirect('/auth/login')
  }

  return (
    <TenantProvider value={{
      userId: ctx.userId,
      tenantId: ctx.tenantId,
      isAdmin: ctx.isAdmin
    }}>
      <div className="flex flex-col h-screen">
        <UserNav email={ctx.email} />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </TenantProvider>
  )
}
