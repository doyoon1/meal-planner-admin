import { Comment } from "@/models/Comment";
import { mongooseConnect } from "@/lib/mongoose";
import { UserAccounts } from "@/models/User";

export default async function handle(req, res) {
  await mongooseConnect();

  if (req.method === "GET") {
    try {
      const comments = await Comment.find().populate('user recipe');
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } 
}
