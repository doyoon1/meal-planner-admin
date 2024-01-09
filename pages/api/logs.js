import { RecipeLog } from "@/models/Log";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();

    if (method === "GET") {
        // Retrieve logs
        res.json(await RecipeLog.find());
    }
    
    // Handle DELETE method for deleting a log entry
    if (method === "DELETE") {
        const { id } = req.query;

        // Validate if the log entry ID is provided
        if (!id) {
            return res.status(400).json({ error: 'Log ID is required for deletion.' });
        }

        // Delete the log entry
        await RecipeLog.deleteOne({ _id: id });

        res.json({ success: true });
    }
}
