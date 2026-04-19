"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const HomeHero = () => {
    const router = useRouter();
  return (
    <section className='h-[calc(100vh-300px)] w-full'>
        {/* <section className='h-screen w-full'> */}
        <div className='relative flex justify-center items-center h-full w-full'>
            <Image loading='eager' priority src="/images/homehero2.jpg" alt="Hero" fill className='object-cover absolute top-0 left-0 right-0 bottom-0 z-10' />
          <div className="absolute inset-0 bg-black/50 z-10"></div>
            <div className='container-space relative z-20 text-center'>
                <h1 className="text-white">Luxora</h1>
                <p className="max-w-lg text-lg mx-auto text-white/80">Premium real estate designed for those who seek sophistication, exclusivity, and timeless value.</p>
                {/* CTA Buttons */}
                <div className="flex justify-center items-center gap-4 mt-8">
                    <Button variant="default" onClick={() => router.push('/properties')}>Browse Properties</Button>
                    {/* <Button variant="outline" onClick={() => router.push('/agents')}>Browse Agents</Button> */}
                    <Button variant="outline" className='text-primary border-primary hover:bg-primary hover:text-primary-foreground hover:border-primary' onClick={() => router.push('/contact-us')}>Contact Us</Button>
                </div>
            </div>
        </div>
    </section>
  )
}

export default HomeHero