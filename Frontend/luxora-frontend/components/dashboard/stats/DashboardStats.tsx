import { useAgentStats } from "@/hooks/use-agent-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowBigDown, ArrowBigUp, CircleDashed, Pin, BarChart3, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

const DashboardStats = () => {
    const {data, isLoading, isError} = useAgentStats()

    if(isLoading) return <div>Loading...</div>
    if(isError) return <div>Error: Something went wrong</div>

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data?.map((stat, i) => (
          <Card key={i} className={cn("border-none shadow-sm bg-card/50 backdrop-blur-md", stat.className)}> 
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-full">
              <h6>{stat.value}</h6>
              <p className="text-xs text-muted-foreground mt-2.5 flex items-center">
                {getStatIcon(stat.isPositive)}
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

const getStatIcon = (value: string) => {        
    if (value === "positive") return <ArrowBigUp className="mr-1 h-3 w-3 text-success" />
    if (value === "neutral") return <CircleDashed className="mr-1 h-3 w-3 text-muted-foreground" />
    if (value === "negative") return <ArrowBigDown className="mr-1 h-3 w-3 text-error" />
    if (value === "district") return <Pin className="mr-1 h-3 w-3 text-info" />
    if (value === "performance") return <BarChart3 className="mr-1 h-3 w-3 text-primary" />
    if (value === "price") return <DollarSign className="mr-1 h-3 w-3 text-primary" />
};

export default DashboardStats