import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import RecipeForm from "@/components/RecipeForm";
import { useSession } from "next-auth/react";


export default function editRecipePage() {
    const { data: session } = useSession();

    const [recipeInfo, setRecipeInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/recipes?id='+id).then(response => {
            setRecipeInfo(response.data);
        })
    }, [id]);
    return (
        <Layout>
            <h1>Edit recipe</h1>
            {recipeInfo && (
                <RecipeForm {...recipeInfo} session={session} />
            )}
        </Layout>
    );
}