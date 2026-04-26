import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// GET: fetch all recipes
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

// POST: create a new recipe
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secretKey = process.env.JWT_SECRET || "fallback-secret-key";
    const decoded = jwt.verify(token, secretKey) as { userId: string };

    const body = await request.json();
    const { title, description, cookingTime, difficulty } = body;

    if (!title || !description || !cookingTime || !difficulty) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newRecipe = await prisma.recipe.create({
      data: {
        title,
        description,
        cookingTime: Number(cookingTime), 
        difficulty,
        authorId: decoded.userId, // Associate recipe with the authenticated user
      },
    });

    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json({ error: "Failed to create recipe" }, { status: 500 });
  }
}