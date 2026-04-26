"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface EditRecipePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditRecipePage({ params }: EditRecipePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const recipeId = resolvedParams.id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cookingTime: "",
    difficulty: "Easy",
  });

  // Fetch existing recipe data when page loads
  useEffect(() => {
    async function fetchRecipe() {
      try {
        const response = await fetch(`/api/recipes`);
        if (!response.ok) throw new Error("Failed to fetch recipes");
        
        const recipes = await response.json();
        // Find our specific recipe
        const recipe = recipes.find((r: any) => r.id === recipeId);
        
        if (!recipe) {
          setError("Recipe not found or you don't have permission");
          setFetching(false);
          return;
        }

        // Load existing values into form state
        setFormData({
          title: recipe.title,
          description: recipe.description,
          cookingTime: recipe.cookingTime.toString(),
          difficulty: recipe.difficulty,
        });
        
        setFetching(false);
      } catch (err) {
        setError("Could not load recipe data");
        setFetching(false);
      }
    }

    fetchRecipe();
  }, [recipeId]);

  // Handle form submission (Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Redirect back to the recipe details page after successful edit
        router.push(`/recipes/${recipeId}`);
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update recipe");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center mt-20 text-slate-500">Loading recipe data...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-sm border border-slate-100">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Edit Recipe ✏️</h1>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Recipe Title
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description & Steps
          </label>
          <textarea
            required
            rows={5}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Cooking Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cooking Time (minutes)
            </label>
            <input
              type="number"
              required
              min="1"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              value={formData.cookingTime}
              onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value })}
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Difficulty
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            >
              <option value="Easy">Easy 🟢</option>
              <option value="Medium">Medium 🟡</option>
              <option value="Hard">Hard 🔴</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full" 
            onClick={() => router.push(`/recipes/${recipeId}`)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}