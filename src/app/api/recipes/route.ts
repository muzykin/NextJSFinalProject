import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserFromToken } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: get all recipes (public endpoint, no auth required)
export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true, email: true }, 
        },
      },
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}

// POST: create a new recipe (requires authentication)
export async function POST(request: Request) {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to create a recipe." },
        { status: 401 }
      );
    }

    // Parse request data
    const body = await request.json();
    const { title, description, cookingTime, difficulty } = body;

    if (!title || !description || !cookingTime || !difficulty) {
      return NextResponse.json(
        { error: "All fields (title, description, cookingTime, difficulty) are required" },
        { status: 400 }
      );
    }

    const newRecipe = await prisma.recipe.create({
      data: {
        title,
        description,
        cookingTime: Number(cookingTime),
        difficulty,
        authorId: user.userId, // This links the recipe to the user
      },
    });

    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json({ error: "Failed to create recipe" }, { status: 500 });
  }
}