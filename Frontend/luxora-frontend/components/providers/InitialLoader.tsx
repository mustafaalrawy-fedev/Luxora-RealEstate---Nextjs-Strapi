// components/providers/InitialLoader.tsx
"use client";
import { useState, useEffect } from "react";
import Loading from "@/app/loading";

export const InitialLoader = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial asset loading
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  return <>{children}</>;
};