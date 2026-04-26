import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

export async function GET() {
  try {
    // Check if we already have recipes to avoid duplicates
    const count = await prisma.recipe.count();
    if (count > 0) {
      return NextResponse.json({ message: "Database already has recipes. Clear it first if you want to re-seed." });
    }

    const passwordHash = await bcrypt.hash("password123", 10);

    const chefGordon = await prisma.user.upsert({
      where: { email: "gordon@example.com" },
      update: {},
      create: { email: "gordon@example.com", name: "Gordon Ramsay", password: passwordHash },
    });

    const homeCook = await prisma.user.upsert({
      where: { email: "cook@example.com" },
      update: {},
      create: { email: "cook@example.com", name: "Happy Home Cook", password: passwordHash },
    });

    const recipes = [
      { title: "Classic Spaghetti Carbonara 🍝", description: "A traditional Italian pasta dish.\n\n1. Boil pasta until al dente.\n2. Fry guanciale until crispy.\n3. Whisk eggs and pecorino cheese.\n4. Mix everything off the heat to create a creamy sauce.\n5. Serve immediately with extra black pepper.", cookingTime: 25, difficulty: "Medium", authorId: chefGordon.id },
      { title: "Quick & Easy Pancakes 🥞", description: "Perfect for a lazy Sunday morning.\n\n1. Mix flour, milk, and an egg in a bowl.\n2. Heat a pan with some butter.\n3. Pour a ladle of batter.\n4. Flip when bubbles appear on the surface.\n5. Serve with maple syrup and fresh berries.", cookingTime: 15, difficulty: "Easy", authorId: homeCook.id },
      { title: "Beef Wellington 🥩", description: "A masterpiece of British cuisine.\n\n1. Sear the beef tenderloin quickly on all sides.\n2. Cover with mushroom duxelles and prosciutto.\n3. Wrap tightly in puff pastry.\n4. Bake at 200°C for 35 minutes until golden brown.\n5. Let it rest before slicing.", cookingTime: 120, difficulty: "Hard", authorId: chefGordon.id },
      { title: "Fresh Summer Salad 🥗", description: "Light, healthy, and ready in minutes.\n\n1. Chop cherry tomatoes, cucumbers, and red onions.\n2. Toss with olive oil, lemon juice, salt, and oregano.\n3. Top with feta cheese and Kalamata olives.\n4. Enjoy immediately!", cookingTime: 10, difficulty: "Easy", authorId: homeCook.id }
    ];

    for (const recipe of recipes) {
      await prisma.recipe.create({ data: recipe });
    }

    return NextResponse.json({ message: "✅ Database seeded successfully with users and recipes!" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}

// Prisma cascading delete: if we delete the user, all their recipes are deleted automatically

export async function DELETE() {
  try {
    // Find the seed users by their specific emails
    await prisma.recipe.deleteMany({
      where: {
        author: {
          email: { in: ["gordon@example.com", "cook@example.com"] }
        }
      }
    });
    const result = await prisma.user.deleteMany({
      where: {
        email: { in: ["gordon@example.com", "cook@example.com"] }
      }
    });

    return NextResponse.json({ message: `✅ Cleanup successful! Deleted ${result.count} seed users and their recipes.` });
  } catch (error) {
    return NextResponse.json({ error: "Failed to clean up seed data" }, { status: 500 });
  }
}