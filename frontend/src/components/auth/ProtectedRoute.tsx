"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false 
}: { 
  children: React.ReactNode; 
  requireAdmin?: boolean; 
}) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (requireAdmin && !isAdmin) {
      router.replace("/dashboard");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthorized(true);
  }, [loading, isAuthenticated, isAdmin, requireAdmin, router]);

  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#070B14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">Checking Session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
