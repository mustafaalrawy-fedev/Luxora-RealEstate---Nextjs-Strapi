import { Flower } from "lucide-react"

const Logo = () => {
  return (
    <>
    <aside className="flex items-center justify-center gap-2">
    <Flower className="size-10 text-primary" />
    <div>
        <h6 className="text-md font-bold">Luxora</h6>
        <p className="text-xs font-light">Real Estate</p>
    </div>
    </aside>
    </>
  )
}

export default Logo