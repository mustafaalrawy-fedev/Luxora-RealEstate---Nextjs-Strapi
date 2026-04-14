"use client"

import Image from 'next/image'
import PropertyCard from './PropertyCard'
import MainHeading from '../shared/MainHeading'
import PropertyDetailsResponse from '@/types/property'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axios'
import qs from 'qs'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { PropertiesSkeleton } from '../shared/LoadingState'
import ErrorState from '../shared/ErrorState'
import PropertyFilter from './PropertyFilter'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { PRICE_OPTIONS, BEDROOMS_OPTIONS, BATHROOMS_OPTIONS } from '@/constants'

const PropertiesContent = () => {

  const searchParams = useSearchParams()

  const status = searchParams.get('status') as 'Sale' | 'Rent' | null
  const type = searchParams.get('type')
  const country = searchParams.get('country')
  const city = searchParams.get('city')

  /*
    ================
    = Bedroom Filter =
    ================
  */
  const bedroom = searchParams.get('bedrooms')
  const selectedBedroomOption = [...BEDROOMS_OPTIONS]
    .find(opt => opt.value === bedroom);
  const bedroomOperator = selectedBedroomOption?.operator || '$gte';
  const finalBedroom = (bedroomOperator === '$between' && bedroom) 
    ? bedroom.split(',').map(Number) || bedroom.split('-').map(Number)
    : bedroom;

  /*
    ================
    = Bathroom Filter =
    ================
  */
  const bathroom = searchParams.get('bathrooms')
  const selectedBathroomOption = [...BATHROOMS_OPTIONS]
    .find(opt => opt.value === bathroom);
  const bathroomOperator = selectedBathroomOption?.operator || '$gte';
  const finalBathroom = (bathroomOperator === '$between' && bathroom) 
    ? bathroom.split(',').map(Number) || bathroom.split('-').map(Number)
    : bathroom;

  /*
    ================
    = Price Filter =
    ================
  */
  const price = searchParams.get('price')
  const selectedOption = [...PRICE_OPTIONS.SALE, ...PRICE_OPTIONS.RENT]
    .find(opt => opt.value === price);
  const operator = selectedOption?.operator || '$lte';
  // If it's between, Strapi needs an array [min, max]
  const finalPrice = (operator === '$between' && price) 
    ? price.split(',').map(Number) || price.split('-').map(Number)
    : price;

  /*
    ================
    = Pagination =
    ================
  */
  const [currentPage, setCurrentPage] = useState(1)
  const page = searchParams.get('page') || currentPage
  const pageSize = 9

  /*
    ================
    = Query = 
    ================
  */
  const query = qs.stringify({
    populate: {
      featured_image: { populate: "*" },
      district: { populate: { city: { populate: {country: true} } } },
      property_type: { populate: "*" },
    },
    pagination: {
      page: currentPage,
      pageSize: pageSize,
    },
    filters: {
      property_status: status ? {$eq: status} : undefined,
      property_type: type ? { slug: { $eq: type } } : undefined,
      // bedroom: bedroom ? {$gte: bedroom} : undefined,
      bedroom: bedroom ? { [bedroomOperator]: finalBedroom } : undefined,
      // bathroom: bathroom ? {$gte: bathroom} : undefined,
      bathroom: bathroom ? { [bathroomOperator]: finalBathroom } : undefined,
      // price: price ? {$lte: price} : undefined,
      price: price ? { [operator]: finalPrice } : undefined,
      district: {
  city: {
    // Level 1: Filter by City Slug
    slug: city ? { $eq: city } : undefined,
    
    // Level 2: Filter by Country Slug (NESTED inside city)
    country: {
      slug: country ? { $eq: country } : undefined
    }
  }
},
    },
    sort: 'createdAt:desc',
  }, {encodeValuesOnly: true})

    const { data, isLoading, error } = useQuery({
        queryKey: ['all-properties', page, status, type, bedroom, bathroom, price, country, city],
        queryFn: async() => {
            const res = await axiosInstance.get(`/properties?${query}`) // All properties
            return res.data
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })

    const properties = data?.data
    const meta = data?.meta?.pagination
    const totalPages = meta?.pageCount || 1

    const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    // Smooth scroll to the top of the properties grid
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  return (
    <>
    {/* <section className='h-screen w-full'> */}
    <section className='h-[60vh] w-full relative'>
        <div className='relative flex justify-center items-center h-full w-full'>
            <Image loading='eager' priority src="/images/propertieshero2.jpg" alt="Hero" fill className='object-cover absolute top-0 left-0 right-0 bottom-0 z-10'/>
          <div className="absolute inset-0 bg-black/50 z-10"></div>
            <div className='container-space relative z-20 text-center'>
                <h1 className="">Properties</h1>
                <p className="max-w-lg text-lg mx-auto">Discover our curated selection of premium properties, each offering a unique blend of luxury, comfort, and style.</p>
            </div>
        </div>
        {/*   Start Property Filter */}
        <div className="container-space h-fit absolute bottom-[-50px] left-0 right-0 z-20 w-[70%] mx-auto">
            <PropertyFilter />
        </div>
        {/*   End Property Filter */}
    </section>
    {/* End Hero Section */}
    {/* Start Properties Section */}
    <section className="container-space py-20 h-fit min-h-[50vh]">
      <MainHeading title="Our Properties" description="Discover our curated selection of premium properties, each offering a unique blend of luxury, comfort, and style." />

      <AnimatePresence mode='wait' initial={false}>
        {isLoading ? <PropertiesSkeleton count={pageSize} /> : error ? <ErrorState variant="All" /> : 
        <motion.div 
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: -20}}
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
        <div className="mt-20">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) handlePageChange(currentPage - 1)
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {/* Generate Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    isActive={page === pageNum}
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(pageNum)
                    }}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) handlePageChange(currentPage + 1)
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>
      </>
  )
}

export default PropertiesContent