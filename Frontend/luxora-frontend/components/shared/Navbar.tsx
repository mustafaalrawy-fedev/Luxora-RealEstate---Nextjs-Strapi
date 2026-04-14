"use client";

import { NavigationLinks } from "../ui/navigation-links";
import { ModeToggle } from "./theme-toggle";
import Logo from "./Logo";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AuthBtnLoading } from "./LoadingState";

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // check session status
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  // get user type from session
  const userType = session?.user?.user_type;
  const dashboardLink = 
    userType?.toLowerCase() === "agent" ? "/agent" : 
    userType?.toLowerCase() === "buyer" ? "/buyer" : "/register";

  return (
    <nav className="flex justify-center items-center container-space h-20 fixed top-0 left-0 right-0 bg-background/20 backdrop-blur-sm z-50 border-b border-white/10">
      <div className="flex justify-between items-center w-full">
        <Logo />
        
        <div className="flex items-center gap-10">
          <NavigationLinks className="gap-8" />
          <ModeToggle />
        </div>

        <div className="flex items-center gap-2">
          {isLoading ? (
            // when loading status with skeleton
            <AuthBtnLoading />
          ) : isAuthenticated ? (
            // when user is authenticated
            <>
              <Button 
                variant="outline" 
                className="bg-transparent border border-white/20 text-white" 
                onClick={() => router.push(dashboardLink)}
              >
                Dashboard
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </Button>
            </>
          ) : (
            // when user is not authenticated | guest
            <>
              <Button 
                variant="outline" 
                className="bg-transparent border border-white/20 text-white" 
                onClick={() => router.push('/login')}
              >
                Login
              </Button>
              <Button 
                variant="default" 
                onClick={() => router.push('/register')}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;