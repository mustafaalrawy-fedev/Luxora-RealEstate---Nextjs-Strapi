import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import qs from "qs"
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PRICE_OPTIONS, BEDROOMS_OPTIONS, BATHROOMS_OPTIONS } from '@/constants'



export const useProperties = ({filter=true, pageSizeAmount=9}: {filter?: boolean, pageSizeAmount?: number}) => {

    const searchParams = useSearchParams()

  const status = searchParams.get('status') as 'Sale' | 'Rent' | null
  const type = searchParams.get('type')
  const country = searchParams.get('country')
  const city = searchParams.get('city')

    /*
    ================
    = Pagination =
    ================
    */
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1)
    const page = searchParams.get('page') || currentPage
    const pageSize = pageSizeAmount

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
    ? (price.includes(',') ? price.split(',').map(Number) : price.split('-').map(Number))
    : price;


    const query = qs.stringify({
        populate: {
        featured_image: { populate: "*" },
        district: { populate: { city: { populate: {country: true} } } },
        property_type: { populate: "*" },
        agent: { populate: {properties: {populate: "*"}} }
        },
        pagination: {
        page: page,
        pageSize: pageSize,
        },
        filters: {
            ...(filter && {
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
            })
        },
        sort: 'createdAt:desc',
    }, {encodeValuesOnly: true})

    const { data, isLoading, error } = useQuery({
        queryKey: ['all-properties', page, status, type, country, city, bedroom, bathroom, price],
        queryFn: async() => {
            const res = await axiosInstance.get(`/properties?${query}`) // All properties
            return res.data
        },
        // staleTime: 5 * 60 * 1000,
        // gcTime: 10 * 60 * 1000,
        staleTime: 0,               // Data is considered "old" immediately
        refetchOnMount: true,       // Refetch every time the component loads
        refetchOnWindowFocus: true, // Refetch when the user switches tabs back to your app
        // refetchInterval: 10000,     // (Optional) Poll the server every 10 seconds for new listings
    })

    const properties = data?.data
    const meta = data?.meta?.pagination
    const totalPages = meta?.pageCount || 1

    const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    // Smooth scroll to the top of the properties grid
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  return {
    properties,
    isLoading,
    error,
    totalPages,
    currentPage,
    handlePageChange,
    pageSize
  }
}
