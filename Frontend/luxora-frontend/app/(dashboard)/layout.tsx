import DashboardNavbar from "@/components/dashboard/DashboardNavbar"
import Sidebar from "@/components/dashboard/Sidebar"
import AlertBanner from "@/components/dashboard/AlertBanner"

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
return (
    <section className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen">
        <AlertBanner />
        <DashboardNavbar />
        <div className="p-8">
            {children}
        </div>
      </main>
    </section>
  );
}

export default DashboardLayout