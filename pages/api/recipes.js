import { Recipe } from "@/models/Recipe"
import { RecipeLog } from "@/models/Log";
import { mongooseConnect } from "@/lib/mongoose";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();
    const session = await getSession({ req });

    if (method === 'GET') {
        if (req.query.id) {
            res.json(await Recipe.findOne({_id:req.query.id}))
        } else {
            res.json(await Recipe.find());
        }
    } 

    if (method === 'POST') {
        const {title, description, images, category, servings, ingredients, procedure, videoLink, nutriValue, citation} = req.body;
        const productDoc  = await Recipe.create({
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
        });

        // Create a log entry for the 'add' action
        // await RecipeLog.create({
        //     action: 'add',
        //     recipeId: req.query.id,
        //     userEmail: session?.user?.email, // Ensure userEmail is set from the session
        // });

        res.json(productDoc);
    }

    if (method === 'PUT') {
        const {title, description, images, category, servings, ingredients, procedure, videoLink, nutriValue, citation,  _id} = req.body;
        await Recipe.updateOne({_id}, {
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
        });

        // Create a log entry for the 'edit' action
        // await RecipeLog.create({
        //     action: 'edit',
        //     recipeId: _id,
        //     userEmail: session?.user?.email, // Ensure userEmail is set from the session
        // });

        res.json(true);
    }

    if (method === 'DELETE') {
        if (req.query.id) {
            await Recipe.deleteOne({_id:req.query?.id});

            // Create a log entry for the 'delete' action
            await RecipeLog.create({
                action: 'delete',
                recipeId: req.query.id,
                userEmail: session?.user?.email,
            });
            
            res.json(true);
        }
    }
}