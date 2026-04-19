import { Monitor, Tablet } from "lucide-react";
// import Logo from "../shared/Logo";

export default function DeviceGuard({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* This div only shows on screens smaller than 1024px (lg).
         It uses 'fixed' to cover the entire screen and block interaction.
      */}
      <div className="lg:hidden fixed inset-0 z-100 flex flex-col items-center justify-center bg-background p-8 text-center">
        {/* <div className="mb-8">
           <Logo />
        </div> */}
        
        <div className="bg-primary/10 p-6 rounded-full mb-6">
          <Monitor className="text-primary w-12 h-12" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-4">
          Desktop Experience Recommended
        </h1>
        
        <p className="text-muted-foreground max-w-xs leading-relaxed">
          The agent dashboard is optimized for larger screens. For the best experience managing properties and inquiries, please switch to a **desktop or laptop**.
        </p>

        <div className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
           <Tablet size={16} />
           <span>Mobile version coming soon</span>
        </div>
      </div>

      {/* This only shows on large screens (lg and up) */}
      <div className="hidden lg:block">
        {children}
      </div>
    </>
  );
}