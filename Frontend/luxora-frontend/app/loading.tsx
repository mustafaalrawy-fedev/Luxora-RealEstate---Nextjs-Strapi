import Logo from "@/components/shared/Logo";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[120px] rounded-full" />

      <div className="relative flex flex-col items-center gap-8">
        {/* Animated Logo */}
        <div className="animate-pulse duration-1000">
          <Logo />
        </div>

        {/* The Progress Bar Container */}
        <div className="relative w-64 h-[2px] bg-muted overflow-hidden rounded-full">
          {/* This is the shimmering moving part */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer" />
        </div>

        {/* Minimalist Text */}
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground animate-pulse">
          Crafting Excellence
        </p>
      </div>
    </div>
  );
}