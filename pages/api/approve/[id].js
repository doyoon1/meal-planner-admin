import { Comment } from "@/models/Comment";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
  await mongooseConnect();

  if (req.method === "PUT") {
    const { id } = req.query;

    try {
      const comment = await Comment.findById(id);

      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { approved: !comment.approved },
        { new: true }
      );

      res.json(updatedComment);
    } catch (error) {
      console.error(`Error toggling approval for comment with ID ${id}:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}