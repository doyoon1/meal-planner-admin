import { VisitCount } from "@/models/Visit";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    try {
      const visitCount = await VisitCount.findOne();
      res.json({ count: visitCount ? visitCount.count : 0 });
    } catch (error) {
      console.error("Error fetching visitor count:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
