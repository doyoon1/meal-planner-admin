import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req,res);

    if (method === 'GET') {
        res.json(await Category.find().populate('parent'));
    }

    if (method === 'POST') {
        const {name, parentCategory} = req.body;
        const categoryDoc = await Category.create({
            name,
            parent: parentCategory !== null ? parentCategory : undefined,
        });
        res.json(categoryDoc);
    }

    if (method === 'PUT') {
        const { name, parentCategory, _id } = req.body;
        const categoryData = { name };
    
        if (parentCategory !== '') {
            categoryData.parent = parentCategory;
        } else {
            categoryData.parent = null;
        }
    
        const categoryDoc = await Category.updateOne({ _id }, categoryData);
        res.json(categoryDoc);
    }

    if (method === 'DELETE') {
        const {_id} = req.query;
        await Category.deleteOne({_id});
        res.json('ok');
    }

}