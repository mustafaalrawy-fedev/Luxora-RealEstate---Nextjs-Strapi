import MainHeading from "@/components/shared/MainHeading"
import Image from "next/image"
import Link from "next/link"
import { UserPlus, ArrowLeft } from "lucide-react"
import RegisterForm from "@/components/auth/RegisterForm"

const Register = () => {
  return (
    <section className=" h-screen min-h-fit flex justify-center items-center">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-10 w-full h-full">
            {/* right side */}
            <article className="container-space w-full h-full flex flex-col justify-center items-center relative">
                <UserPlus className="text-primary mb-5" size={48} strokeWidth={1.5} />
                <div className="w-full flex justify-center text-center">
                    <MainHeading title="Sign Up" description="Create a new account" showButton={false} />
                </div>
                <RegisterForm />
                    <div className="flex items-center gap-2.5 justify-center absolute bottom-10 w-full">
                        <p className="text-left text-sm text-muted-foreground tracking-wider">Already have an account? </p>
                        <Link href="/login" className="text-primary font-semibold hover:underline text-sm">Login</Link>
                    </div>
            </article>
            {/* left side */}
            <aside className="w-full h-full relative hidden lg:block">
                <Image src="https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2t5bGluZXxlbnwwfHwwfHx8MA%3D%3D" alt="Login" fill className="object-cover rounded-l-3xl w-full h-full" />
                {/* <div className="absolute inset-0 bg-black/10 z-10"></div> */}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/20 to-transparent z-20"></div>
                {/* link return to Property Page */}
                <div className="absolute top-10 left-10 z-30">
                  <Link href="/properties" className="flex text-white/80 items-center gap-2 hover:text-white transition-colors duration-300">
                    <ArrowLeft className="" size={24} strokeWidth={1.5} />
                    <p className="text-inherit">Show All Properties</p>
                  </Link>
                </div>
            </aside>
        </div>
    </section>
  )
}

export default Register