import Sidebar from "@/components/dashboard/Sidebar"

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
        {children}
      <Sidebar />
    </div>
  )
}

export default DashboardLayout