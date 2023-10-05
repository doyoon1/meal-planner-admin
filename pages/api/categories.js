import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === 'GET') {
    res.json(await Category.find());
  }

  if (method === 'POST') {
    const { name } = req.body;
    const categoryDoc = await Category.create({
      name,
    });
    res.json(categoryDoc);
  }

  if (method === 'PUT') {
    const { name, _id } = req.body;
    const categoryData = { name };

    const categoryDoc = await Category.updateOne({ _id }, categoryData);
    res.json(categoryDoc);
  }

  if (method === 'DELETE') {
    const { _id } = req.query;
    await Category.deleteOne({ _id });
    res.json('ok');
  }
}
