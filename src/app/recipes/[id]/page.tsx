import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RecipePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RecipePage({ params }: RecipePageProps) {
  // Await params in newer Next.js versions
  const resolvedParams = await params;
  const recipeId = resolvedParams.id;

  // Fetch the recipe directly from the database
  const recipe = await prisma.recipe.findUnique({
    where: { 
      id: recipeId 
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });

  // If the recipe doesn't exist, show a 404 page
  if (!recipe) {
    notFound();
  }

  // Render the full recipe details
  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4 -ml-4 text-slate-500">
            ← Back to all recipes
          </Button>
        </Link>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
          {recipe.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-8 pb-8 border-b border-slate-100">
          <span className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full">
            ⏱️ {recipe.cookingTime} mins
          </span>
          <span className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full">
            {recipe.difficulty === "Easy" ? "🟢" : recipe.difficulty === "Medium" ? "🟡" : "🔴"} {recipe.difficulty}
          </span>
          <span className="bg-slate-50 px-3 py-1 rounded-full">
            👤 By: {recipe.author.name || recipe.author.email.split('@')[0]}
          </span>
          <span className="bg-slate-50 px-3 py-1 rounded-full">
            📅 {new Date(recipe.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="prose prose-slate max-w-none">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Instructions</h3>
        {/* Render description with preserved line breaks */}
        <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
          {recipe.description}
        </div>
      </div>
    </div>
  );
}