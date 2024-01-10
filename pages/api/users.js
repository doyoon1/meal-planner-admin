import { UserAccounts } from "@/models/User";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();

    if (method === "GET") {
        // Retrieve users
        res.json(await UserAccounts.find());
    }

    // Handle other methods or additional functionalities as needed
    
    // Example: Handle DELETE method for deleting a user
    if (method === "DELETE") {
        const { id } = req.query;

        // Validate if the user ID is provided
        if (!id) {
            return res.status(400).json({ error: 'User ID is required for deletion.' });
        }

        // Delete the user
        await UserAccounts.deleteOne({ _id: id });

        res.json({ success: true });
    }
}
