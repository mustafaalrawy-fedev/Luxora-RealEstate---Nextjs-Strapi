import { Button } from "../ui/button"

const ErrorState = ({variant="All"}: {variant?: "All" | "Featured" | "Search"}) => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 h-96 w-full">
        <h1 className="text-4xl font-bold text-error">{variant === "All" ? "No Properties Found" : variant === "Featured" ? "No Featured Properties Found" : "No Search Results Found"}</h1>
        <p className="text-lg text-muted-foreground">{variant === "All" ? "No properties found matching your criteria." : variant === "Featured" ? "No featured properties found matching your criteria." : "No search results found matching your criteria."}</p>
        <Button className="w-fit rounded-md flex justify-center items-center gap-2 hover:gap-4" variant="destructive" onClick={() => window.location.reload()}>Try Again</Button>
    </div>
  )
}

export default ErrorState