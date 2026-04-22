import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import qs from "qs"
import { useSearchParams } from "next/navigation";
import { PRICE_OPTIONS, BEDROOMS_OPTIONS, BATHROOMS_OPTIONS } from '@/constants'
import { usePageChange } from "./use-page-change";


export const useProperties = ({ filter = true, pageSizeAmount = 9 }: { filter?: boolean; pageSizeAmount?: number }) => {
  const searchParams = useSearchParams()

  const status = searchParams.get('status') as 'Sale' | 'Rent' | null
  const type = searchParams.get('type')
  const country = searchParams.get('country')
  const city = searchParams.get('city')
  const district = searchParams.get('district')
  const bedroom = searchParams.get('bedrooms')
  const bathroom = searchParams.get('bathrooms')
  const price = searchParams.get('price')

  const currentPage = Number(searchParams.get('page') ?? 1)
  const pageSize = pageSizeAmount

  const { handlePageChange } = usePageChange(searchParams);

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


  // Query Filters
  const filters: any = {
    is_approved: { $eq: "approved" },
    availability_status: { $in: ["Available", "Off-plan"] },
  };

  if (status) filters.property_status = { $eq: status };
  if (type) filters.property_type = { slug: { $eq: type } };
  if (bedroom) filters.bedroom = { [bedroomOperator]: finalBedroom };
  if (bathroom) filters.bathroom = { [bathroomOperator]: finalBathroom };
  if (price) filters.price = { [operator]: finalPrice };
  // Build location filter
  if (district) {
    filters.district = { slug: { $eq: district } };
  } else if (city) {
    filters.district = { city: { slug: { $eq: city } } };
  } else if (country) {
    filters.district = { city: { country: { slug: { $eq: country } } } };
  }

  // Property Query
  const query = qs.stringify({
    populate: {
      featured_image: { populate: "*" },
      district: { populate: { city: { populate: { country: true } } } },
      property_type: { populate: "*" },
      agent: { populate: { properties: { populate: "*" }, avatar: {populate: "*"} } },
    },
    pagination: {
      page: currentPage,
      pageSize,
    },
    // filters: {
    //   ...(filter && {
    //     property_status: status ? { $eq: status } : undefined,
    //     property_type: type ? { slug: { $eq: type } } : undefined,
    //     bedroom: bedroom ? { [bedroomOperator]: finalBedroom } : undefined,
    //     bathroom: bathroom ? { [bathroomOperator]: finalBathroom } : undefined,
    //     price: price ? { [operator]: finalPrice } : undefined,
    //     district: {
    //       slug: district ? { $eq: district } : undefined,
    //       city: {
    //         slug: city ? { $eq: city } : undefined,
    //         country: { slug: country ? { $eq: country } : undefined },
    //       },
    //     },
    //     // is_approved: { $eq: true },
    //     is_approved: { $eq: "approved" },
    //     availability_status: { $in: ["Available", "Off-plan"] },
    //   }),
    // },
    ...(filter && { filters }),
    sort: 'createdAt:desc',
  }, { encodeValuesOnly: true })

  const { data, isLoading, error } = useQuery({
    queryKey: ['all-properties', currentPage, status, type, country, city, district, bedroom, bathroom, price],
    queryFn: async () => {
      const res = await axiosInstance.get(`/properties?${query}`)
      return res.data
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

  const properties = data?.data
  const meta = data?.meta?.pagination
  const totalPages = meta?.pageCount || 1

  return { properties, isLoading, error, totalPages, currentPage, handlePageChange, pageSize }
}