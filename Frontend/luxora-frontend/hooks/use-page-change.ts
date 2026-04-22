import { usePathname, useRouter } from "next/navigation";

export const usePageChange = (searchParams: URLSearchParams) => {
    const router = useRouter()
    const pathname = usePathname()
    
    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', String(newPage))
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
        // Smooth scroll to the top of the properties grid
        window.scrollTo({ top: 400, behavior: 'smooth' })
    }
    return { handlePageChange }
}