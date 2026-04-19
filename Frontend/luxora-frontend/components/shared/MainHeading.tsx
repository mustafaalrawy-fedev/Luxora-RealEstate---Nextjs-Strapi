import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const MainHeading = ({title="", description="", buttonText="", buttonLink="", buttonVariant="default", showButton=false, className=""}: {title: string, description: string, buttonText?: string, buttonLink?: string, buttonVariant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link", showButton?: boolean, className?: string}) => {
  return (
    <header className={`flex lg:flex-row lg:justify-between lg:items-start mb-20  flex-col gap-5 justify-end items-end ${className}`}>
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Link href={buttonLink}>
        {showButton && (
        <Button  className="w-max flex justify-center items-center gap-2.5" variant={buttonVariant}>{buttonText} <ArrowRight /></Button>
        )}
        </Link>
      </header>
  )
}

export default MainHeading