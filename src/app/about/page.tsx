import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-8">
      {/* Header Section */}
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
          About RecipeApp 🍳
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          We believe that cooking should be fun, accessible, and shared with the world. 
          Our platform is designed for home cooks, food enthusiasts, and professional chefs alike.
        </p>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center space-y-3">
          <div className="text-4xl">🌍</div>
          <h3 className="text-lg font-bold text-slate-900">Global Community</h3>
          <p className="text-slate-600 text-sm">
            Discover recipes from all over the world, shared by people just like you.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center space-y-3">
          <div className="text-4xl">✍️</div>
          <h3 className="text-lg font-bold text-slate-900">Share Your Magic</h3>
          <p className="text-slate-600 text-sm">
            Easily create, format, and publish your own culinary masterpieces.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center space-y-3">
          <div className="text-4xl">🔒</div>
          <h3 className="text-lg font-bold text-slate-900">Secure & Private</h3>
          <p className="text-slate-600 text-sm">
            Your data is safely stored, and you have full control over your recipes.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Story</h2>
        <div className="space-y-4 text-slate-700 leading-relaxed">
          <p>
            RecipeApp was born out of a simple idea: everyone deserves access to great home-cooked meals. What started as a small personal collection of family recipes has quickly grown into a community-driven platform for food lovers.
          </p>
          <p>
            Our mission is to make cooking accessible, enjoyable, and shareable. Whether you are a beginner trying to fry your first egg or a seasoned chef sharing your secret techniques, you belong here. Join us in making the world a tastier place, one recipe at a time.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Ready to start cooking?</h2>
        <Link href="/recipes/create">
          <Button size="lg" className="font-semibold px-8">
            Share Your First Recipe
          </Button>
        </Link>
      </section>
    </div>
  );
}