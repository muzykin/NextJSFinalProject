import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// DELETE: Remove a recipe by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const recipeId = resolvedParams.id;

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secretKey = process.env.JWT_SECRET || "fallback-secret-key";
    const decoded = jwt.verify(token, secretKey) as { userId: string };

    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (recipe.authorId !== decoded.userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own recipes" },
        { status: 403 }
      );
    }

    await prisma.recipe.delete({
      where: { id: recipeId },
    });

    return NextResponse.json({ message: "Recipe deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT: Update an existing recipe
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const recipeId = resolvedParams.id;

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secretKey = process.env.JWT_SECRET || "fallback-secret-key";
    const decoded = jwt.verify(token, secretKey) as { userId: string };

    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Verify ownership
    if (recipe.authorId !== decoded.userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only edit your own recipes" },
        { status: 403 }
      );
    }

    // Get new data from request body
    const body = await request.json();
    const { title, description, cookingTime, difficulty } = body;

    if (!title || !description || !cookingTime || !difficulty) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Update the recipe in database
    const updatedRecipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        title,
        description,
        cookingTime: Number(cookingTime),
        difficulty,
      },
    });

    return NextResponse.json({ recipe: updatedRecipe }, { status: 200 });
  } catch (error) {
    console.error("Error updating recipe:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}