import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import qs from "qs"
import { useSearchParams } from "next/navigation";
import { PRICE_OPTIONS, BEDROOMS_OPTIONS, BATHROOMS_OPTIONS } from '@/constants'
import { useRouter, usePathname } from 'next/navigation'


export const useProperties = ({ filter = true, pageSizeAmount = 9 }: { filter?: boolean; pageSizeAmount?: number }) => {
  const router = useRouter()       // ← add this
  const pathname = usePathname()   // ← add this
  const searchParams = useSearchParams()

  const status = searchParams.get('status') as 'Sale' | 'Rent' | null
  const type = searchParams.get('type')
  const country = searchParams.get('country')
  const city = searchParams.get('city')
  const bedroom = searchParams.get('bedrooms')
  const bathroom = searchParams.get('bathrooms')
  const price = searchParams.get('price')

  // ── FIX: single source of truth — always read page from URL ───────────────
  // Removed useState(1) entirely. currentPage is always what the URL says.
  const currentPage = Number(searchParams.get('page') ?? 1)
  const pageSize = pageSizeAmount

  // handlePageChange now writes to the URL instead of local state
  // This means filter changes and page changes both live in the URL together
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  /*
  ================
  = Bedroom Filter =
  ================
*/
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
      district: { populate: { city: { populate: { country: true } } } },
      property_type: { populate: "*" },
      agent: { populate: { properties: { populate: "*" } } },
    },
    pagination: {
      page: currentPage,   // ← now always a number, never a mix of string/number
      pageSize,
    },
    filters: {
      ...(filter && {
        property_status: status ? { $eq: status } : undefined,
        property_type: type ? { slug: { $eq: type } } : undefined,
        bedroom: bedroom ? { [bedroomOperator]: finalBedroom } : undefined,
        bathroom: bathroom ? { [bathroomOperator]: finalBathroom } : undefined,
        price: price ? { [operator]: finalPrice } : undefined,
        district: {
          city: {
            slug: city ? { $eq: city } : undefined,
            country: { slug: country ? { $eq: country } : undefined },
          },
        },
      }),
    },
    sort: 'createdAt:desc',
  }, { encodeValuesOnly: true })

  const { data, isLoading, error } = useQuery({
    queryKey: ['all-properties', currentPage, status, type, country, city, bedroom, bathroom, price],
    queryFn: async () => {
      const res = await axiosInstance.get(`/properties?${query}`)
      return res.data
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

  const properties = data?.data
  const meta = data?.meta?.pagination
  const totalPages = meta?.pageCount || 1

  return { properties, isLoading, error, totalPages, currentPage, handlePageChange, pageSize }
}