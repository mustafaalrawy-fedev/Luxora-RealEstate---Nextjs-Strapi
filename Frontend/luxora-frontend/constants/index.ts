import { ShieldCheck, Zap, Globe } from "lucide-react";

// Navigation Links
export const NAV_LINKS = [
  { id: 1, label: "Home", href: "/" },
  { id: 2, label: "Properties", href: "/properties" },
  { id: 3, label: "About", href: "/about-us" },
  { id: 4, label: "Contact", href: "/contact-us" },
  // { id: 5, label: "Login", href: "/login" },
  // { id: 6, label: "Register", href: "/register" },
]


// Reasons to choose our platform
export const REASONS = [
  {
    id: 1,
    title: "Secure Transactions",
    description: "Every deal is backed by industry-leading security protocols.",
    icon: ShieldCheck,
  },
  {
    id: 2,
    title: "Global Reach",
    description: "Access to exclusive listings across 40+ countries.",
    icon: Globe,
  },
  {
    id: 3,
    title: "24/7 Support",
    description: "Premium real estate designed for those who seek sophistication, exclusivity, and timeless value.",
    icon: Zap,
  },
];

// Price options for sale and rent for filter
export const PRICE_OPTIONS = {
  SALE: [
    { id: 1, label: "Under 5M EGP", value: "5000000", operator: "$lte" },
    { id: 2, label: "5M - 10M EGP", value: "5000000,10000000", operator: "$between" },
    { id: 3, label: "10M - 15M EGP", value: "10000000,15000000", operator: "$between" },
    { id: 4, label: "15M - 20M EGP", value: "15000000,20000000", operator: "$between" },
    { id: 5, label: "20M - 25M EGP", value: "20000000,25000000", operator: "$between" },
    { id: 6, label: "Above 25M EGP", value: "25000000", operator: "$gte" },
  ],
  RENT: [
    { id: 1, label: "Under 8K EGP", value: "8000", operator: "$lte" },
    { id: 2, label: "8K - 10K EGP", value: "8000,10000", operator: "$between" },
    { id: 3, label: "10K - 15K EGP", value: "10000,15000", operator: "$between" },
    { id: 4, label: "15K - 20K EGP", value: "15000,20000", operator: "$between" },
    { id: 5, label: "20K - 25K EGP", value: "20000,25000", operator: "$between" },
    { id: 6, label: "Above 25K EGP", value: "25000", operator: "$gte" },
  ]
}

export const BEDROOMS_OPTIONS = [
  { id: 1, label: "1 Bedroom", value: "1", operator: "$eq" },
  { id: 2, label: "2 Bedrooms", value: "2", operator: "$eq" },
  { id: 3, label: "3 Bedrooms", value: "3", operator: "$eq" },
  { id: 4, label: "4 Bedrooms", value: "4", operator: "$eq" },
  { id: 5, label: "5 Bedrooms", value: "5", operator: "$eq" },
  { id: 6, label: "6+ Bedrooms", value: "6", operator: "$gte" },
]

export const BATHROOMS_OPTIONS = [
  { id: 1, label: "1 Bathroom", value: "1", operator: "$eq" },
  { id: 2, label: "2 Bathrooms", value: "2", operator: "$eq" },
  { id: 3, label: "3 Bathrooms", value: "3", operator: "$eq" },
  { id: 4, label: "4 Bathrooms", value: "4", operator: "$eq" },
  { id: 5, label: "5 Bathrooms", value: "5", operator: "$eq" },
  { id: 6, label: "6+ Bathrooms", value: "6", operator: "$gte" },
]