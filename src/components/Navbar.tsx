"use client"; 

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [user, setUser] = useState<{ name: string; email: string } | null | false>(null);

  // Check auth status whenever the page route changes
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(false);
        }
      } catch (error) {
        setUser(false);
      }
    }

    checkAuth();
  }, [pathname]); 

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(false); // Update state to trigger re-render
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-slate-900">
          🍽️ RecipeApp
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
          
          {/* Divider */}
          <div className="h-6 w-px bg-slate-200 mx-2" /> 

          {/* Conditional Rendering based on auth state */}
          {user === null ? (
            <div className="w-16 h-8" />
          ) : user ? (
            <>
              <Link href="/recipes/create">
                <Button variant="ghost">Add Recipe</Button>
              </Link>
              <span className="text-sm font-medium text-slate-600 mr-2">
                {user.name || user.email}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link href="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}