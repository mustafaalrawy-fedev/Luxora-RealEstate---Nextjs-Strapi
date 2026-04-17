"use client"

import Sidebar from './shared/Sidebar'
import AlertBanner from './shared/AlertBanner'
import DashboardNavbar from './shared/DashboardNavbar'
import { useProfile } from '@/hooks/use-profile'

const DashboardSectionLayout = ({children}: {children: React.ReactNode}) => {
  const { data: profile } = useProfile();
  return (
       <section className="flex">
      <Sidebar profile={profile}/>
      <main className="flex-1 min-h-screen">
        <AlertBanner />
        <DashboardNavbar />
        <div className="p-8">
            {children}
        </div>
      </main>
    </section>
  )
}

export default DashboardSectionLayout