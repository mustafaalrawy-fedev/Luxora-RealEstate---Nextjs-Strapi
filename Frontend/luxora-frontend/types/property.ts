interface PropertyDetails {
    id: number;
    document_id: string;
    price: number;
    area_size_sqft: number;
    bedroom: number;
    bathroom: number;
    property_status: string;
    property_name: string;
    slug: string;
    short_description: string;
    long_description: string;
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
        avatar: {
            url: string;
            caption: string;
            alternativeText: string;
            id: number;
        }
    }
}

interface PropertyDetailsResponse {
    data: PropertyDetails[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        }
    }
}

export default PropertyDetails