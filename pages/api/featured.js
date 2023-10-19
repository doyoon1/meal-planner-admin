import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb"

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { recipeId } = req.body;

  if (!recipeId) {
    return res.status(400).json({ error: "Recipe ID is required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const recipesCollection = db.collection("recipes");

    // Find the currently featured recipe (if any)
    const currentFeaturedRecipe = await recipesCollection.findOne({ featured: true });

    // Find the recipe by ID
    const recipeToUpdate = await recipesCollection.findOne({ _id: new ObjectId(recipeId) });

    if (!recipeToUpdate) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // If the recipe to be featured is already featured, return a message
    if (recipeToUpdate.featured) {
      return res.status(200).json({ message: "Recipe is already featured", recipe: recipeToUpdate });
    }

    // Set the "featured" field of the new recipe to true
    const updatedRecipe = await recipesCollection.findOneAndUpdate(
      { _id: new ObjectId(recipeId) },
      { $set: { featured: true } },
      { returnOriginal: false }
    );

    // Set the "featured" field of the existing featured recipe (if any) to false
    if (currentFeaturedRecipe) {
      await recipesCollection.updateOne(
        { _id: currentFeaturedRecipe._id },
        { $set: { featured: false } }
      );
    }

    return res.status(200).json({
      message: "Recipe featured successfully",
      recipe: updatedRecipe.value,
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
