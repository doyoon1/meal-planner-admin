import { UserAccounts } from "@/models/User";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    try {
      const users = await UserAccounts.find();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required for deletion.' });
    }

    await UserAccounts.deleteOne({ _id: id });

    res.json({ success: true });
  }
}