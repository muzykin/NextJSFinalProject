"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Recipe {
  id: string;
  title: string;
  description: string;
  cookingTime: number;
  difficulty: string;
  createdAt: string;
  author: {
    name: string | null;
    email: string;
  };
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await fetch("/api/recipes");
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        setError("Could not load recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
          Discover & Share Amazing Recipes 🍽️
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
          Join our community of home cooks. Find inspiration for your next meal or share your own culinary masterpieces with the world.
        </p>
        <Link href="/recipes/create">
          <Button size="lg" className="font-semibold">
            Share a Recipe
          </Button>
        </Link>
      </section>

      {/* Recipes Grid */}
      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Latest Recipes</h2>
        
        {loading ? (
          <div className="text-center text-slate-500 py-10">Loading recipes... 🍳</div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">{error}</div>
        ) : recipes.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-xl border border-slate-100 shadow-sm text-slate-500">
            <p className="mb-4">No recipes found yet.</p>
            <Link href="/recipes/create">
              <Button variant="outline">Be the first to create one!</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div 
                key={recipe.id} 
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-slate-900 line-clamp-1">
                      {recipe.title}
                    </h3>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">
                    {recipe.description}
                  </p>
                  
                  <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      ⏱️ {recipe.cookingTime} mins
                    </span>
                    <span className="flex items-center gap-1">
                      {recipe.difficulty === "Easy" ? "🟢" : recipe.difficulty === "Medium" ? "🟡" : "🔴"} {recipe.difficulty}
                    </span>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>By: {recipe.author.name || recipe.author.email.split('@')[0]}</span>
                    <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}