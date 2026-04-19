import MainHeading from "@/components/shared/MainHeading"
import Image from "next/image"
import ContactUsForm from "@/components/forms/ContactUsForm"

const ContactUs = () => {
  return (
    <>
    <section className='h-[50vh] w-full relative flex flex-col items-center justify-center'>
    <Image src="https://images.unsplash.com/photo-1774917063446-44d49ce14e0a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D" alt="Login" fill className="object-cover rounded-r-3xl w-full h-full" />
    <div className="absolute inset-0 bg-black/50 z-20"></div>
    <div className="container-space z-20 text-center">
        <h1 className="text-white">Contact Us</h1>
        <p className="max-w-lg text-lg mx-auto text-white/80">Discover our curated selection of premium properties, each offering a unique blend of luxury, comfort, and style.</p>
    </div>
    </section>
    <section className="h-screen w-full flex flex-col items-center justify-center">
      <div className="container-space text-center">
      <MainHeading title="Get In Touch" description="Premium properties, each offering a unique blend of luxury, comfort, and style." />  
    </div>
    <div className="container-space">
      <article className="w-full">
       <ContactUsForm fetchUrl="/api/contact"/>
      </article>
    </div>
    </section>
    </>
  )
}

export default ContactUs