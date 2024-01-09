import { Comment } from "@/models/Comment";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
  await mongooseConnect();

  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      // Delete the comment
      await Comment.findByIdAndDelete(id);

      res.status(200).json({ success: true });
    } catch (error) {
      console.error(`Error deleting comment with ID ${id}:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
