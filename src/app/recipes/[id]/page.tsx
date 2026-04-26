import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { DeleteRecipeButton } from "@/components/DeleteRecipeButton";

interface RecipePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RecipePage({ params }: RecipePageProps) {
  const resolvedParams = await params;
  const recipeId = resolvedParams.id;

  // Fetch the recipe directly from the database
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });

  if (!recipe) {
    notFound();
  }

  // Check if the current user is the author
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  let currentUserId = null;

  if (token) {
    try {
      const secretKey = process.env.JWT_SECRET || "fallback-secret-key";
      const decoded = jwt.verify(token, secretKey) as { userId: string };
      currentUserId = decoded.userId;
    } catch (error) {
      // Invalid or expired token - ignore silently
    }
  }

  // Boolean flag to show/hide edit controls
  const isAuthor = currentUserId === recipe.authorId;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link href="/">
            <Button variant="ghost" className="-ml-4 text-slate-500">
              ← Back to all recipes
            </Button>
          </Link>
          
          {/* Conditionally render Edit and Delete buttons ONLY if user is the author */}
          {isAuthor && (
            <div className="flex items-center gap-3">
              <Link href={`/recipes/${recipe.id}/edit`}>
                <Button variant="outline">Edit Recipe</Button>
              </Link>
              <DeleteRecipeButton recipeId={recipe.id} />
            </div>
          )}
        </div>
        
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
        <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
          {recipe.description}
        </div>
      </div>
    </div>
  );
}