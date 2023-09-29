import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function deleteRecipePage() {
    const router = useRouter();
    const [recipeInfo, setRecipeInfo] = useState();
    const {id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/recipes?id='+id).then(response => {
            setRecipeInfo(response.data);
        })

    }, [id])
    function goBack() {
        router.push('/recipes');
    }
    async function deleteRecipe() {
        await axios.delete('/api/recipes?id='+id);
        goBack();
    }
    return (
        <Layout>
            <h1 className="text-center mt-10">Do you really want to delete 
                &nbsp;"{recipeInfo?.title}"?
            </h1>
            <div className="flex gap-2 justify-center">
            <button 
                className="btn-red" 
                onClick={deleteRecipe}>
                    Yes
            </button>
            <button 
                className="btn-default text-sm" 
                onClick={goBack}>
                    No
            </button>
            </div>
        </Layout>
    );
}