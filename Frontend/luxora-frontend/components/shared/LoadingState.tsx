import { Skeleton } from "../ui/skeleton"

export const PropertiesSkeleton = ({count=3}: {count?: number}) => {
  return (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="h-96 w-full" />
    ))}
</div>  
)
}

export const AuthBtnLoading = () => {
    return (
        <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm">Loading...</span>
        </div>
    )
}