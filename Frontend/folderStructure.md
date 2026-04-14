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
