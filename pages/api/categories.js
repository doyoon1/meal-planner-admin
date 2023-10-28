import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === 'GET') {
    res.json(await Category.find());
  }

  if (method === 'POST') {
    const { name, parent } = req.body; 
    const categoryDoc = await Category.create({
      name,
      parent, 
    });
    res.json(categoryDoc);
  }

  if (method === 'PUT') {
    const { name, _id, parent } = req.body; 
    const categoryData = { name, parent }; 

    const categoryDoc = await Category.updateOne({ _id }, categoryData);
    res.json(categoryDoc);
  }

  if (method === 'DELETE') {
    const { _id } = req.query;
    await Category.deleteOne({ _id });
    res.json('ok');
  }
}
