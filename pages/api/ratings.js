import { Rating } from "@/models/Rating";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
  await mongooseConnect();

  if (req.method === "GET") {
    try {
      const ratingStats = await Rating.aggregate([
        {
          $group: {
            _id: "$value",
            count: { $sum: 1 },
          },
        },
      ]);

      const statsObject = {};
      ratingStats.forEach((stat) => {
        statsObject[stat._id] = stat.count;
      });

      res.json(statsObject);
    } catch (error) {
      console.error("Error fetching rating statistics:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
