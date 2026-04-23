interface PropertyDetails {
    id: number;
    documentId: string;
    price: number;
    area_size_sqft: number;
    bedroom: number;
    bathroom: number;
    property_status: string;
    property_name: string;
    slug: string;
    short_description: string;
    long_description: string;
    developer: string;
    construction_status: string;
    build_year: string;
    publishedAt?: string | null;
    is_approved?: "pending" | "approved" | "rejected";
    // is_approved_copy?: boolean;
    rejected_message?: string;
    availability_status?: "Available" | "Rented" | "Sold" | "Off-plan" | undefined;
    featured_image: {
        url: string;
        name: string;
        caption: string;
        alternativeText: string;
        id: number;
    }
    media: {
        url: string;
        name: string;
        caption: string;
        alternativeText: string;
        id: number;
    }[]
    amenities: {
        id: number;
        amenity_name: string;
        category: string;
        short_description: string;
        slug: string;
        amenity_image: {
            url: string;
            name: string;
            caption: string;
            alternativeText: string;
            id: number;
        }
    }[]
    property_type: {
        id: number;
        type_name: string;
        slug: string;
    }
    district: {
        id: number;
        district_name: string;
        slug: string;
        coordinates: {
            lat: number;
            lng: number;
        }
        city: {
            id: number;
            city_name: string;
            slug: string;
            country: {
                id: number;
                country_name: string;
                slug: string;
            }
        }
    }
    agent: {
        id: number;
        username: string;
        phone: string;
        bio: string;
        social_links: {
            whatsapp: string;
            telegram: string;
            instagram: string;
            facebook: string;
            twitter: string;
            linkedin: string;
        },
        avatar: {
            url: string;
            caption: string;
            alternativeText: string;
            id: number;
        }
    }
}

// interface PropertyDetailsResponse {
//     data: PropertyDetails[];
//     meta: {
//         pagination: {
//             page: number;
//             pageSize: number;
//             pageCount: number;
//             total: number;
//         }
//     }
// }

export default PropertyDetails