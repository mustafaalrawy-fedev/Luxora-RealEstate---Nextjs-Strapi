"use client"

import Image from 'next/image'
import PropertyCard from './PropertyCard'
import MainHeading from '../shared/MainHeading'
import PropertyDetailsResponse from '@/types/property'
import PropertyPagination from './PropertyPagination'
import { PropertiesSkeleton } from '../shared/LoadingState'
import ErrorState from '../shared/ErrorState'
import PropertyFilter, { FloatingFilterBtn } from './PropertyFilter'
import { AnimatePresence, motion } from 'motion/react'
import { useProperties } from '@/hooks/use-properties'
import { useSearchParams } from 'next/navigation'
import { itemVariants } from '@/components/motion'

const PropertiesContent = () => {
  const searchParams = useSearchParams()

 const {properties, isLoading, error, totalPages, currentPage, handlePageChange, pageSize} = useProperties({filter: true})

  return (
    <>
      {/* <section className='h-screen w-full'> */}
      <section className='h-[60vh] w-full relative'>
          <div className='relative flex justify-center items-center h-full w-full'>
              <Image loading='eager' priority src="/images/propertieshero2.jpg" alt="Hero" fill className='object-cover absolute top-0 left-0 right-0 bottom-0 z-10'/>
            <div className="absolute inset-0 bg-black/50 z-10"></div>
              <div className='container-space relative z-20 text-center'>
                  <h1 className="text-white">Properties</h1>
                  <p className="max-w-lg text-lg mx-auto text-white/80">Discover our curated selection of premium properties, each offering a unique blend of luxury, comfort, and style.</p>
              </div>
          </div>
          {/*   Start Property Filter */}
          <div className="lg:block hidden container-space h-fit absolute bottom-[-50px] left-0 right-0 z-20 w-[70%] mx-auto">
            <PropertyFilter status={true} type={true} price={true} location={true} rooms={true}/>
          </div>
          {/*   End Property Filter */}
      </section>
      {/* End Hero Section */}
      {/* Start Properties Section */}
      <section className="container-space py-20 h-fit min-h-[50vh]">
          <MainHeading title="Our Properties" description="Discover our curated selection of premium properties, each offering a unique blend of luxury, comfort, and style." />

        <div className=" lg:hidden mb-10 w-full flex justify-end items-end relative">
          <FloatingFilterBtn />
        </div>

        <AnimatePresence mode='wait' initial={false}>
          {isLoading ? <PropertiesSkeleton count={pageSize} /> : error ? <ErrorState variant="All" /> : 
          <motion.div 
            // initial={{opacity: 0, y: 20}}
            // animate={{opacity: 1, y: 0}}
            // exit={{opacity: 0, y: -20}}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{duration: 0.5}}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            key={searchParams.toString()}
          >
            {properties?.map((property: PropertyDetailsResponse) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </motion.div> 
          } 
        </AnimatePresence>
        
        {properties?.length === 0 && <ErrorState variant="Search"/>}

        {/* --- Shadcn Pagination --- */}
        <PropertyPagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
      </section>
    </>
  )
}

export default PropertiesContent