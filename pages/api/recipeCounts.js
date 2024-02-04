// Import necessary modules...
import { Recipe } from "@/models/Recipe";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === 'GET') {
    try {
      // Count recipes by category
      const recipesCountByCategory = await Recipe.aggregate([
        {
          $unwind: '$category',
        },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
      ]);

      const countMapByCategory = {};
      recipesCountByCategory.forEach((item) => {
        countMapByCategory[item._id] = item.count;
      });

      // Count recipes by locality
      const recipeCounts = await Recipe.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        {
          $unwind: "$categoryDetails",
        },
        {
          $group: {
            _id: "$categoryDetails.name",
            count: { $sum: 1 },
          },
        },
      ]);

      const countsObject = {
        Luzon: 0,
        Visayas: 0,
        Mindanao: 0,
      };

      // Update countsObject with counts from each category
      recipeCounts.forEach((count) => {
        const category = count._id;
        if (category.includes("Luzon")) {
          countsObject.Luzon += count.count;
        } else if (category.includes("Visayas")) {
          countsObject.Visayas += count.count;
        } else if (category.includes("Mindanao")) {
          countsObject.Mindanao += count.count;
        }
      });

      // Combine counts by category with counts by locality
      const combinedCounts = {
        ...countsObject,
        ...countMapByCategory,
      };

      res.json(combinedCounts);
    } catch (error) {
      console.error("Error fetching recipe counts:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}