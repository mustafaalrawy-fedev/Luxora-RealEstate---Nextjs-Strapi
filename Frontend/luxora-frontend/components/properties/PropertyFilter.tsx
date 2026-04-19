"use client"

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axios'
import { BEDROOMS_OPTIONS, PRICE_OPTIONS, BATHROOMS_OPTIONS } from '@/constants'
import FilterSelect from '../shared/FilterSelect'
import { Filter } from 'lucide-react'
import PropertyDetails from '@/types/property'
import { useFilterStore } from '@/store/useFilterStore'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet'
import { ScrollArea } from '../ui/scroll-area'

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
    <>
    <div className='hidden lg:block w-full'>
      <DesktopFilter 
        searchParams={searchParams} 
        handleFilterChange={handleFilterChange} 
        handleClearFilters={handleClearFilters} 
        currentStatus={currentStatus} 
        currentCountry={currentCountry} 
        propertyTypesData={propertyTypesData} 
        citiesData={citiesData} 
        countriesData={countriesData} 
        PriceOptions={PriceOptions} 
        BEDROOMS_OPTIONS={BEDROOMS_OPTIONS} 
        BATHROOMS_OPTIONS={BATHROOMS_OPTIONS} />
    </div>
    <div className='lg:hidden w-full flex justify-end items-end'>
      <MobileFilter 
        searchParams={searchParams} 
        handleFilterChange={handleFilterChange} 
        handleClearFilters={handleClearFilters} 
        currentStatus={currentStatus} 
        currentCountry={currentCountry} 
        propertyTypesData={propertyTypesData} 
        citiesData={citiesData} 
        countriesData={countriesData} 
        PriceOptions={PriceOptions} 
        BEDROOMS_OPTIONS={BEDROOMS_OPTIONS} 
        BATHROOMS_OPTIONS={BATHROOMS_OPTIONS} />
    </div>
    </>
  )
}

export default PropertyFilter


export function DesktopFilter ({
  searchParams, 
  handleFilterChange, 
  handleClearFilters, 
  currentStatus, 
  currentCountry, 
  propertyTypesData, 
  citiesData, 
  countriesData, 
  PriceOptions, 
  BEDROOMS_OPTIONS, 
  BATHROOMS_OPTIONS}: {searchParams: URLSearchParams, 
    handleFilterChange: (name: string, value: string) => void, 
    handleClearFilters: () => void, 
    currentStatus: string | null, 
    currentCountry: string | null, 
    propertyTypesData: PropertyDetails, 
    citiesData: PropertyDetails, 
    countriesData: PropertyDetails, 
    PriceOptions: {id: number, value: string, label: string}[], 
    BEDROOMS_OPTIONS: {id: number, value: string, label: string}[], 
    BATHROOMS_OPTIONS: {id: number, value: string, label: string}[]}) {
  return (
    <aside className="w-full bg-card rounded-md p-8 shadow-xl border">
      {/* <div className="flex justify-between items-center flex-row gap-5"> */}
      <div className="flex justify-between items-center flex-row  gap-5">

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

export function MobileFilter ({
  searchParams, 
  handleFilterChange, 
  handleClearFilters, 
  currentStatus, 
  currentCountry, 
  propertyTypesData, 
  citiesData, 
  countriesData, 
  PriceOptions, 
  BEDROOMS_OPTIONS, 
  BATHROOMS_OPTIONS}: {searchParams: URLSearchParams, 
    handleFilterChange: (name: string, value: string) => void, 
    handleClearFilters: () => void, 
    currentStatus: string | null, 
    currentCountry: string | null, 
    propertyTypesData: PropertyDetails, 
    citiesData: PropertyDetails, 
    countriesData: PropertyDetails, 
    PriceOptions: {id: number, value: string, label: string}[], 
    BEDROOMS_OPTIONS: {id: number, value: string, label: string}[], 
    BATHROOMS_OPTIONS: {id: number, value: string, label: string}[]}) {

      const { isOpen, onClose } = useFilterStore();
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90dvh] rounded-t-[2rem] p-0 flex flex-col">
        <SheetHeader className="p-6 text-left border-b">
          <SheetTitle className="text-2xl font-bold">Refine Search</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-8 pb-10">
            {/* Reuse your FilterSelect components here */}
            {/* Example: */}
            <FilterSelect
              label="Property Status"
              options={[{ id: 1, value: "Sale", label: "For Sale" }, { id: 2, value: "Rent", label: "For Rent" }]}
              value={searchParams.get("status") || ""}
              onValueChange={(value) => handleFilterChange("status", value)}
            />
            
            <FilterSelect
              label="Property Type"
              options={propertyTypesData?.map((type: {id: number, type_name: string, slug: string}) => ({
                id: type.id,
                value: type.slug,
                label: type.type_name,
              })) || []}
              value={searchParams.get("type") || ""}
              onValueChange={(value) => handleFilterChange("type", value)}
            />

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
          </div>
        </ScrollArea>

        <SheetFooter className="p-6 border-t bg-background flex gap-3 flex-row">
          <Button 
            variant={searchParams.size > 0 ? "destructive" : "outline"} 
            // className={cn("flex-1 rounded-xl", searchParams.size > 0 && "bg-destructive text-white")} 
            className={"flex-1 rounded-xl"} 
            onClick={() => {
              handleClearFilters();
              onClose();
            }}
          >
            {searchParams.size > 0 ? "Clear All" : "Clear"}
          </Button>
          <Button 
            className="flex-2 rounded-xl" 
            onClick={onClose}
          >
            Show Results
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export const FloatingFilterBtn = () => {
  const { onOpen } = useFilterStore();
  const searchParams = useSearchParams();
  const activeFilters = searchParams.size;

  return (
    <Button
      onClick={onOpen}
      variant="outline"
      size="lg"
      className="flex items-center gap-2 transition-all lg:hidden"
    >
      <Filter size={20} />
      <span className="font-semibold">Filters</span>
      {activeFilters > 0 && (
        <span className="bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ml-1">
          {activeFilters}
        </span>
      )}
    </Button>
  );
};