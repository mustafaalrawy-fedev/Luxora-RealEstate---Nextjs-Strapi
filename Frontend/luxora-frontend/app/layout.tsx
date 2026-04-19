import type { Metadata } from "next";
import ReactQueryProvider from "@/components/providers/reactQueryProvider";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { NextAuthProvider } from "@/components/providers/nextAuthProvider";
// import Navbar from "@/components/shared/Navbar";
// import Footer from "@/components/shared/Footer";
import { oxanium, dmSans, oxaniumHeading } from "@/lib/fonts";
import { Toaster } from "sonner"
import { InitialLoader } from "@/components/providers/InitialLoader";


export const metadata: Metadata = {
  title: "Luxora",
  description: "Find your dream home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", oxanium.variable, dmSans.variable, oxaniumHeading.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextAuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ReactQueryProvider>
            <InitialLoader>
            <main>{children}</main>
            </InitialLoader>
            <Toaster position="top-right" richColors duration={2500} closeButton/>
          </ReactQueryProvider>
        </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
