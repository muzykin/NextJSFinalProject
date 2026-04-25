import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Recipe Sharing App",
  description: "Share your favorite recipes with the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-slate-50">
          {/* Header/Navigation */}
          <header className="bg-white border-b sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-slate-900">
                🍽️ RecipeApp
              </Link>
              
              <nav className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="ghost">Home</Button>
                </Link>
                <Link href="/recipes/create">
                  <Button variant="ghost">Add Recipe</Button>
                </Link>
                <div className="h-6 w-px bg-slate-200 mx-2" /> {/* Divider */}
                <Link href="/login">
                  <Button variant="outline">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign up</Button>
                </Link>
              </nav>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}