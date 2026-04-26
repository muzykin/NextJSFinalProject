"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeleteRecipeButton({ recipeId }: { recipeId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Ask for confirmation before deleting
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Go back to home page and refresh data
        router.push("/");
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete recipe");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred");
      setIsDeleting(false);
    }
  };

  return (
    <Button 
      variant="destructive" 
      onClick={handleDelete} 
      disabled={isDeleting}
    >
      {isDeleting ? "Deleting..." : "Delete Recipe"}
    </Button>
  );
}