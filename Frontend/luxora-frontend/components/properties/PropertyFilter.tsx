"use client"

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axios'
import { BEDROOMS_OPTIONS, PRICE_OPTIONS, BATHROOMS_OPTIONS } from '@/constants'
import FilterSelect from '../shared/FilterSelect'

const PropertyFilter = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const currentStatus = searchParams.get('status') as 'Sale' | 'Rent' | null; // Sale | Rent
  // 1. Fallback logic: If no status, show Sale options or a "Select Status First" message
  const PriceOptions = currentStatus === 'Rent' ? PRICE_OPTIONS.RENT : PRICE_OPTIONS.SALE;

  // Handle filter change
  function handleFilterChange(name: string, value: string) {
    const params = new URLSearchParams(searchParams)
    if (value && value !== "") {
      params.set(name, value)
    } else {
      params.delete(name)
    }

    if (name === 'status') {
      params.delete('price')
    }

    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // Handle clear filters
  function handleClearFilters() {
    router.push(pathname, { scroll: false })
  }

  // Fetch property types
  const { data: propertyTypesData } = useQuery({
    queryKey: ['property-types'],
    queryFn: async() => {
        const res = await axiosInstance.get(`/property-types`) // All properties
        return res.data.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  // Fetch Cities
  const currentCountry = searchParams.get('country') as string | null;
  const { data: citiesData } = useQuery({
      queryKey: ['cities', currentCountry],
      queryFn: async() => {
          const res = await axiosInstance.get(`/cities?filters[country][slug][$eq]=${currentCountry}`) // cities by country
          return res.data.data
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
  })

  // Fetch Countries
  const { data: countriesData } = useQuery({
      queryKey: ['countries'],
      queryFn: async() => {
          const res = await axiosInstance.get(`/countries`) // All countries
          return res.data.data
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
  })

  return (
    <aside className="w-full bg-card rounded-md p-8 shadow-xl border">
      <div className="flex justify-between items-center flex-row gap-5">

        {/* 
        ========================
        = Start Status Filter = 
        ========================
        */}
        <FilterSelect
          label="Property Status"
          options={[
            { id: 1, value: "Sale", label: "For Sale" },
            { id: 2, value: "Rent", label: "For Rent" },
          ]}
          value={searchParams.get("status") || ""}
          onValueChange={(value) => handleFilterChange("status", value)}
        />

        {/* 
        ========================
        = Start Property Types Filter = 
        ========================
        */}
        <div className='w-full'>
          {/* <label htmlFor="property-types" className='block text-xs font-medium text-muted-foreground mb-2'>Property Types</label> */}
          <FilterSelect
            label="Property Types"
            options={propertyTypesData?.map((type: {id: number, type_name: string, slug: string}) => ({
              id: type.id,
              value: type.slug,
              label: type.type_name,
            })) || []}
            value={searchParams.get("type") || ""}
            onValueChange={(value) => handleFilterChange("type", value)}
          />
        </div>

        {/* 
        ========================
        = Start Country Filter = 
        ========================
        */}
          <FilterSelect
            label="Countries"
            options={countriesData?.map((country: {id: number, country_name: string, slug: string}) => ({
              id: country.id,
              value: country.slug,
              label: country.country_name,
            })) || []}
            value={searchParams.get("country") || ""}
            onValueChange={(value) => handleFilterChange("country", value)}
          />

        {/* 
        ========================
        = Start Cities Filter = 
        ========================
        */}
        { currentCountry && citiesData?.length > 0 && (
          <FilterSelect
            label="Cities"
            options={citiesData?.map((city: {id: number, city_name: string, slug: string}) => ({
              id: city.id,
              value: city.slug,
              label: city.city_name,
            })) || []}
            value={searchParams.get("city") || ""}
            onValueChange={(value) => handleFilterChange("city", value)}
          />
        )}

        {/* 
        =========================
        = Start Bedrooms Filter = 
        =========================
        */}
        <FilterSelect
          label="Beds"
          // options={[
          //   { id: 1, value: "2", label: "1+ Bedroom" },
          //   { id: 2, value: "3", label: "2+ Bedrooms" },
          //   { id: 3, value: "4", label: "3+ Bedrooms" },
          //   { id: 4, value: "5", label: "4+ Bedrooms" },
          //   { id: 5, value: "6", label: "5+ Bedrooms" },
          // ]}
          options={BEDROOMS_OPTIONS}
          value={searchParams.get("bedrooms") || ""}
          onValueChange={(value) => handleFilterChange("bedrooms", value)}
        />

        {/* 
        =========================
        = Start Bathroom Filter = 
        =========================
        */}
        <FilterSelect
          label="Baths"
          // options={[
          //   { id: 1, value: "2", label: "1+ Bathroom" },
          //   { id: 2, value: "3", label: "2+ Bathrooms" },
          //   { id: 3, value: "4", label: "3+ Bathrooms" },
          //   { id: 4, value: "5", label: "4+ Bathrooms" },
          //   { id: 5, value: "6", label: "5+ Bathrooms" },
          // ]}
          options={BATHROOMS_OPTIONS}
          value={searchParams.get("bathrooms") || ""}
          onValueChange={(value) => handleFilterChange("bathrooms", value)}
        />

        {/* 
        ========================
        = Start Price Filter = 
        ========================
        */}
        {currentStatus && 
        <FilterSelect
          label="Price"
          options={PriceOptions}
          value={searchParams.get("price") || ""}
          onValueChange={(value) => handleFilterChange("price", value)}
        />
        }

        {/* 
        ==================
        = Start Buttons = 
        ==================
        */}
        <div className='w-full'>
      <Button 
        onClick={handleClearFilters} 
        variant={searchParams.size > 0 ? "destructive" : "outline"}
        className='w-full'
        disabled={searchParams.size === 0}
      >
        Clear Filters
      </Button>
      </div>
      </div>
    </aside>
  )
}

export default PropertyFilter