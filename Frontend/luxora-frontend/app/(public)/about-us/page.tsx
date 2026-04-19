import MainHeading from "@/components/shared/MainHeading"
import Image from "next/image"

const AboutUs = () => {
  return (
    <>
     <section className='h-[80vh] w-full relative'>
      {/* Hero Section */}
      <div className="container-space flex items-center justify-center h-full w-full">
        <Image src="https://images.unsplash.com/photo-1635111031688-9b13c0125d12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGx1eHVyeSUyMHByb3BlcnR5JTIwMTYlM0E5fGVufDB8fDB8fHww" alt="About Us" fill className="object-cover rounded-r-3xl w-full h-full" />
        <div className="absolute inset-0 bg-black/50 z-20"></div>
        <div className="container-space z-20 text-center">
            <h1 className="text-white">About Us</h1>
            <p className="max-w-lg text-lg mx-auto text-white/80">Discover our curated selection of premium properties, each offering a unique blend of luxury, comfort, and style.</p>
        </div>
      </div>      
    </section>
    {/* about content section */}
    <section className="container-space py-20">
        <MainHeading title="About Us" description="Discover our curated selection of premium properties, each offering a unique blend of luxury, comfort, and style." />  
        <div>
          
        </div>
    </section>
    </>
  )
}

export default AboutUs