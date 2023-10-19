import { mongooseConnect } from "@/lib/mongoose";
import { Admin } from "@/models/Admin";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    const adminEmails = await Admin.find();
    res.json(adminEmails);
  }

  if (method === "POST") {
    const { email } = req.body;
    const adminEmailDoc = await Admin.create({ email });
    res.json(adminEmailDoc);
  }

  if (method === "DELETE") {
    const { id } = req.query;
    await Admin.findByIdAndDelete(id);
    res.json("ok");
  }
}
