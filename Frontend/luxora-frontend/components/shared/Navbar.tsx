"use client";

import { NavigationLinks } from "../ui/navigation-links";
import { ModeToggle } from "./theme-toggle";
import Logo from "./Logo";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AuthBtnLoading } from "./LoadingState";

const Header = () => {
  const { status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  // الآن الرابط دائماً يوجه إلى لوحة تحكم الوكيل
  const dashboardLink = "/agent";

  return (
    <nav className="flex justify-center items-center container-space h-20 fixed top-0 left-0 right-0 bg-background/20 backdrop-blur-sm z-50 border-b border-white/10">
      <div className="flex justify-between items-center w-full">
        <Logo />
        
        <div className="hidden md:flex items-center gap-10">
          <NavigationLinks className="gap-8" />
          <ModeToggle />
        </div>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <AuthBtnLoading />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="hidden sm:flex bg-transparent border border-white/20 text-white hover:bg-white/10" 
                onClick={() => router.push(dashboardLink)}
              >
                Dashboard
              </Button>

              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10" 
                onClick={() => router.push('/login')}
              >
                Login
              </Button>
              <Button 
                variant="default" 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => router.push('/register')}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;