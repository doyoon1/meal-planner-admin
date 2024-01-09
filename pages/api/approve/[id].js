import { Comment } from "@/models/Comment";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
  await mongooseConnect();

  if (req.method === "PUT") {
    const { id } = req.query;

    try {
      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { approved: true },
        { new: true }
      );

      res.json(updatedComment);
    } catch (error) {
      console.error(`Error approving comment with ID ${id}:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
