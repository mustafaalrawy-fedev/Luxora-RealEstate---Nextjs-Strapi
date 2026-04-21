src/
├── app/ # Next.js App Router (Routing & Layouts)
│ ├── (public)/ # Route Group: Home, Listings, Agent Profiles
│ │ ├── properties/ # /properties/[id]
│ │ └── agents/ # /agents/[id]
│ ├── (auth)/ # Route Group: Login, Signup
│ ├── (dashboard)/ # Route Group: Agent/Admin Panel (Protected)
│ │ ├── manage-listings/
│ │ └── profile/
│ ├── api/ # Route Handlers (if needed)
│ ├── layout.tsx # Root layout (Providers go here)
│ └── page.tsx # Landing Page
├── components/ # React Components
│ ├── ui/ # shadcn/ui (Generated here)
│ ├── shared/ # Navbar, Footer, WhatsAppButton
│ ├── properties/ # PropertyCard, FilterSidebar, Gallery
│ ├── forms/ # ContactForm, AddPropertyForm (React Hook Form)
│ └── motion/ # Framer Motion Wrappers (Reveal, PageTransition)
├── hooks/ # Custom React Hooks
│ ├── use-auth.ts # Auth logic
│ └── use-properties.ts # React Query wrappers
├── lib/ # Third-party configurations
│ ├── axios.ts # Axios instance with Strapi BaseURL
│ ├── query-client.ts # React Query config
│ └── utils.ts # shadcn/ui cn() helper
├── services/ # API Service Layer (Axios calls)
│ ├── property.service.ts
│ └── agent.service.ts
├── store/ # State Management (Zustand)
│ ├── use-auth-store.ts
│ └── use-cart-store.ts
├── types/ # TypeScript Interfaces/Types
│ ├── property.ts
│ └── user.ts
└── styles/ # Global CSS & Tailwind config

##

# <!--

# =============================================================================================================

# =============================================================================================================

# =============================================================================================================

-->

###

src/
├── app/
│ ├── (public)/ # No-auth required pages
│ │ ├── layout.tsx # Main Navbar & Footer
│ │ ├── page.tsx # Home (Hero, Featured Properties)
│ │ ├── contact/ # Your Contact Us page
│ │ └── properties/ # Search results & Details
│ │ ├── page.tsx # Filterable list
│ │ └── [slug]/ # Individual property page (Dynamic)
│ ├── (auth)/ # NextAuth pages
│ │ ├── login/page.tsx
│ │ └── register/page.tsx
│ ├── (dashboard)/ # Protected Roles
│ │ ├── layout.tsx # Dashboard Sidebar & Header
│ │ ├── agent/ # /dashboard/agent/...
│ │ │ ├── properties/ # CRUD for their listings
│ │ │ └── inquiries/ # Leads they received
│ │ └── buyer/ # /dashboard/buyer/...
│ │ ├── favorites/ # Their saved homes
│ │ └── my-inquiries/ # Their sent messages
│ └── api/
│ └── auth/[...nextauth]/route.ts
├── components/
│ ├── shared/ # Navbar, Footer, PropertyCard
│ ├── forms/ # InquiryForm, PropertyEntryForm
│ ├── dashboard/ # Sidebar, StatsCard, DataTables
│ └── ui/ # Shadcn/UI components
├── store/ # Zustand stores (e.g., useFilterStore.ts)
├── hooks/ # Custom React Query hooks (e.g., useProperties.ts)
├── lib/ # axios.ts (Strapi config), auth.ts (NextAuth config)
└── middleware.ts # Protects /agent and /buyer routes
