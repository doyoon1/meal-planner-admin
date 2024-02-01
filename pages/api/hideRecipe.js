import { Recipe } from "@/models/Recipe";
import { RecipeLog } from "@/models/Log";
import { mongooseConnect } from "@/lib/mongoose";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const { method } = req;
  const { recipeId, action } = req.query;
  const { userName } = req.body;

  await mongooseConnect();

  if (method === "PUT") {
    try {
      let updatedRecipe;

      if (action === "hide") {
        updatedRecipe = await Recipe.findByIdAndUpdate(
          recipeId,
          { hidden: true },
          { new: true }
        );
      } else if (action === "unhide") {
        updatedRecipe = await Recipe.findByIdAndUpdate(
          recipeId,
          { hidden: false },
          { new: true }
        );
      } else {
        return res.status(400).json({ error: "Invalid action" });
      }

      if (!updatedRecipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      const logEntry = new RecipeLog({
        action,
        recipe: updatedRecipe._id,
        userName: userName || "Unknown User",
      });

      await logEntry.save();

      const successMessage = action === "hide" ? "Recipe hidden successfully" : "Recipe unhidden successfully";

      res.status(200).json({ success: true, recipe: updatedRecipe, message: successMessage });
    } catch (error) {
      console.error("Error updating hidden field:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
