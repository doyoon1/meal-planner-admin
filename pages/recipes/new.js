import Layout from "@/components/Layout";
import RecipeForm from "@/components/RecipeForm";


export default function NewRecipe() {
    return (
        <Layout>
            <h1>New Recipe</h1>
            <RecipeForm />
        </Layout>
    );
}