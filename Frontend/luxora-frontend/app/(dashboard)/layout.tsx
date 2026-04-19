import DashboardSectionLayout from "@/components/dashboard/DashboardSectionLayout"
import DeviceGuard from "@/components/dashboard/DeviceGuard"


const DashboardLayout = ({children}: {children: React.ReactNode}) => {
return (
    <DeviceGuard>
        <DashboardSectionLayout>
            {children}
        </DashboardSectionLayout>
    </DeviceGuard>
  );
}

export default DashboardLayout