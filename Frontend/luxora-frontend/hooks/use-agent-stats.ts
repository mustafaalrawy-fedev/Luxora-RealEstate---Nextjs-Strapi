import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Home, MessageSquare, MapPin, TrendingUp, BarChart3, DollarSign } from "lucide-react";
import { useSession } from "next-auth/react";
import qs from "qs";

export const useAgentStats = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ["agent-stats", userId],
    queryFn: async () => {

      const propertyQuery = qs.stringify({
        populate: {district: true},
        filters: { agent: { id: { $eq: userId } } }
      });

      const inquiryQuery = qs.stringify({
        populate: { agent: true },
        filters: { agent: { id: { $eq: userId } } }
      });

      // تنفيذ الطلبين بالتوازي لسرعة الأداء
      const [propertiesRes, inquiriesRes] = await Promise.all([
        axiosInstance.get(`/properties?${propertyQuery}`),
        axiosInstance.get(`/inquiries?${inquiryQuery}`)
      ]);

      const properties = propertiesRes.data.data;
      const inquiries = inquiriesRes.data.data;

      const activeListings = properties.filter((p: {
        availability_status: string, 
        is_approved: string
      }) => (p.availability_status === "Available" || p.availability_status === "Off-plan") && p.is_approved === "approved" ).length;


      const calculateTopDistrict = () => {
        if (!properties || properties.length === 0) return "N/A";

        const districtCounts: Record<string, number> = {};
        
        properties.forEach((el: {district: {district_name: string}}) => {
          const name = el.district?.district_name;
          if (name) {
            districtCounts[name] = (districtCounts[name] || 0) + 1;
          }
        });

        // استخراج الاسم الذي يملك أعلى عدد
        const top = Object.entries(districtCounts).reduce(
          (a, b) => (b[1] > a[1] ? b : a),
          ["N/A", 0]
        );

        return top[0];
      };

      const calculateListingPerformance = () => {
        const totalProperties = properties.length;
        const data = {
            label: "Listing Performance",
            value: "N/A",
            trend: "Sales vs Total",
            icon: BarChart3,
            isPositive: "performance"
        }

          if(totalProperties === 0) return data;

          const salesProperties = properties.filter((p: {property_status: string}) => p.property_status === "Sale" ).length
          const salesPercentage = (salesProperties / totalProperties) * 100;

          return {
            ...data,
            value: `${salesPercentage.toFixed(2)}%`,
          }
      }

      const calculateAvgPriceInTopDistrict = (topDistrictName: string) => {
       if (topDistrictName === "N/A" || properties.length === 0) return "N/A";

        // 1. فلترة العقارات التي تنتمي لأهم منطقة
        const districtProperties = properties.filter(
            (p: {district: {district_name: string}}) => p.district?.district_name === topDistrictName
        );

        // 2. حساب متوسط السعر
        const totalPrice = districtProperties.reduce((sum: number, p: {price: string}) => sum + (Number(p.price) || 0), 0);
        const avgPrice = Math.round(totalPrice / districtProperties.length);

        // 3. تنسيق الرقم ليظهر بشكل فخم (مثلاً 1.2M بدلاً من 1200000)
        const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD', // أو EGP حسب مشروعك
            notation: 'compact',
        }).format(avgPrice);

        return formattedPrice;
        
      }

      const topDistrict = calculateTopDistrict()
      const avgPrice = calculateAvgPriceInTopDistrict(topDistrict);
      const performance = calculateListingPerformance();

      console.log(avgPrice)

      return [
        // Active Listings
        { 
          label: "Active Listings", 
          value: activeListings.toString(), 
          trend: `Total: ${properties.length}`,
          icon: Home,
          isPositive: properties.length > 0 ? "positive" : properties.length === 0 ? "neutral" : "negative",
          className: ""
        },
        // Inquiries
        { 
          label: "Inquiries", 
          value: inquiries.length.toString(), 
          trend: "Customer interests", 
          icon: MessageSquare,
          isPositive: inquiries.length > 0 ? "positive" : inquiries.length === 0 ? "neutral" : "negative",
          className: ""
        },
        // Top District
        { 
          label: "Top District", 
          value: topDistrict,
          trend: "Your Most Active Area", 
          icon: MapPin,
          isPositive: topDistrict !== "N/A" ? "district" : "neutral",
          className: ""
        },
        // Lead Conversion Rate
        {
          label: "Lead Conversion Rate",
          value: activeListings > 0 ? ((inquiries.length / activeListings) * 100).toFixed(2) + "%" : "0.00%",
          trend: "Inquiries to Views",
          icon: TrendingUp,
          isPositive: activeListings > 0 ? "positive" 
          : activeListings === 0 ? "neutral" : "negative",
          className: ""
        },
        // Avg. Price Area
        { 
          label: "Avg. Price Area", 
          value: avgPrice,
          trend: `Average in ${topDistrict}`, 
          icon: DollarSign,
          isPositive: "price",
          className: "lg:col-span-2"
        },
        // Listing Performance
        { 
          label: performance.label, 
          value: performance.value,
          trend: performance.trend, 
          icon: BarChart3,
          isPositive: performance.isPositive,
          className: "lg:col-span-2"
        },
      ];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });
};