import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import LoginForm from "@/components/auth/LoginForm"

const Login = () => {
  return (
    <section className=" h-screen min-h-fit flex justify-center items-center">
        <div className="grid grid-cols-2 gap-10 w-full h-full">
            {/* right side */}
            <aside className="w-full h-full relative hidden lg:block">
                <Image src="https://images.unsplash.com/photo-1446133132410-19df4d6610a1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHNreWxpbmV8ZW58MHx8MHx8fDA%3D" alt="Login" fill className="object-cover rounded-r-3xl w-full h-full" />
                {/* <div className="absolute inset-0 bg-black/10 z-10"></div> */}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/20 to-transparent z-20"></div>
                {/* link return to Property Page */}
                <div className="absolute top-10 left-10 z-30">
                  <Link href="/properties" className="flex text-black/80 items-center gap-2 hover:text-black transition-colors duration-300">
                    <ArrowLeft className="" size={24} strokeWidth={1.5} />
                    <p className="text-black">Show All Properties</p>
                  </Link>
                </div>
            </aside>
            {/* left side */}
            <LoginForm />
        </div>
    </section>
  )
}

export default Login