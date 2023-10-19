import { Recipe } from "@/models/Recipe"
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();

    if (method === 'GET') {
        if (req.query.id) {
            res.json(await Recipe.findOne({_id:req.query.id}))
        } else {
            res.json(await Recipe.find());
        }
    } 

    if (method === 'POST') {
        const {title, description, images, category, ingredients, procedure, videoLink, nutriValue} = req.body;
        const productDoc  = await Recipe.create({
            title,
            description,
            images,
            category, 
            ingredients,
            procedure,
            videoLink,
            nutriValue,
        })
        res.json(productDoc);
    }

    if (method === 'PUT') {
        const {title, description, images, category, ingredients, procedure, videoLink, nutriValue,  _id} = req.body;
        await Recipe.updateOne({_id}, {
            title, 
            description, 
            images, 
            category, 
            ingredients,
            procedure, 
            videoLink,
            nutriValue,
        });
        res.json(true);
    }

    if (method === 'DELETE') {
        if (req.query.id) {
            await Recipe.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}