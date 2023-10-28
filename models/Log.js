import mongoose, { model, Schema, models } from "mongoose";

const recipeLogSchema = new Schema({
  action: { type: String, required: true },
  recipeId: { type: String, required: true },
  userEmail: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const RecipeLog = models.RecipeLog || model('RecipeLog', recipeLogSchema);