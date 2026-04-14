import FeaturedProperties from "@/components/properties/FeaturedProperties";
import MainHeading from "@/components/shared/MainHeading";
import { REASONS } from "@/constants";
import HomeHero from "@/components/blocks/home/HomeHero";
  

export default function Home() {
  return (
    <>
    {/* 
    ======================================
    Start Hero Section
    ======================================
    */}
      <HomeHero />
    {/* 
    ======================================
    End Hero Section
    ======================================
    */}

    {/* 
    ======================================
    Start Featured Properties Section
    ======================================
    */}
    <FeaturedProperties />
    {/* End Featured Properties Section */}

    {/* 
    ======================================
    Start Why Choose Us Section
    ======================================
    */}
    <section className="container-space py-20 h-fit">
      <MainHeading title="Why Choose Us" description="Premium real estate designed for those who seek sophistication, exclusivity, and timeless value." showButton={false} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 
        ======================================
        Why Choose Us Cards will go here  
        ======================================
        */}
        {REASONS.map((item) => (
            <article key={item.id} className="flex flex-col gap-8 text-center bg-card p-6 rounded-lg">
                <div className="flex justify-center items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-primary flex justify-center items-center"><item.icon /></div>
                    <h6 className="font-bold text-lg">{item.title}</h6>
                </div>
                <p className="text-muted-foreground">{item.description}</p>
            </article>
        ))}
      </div>
    </section>
    {/* 
    ======================================
    End Why Choose Us Section 
    ======================================
    */}
    {/* 
    ======================================
    Start CTA Section
    ======================================
    */}
    <section className="container-space py-20 h-fit">
      <MainHeading title="Ready to Find Your Dream Home?" description="Browse our exclusive collection of premium properties and discover the perfect place to call home." showButton={true} buttonText="Browse Properties" buttonLink="/properties" buttonVariant="default" />
    </section>
    {/* 
    ======================================
    End CTA Section
    ======================================
    */}
    </>
  );
}
