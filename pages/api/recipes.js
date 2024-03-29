import { Recipe } from "@/models/Recipe";
import { RecipeLog } from "@/models/Log";
import { mongooseConnect } from "@/lib/mongoose";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
    const { method } = req;
    const { userName } = req.query;
    await mongooseConnect();

    if (method === "GET") {
        if (req.query.id) {
            res.json(await Recipe.findOne({ _id: req.query.id }));
        } else {
            const recipes = await Recipe.find().select("title averageRating").sort({ averageRating: -1 }).limit(10);
            res.json(recipes);
        }
    }

    if (method === "POST") {
        const { title, description, images, category, servings, ingredients, procedure, videoLink, nutriValue, citation, citationLink, cookingTime, userName } = req.body;
        const productDoc = await Recipe.create({
            title,
            description,
            images,
            category,
            servings,
            ingredients,
            procedure,
            videoLink,
            nutriValue,
            citation,
            citationLink,
            cookingTime,
        });

        await RecipeLog.create({
            action: 'add',
            recipe: productDoc._id,
            userName: userName || 'Unknown User',
        });

        res.json(productDoc);
    }

    if (method === "PUT") {
        const { title, description, images, category, servings, ingredients, procedure, videoLink, nutriValue, citation, citationLink, cookingTime, _id, userName } = req.body;
        await Recipe.updateOne({ _id }, {
            title,
            description,
            images,
            category,
            servings,
            ingredients,
            procedure,
            videoLink,
            nutriValue,
            citation,
            citationLink,
            cookingTime,
        });

        await RecipeLog.create({
            action: 'edit',
            recipe: _id,
            userName: userName || 'Unknown User',
        });

        res.json(true);
    }

    if (method === "DELETE") {
        if (req.query.id) {
            await Recipe.deleteOne({ _id: req.query.id });
    
            await RecipeLog.create({
                action: 'delete',
                recipe: req.query.id,
                userName: userName || 'Unknown User',
            });
    
            res.json(true);
        }
    }
}