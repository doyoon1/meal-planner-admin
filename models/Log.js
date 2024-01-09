import mongoose, { model, Schema, models } from "mongoose";

const recipeLogSchema = new Schema({
  action: { type: String, required: true },
  recipe: { type: mongoose.Types.ObjectId, ref: 'Recipe', required: true },
  userName: { type: String, required: true },
}, {
  timestamps: true,
});

export const RecipeLog = models.RecipeLog || model('RecipeLog', recipeLogSchema);