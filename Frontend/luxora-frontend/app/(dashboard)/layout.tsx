import DashboardNavbar from "@/components/dashboard/DashboardNavbar"
import Sidebar from "@/components/dashboard/Sidebar"

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
return (
    <section className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen">
        <DashboardNavbar />
        <div className="p-8">
            {children}
        </div>
      </main>
    </section>
  );
}

export default DashboardLayout