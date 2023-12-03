import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { recipeIds } = req.body;

  if (!recipeIds || !Array.isArray(recipeIds)) {
    return res.status(400).json({ error: "Recipe IDs must be provided as an array" });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const recipesCollection = db.collection("recipes");

    // Update the featured field of the new recipes to true
    const updatedRecipes = await recipesCollection.updateMany(
      { _id: { $in: recipeIds.map((id) => new ObjectId(id)) } },
      { $set: { featured: true } }
    );

    // Set the featured field of the existing featured recipes (if any) to false
    await recipesCollection.updateMany(
      { _id: { $nin: recipeIds.map((id) => new ObjectId(id)) }, featured: true },
      { $set: { featured: false } }
    );

    return res.status(200).json({
      message: "Recipes featured successfully",
      recipes: updatedRecipes,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};