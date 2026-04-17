import DashboardSectionLayout from "@/components/dashboard/DashboardSectionLayout"


const DashboardLayout = ({children}: {children: React.ReactNode}) => {
return (
    <DashboardSectionLayout>
        {children}
    </DashboardSectionLayout>
  );
}

export default DashboardLayout