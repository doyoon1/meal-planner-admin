import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalAdminEmails, setTotalAdminEmails] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const [message, setMessage] = useState("");

  const [featuredRecipeId, setFeaturedRecipeId] = useState("");
  const router = useRouter();
  const handleFeatureRecipe = async () => {
    try {
      const response = await fetch("/api/featured", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId: featuredRecipeId }),
      });
  
      // Log the response status and data
      console.log('Response Status:', response.status);
      const data = await response.json();
      console.log('Response Data:', data);
  
      if (response.ok) {
        if (data.recipe) {
          const updatedRecipe = data.recipe;
          // Set the featured recipe in your client-side state
          setFeaturedRecipeId(updatedRecipe._id);
          console.log('Featured Field:', updatedRecipe.featured); // Log the "featured" field
          setMessage("Recipe featured successfully");
        } else {
          // Handle the case where the response doesn't include a recipe (already featured case)
          setMessage(data.message);
        }
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error("Error featuring recipe:", error);
      setMessage("Error featuring recipe.");
    }
  };
  
  useEffect(() => {
    // Fetch and set the total number of recipes
    fetch("/api/recipes")
      .then((response) => response.json())
      .then((data) => {
        setTotalRecipes(data.length);
        // Set the list of available recipes
        setRecipes(data);

        // Find the recipe with "featured" set to true and set it as the initial value
        const featuredRecipe = data.find((recipe) => recipe.featured === true);
        if (featuredRecipe) {
          setFeaturedRecipeId(featuredRecipe._id);
        }
      });

    // Fetch and set the total number of categories
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => setTotalCategories(data.length));

    // Fetch and set the total number of admin emails
    fetch("/api/admins")
      .then((response) => response.json())
      .then((data) => setTotalAdminEmails(data.length));
  }, []);

  return (
    <Layout>
      <div className="text-gray-900 flex justify-between text-lg">
        <h2>
          <b>Dashboard</b>
        </h2>
      </div>
      <div className="flex flex-col justify-center mt-16 space-x-4">
        <div className="bg-gray-200 rounded-lg p-4 text-center">
          <h3 className="text-xl font-semibold">Select Featured Recipe</h3>
          <select
            className="w-full border p-2 rounded-md"
            value={featuredRecipeId}
            onChange={(e) => setFeaturedRecipeId(e.target.value)}
          >
            <option value="">Select a recipe</option>
            {recipes.map((recipe) => (
              <option key={recipe._id} value={recipe._id}>
                {recipe.title}
              </option>
            ))}
          </select>
          <button
            className="mt-2 bg-blue-500 text-white p-2 rounded-md"
            onClick={handleFeatureRecipe}
          >
            Feature Recipe
          </button>
        </div>
        <div className="message-box">
          <p className={`message ${message.startsWith("Error") ? "error" : "success"}`}>
            {message}
          </p>
        </div>
        <div className="flex flex-row justify-center mt-16 space-x-4">
          <div className="bg-blue-200 rounded-lg p-4 text-center">
            <h3 className="text-xl font-semibold">Total Number of Recipes</h3>
            <p className="text-3xl font-extrabold text-blue-700">{totalRecipes}</p>
          </div>
          <div className="bg-green-200 rounded-lg p-4 text-center">
            <h3 className="text-xl font-semibold">Total Number of Categories</h3>
            <p className="text-3xl font-extrabold text-green-700">{totalCategories}</p>
          </div>
          <div className="bg-yellow-200 rounded-lg p-4 text-center">
            <h3 className="text-xl font-semibold">Total Number of Admins</h3>
            <p className="text-3xl font-extrabold text-yellow-700">{totalAdminEmails}</p>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .message-box {
            text-align: center;
            margin-top: 16px;
          }

          .message {
            padding: 8px;
          }

          .success {
            color: green;
          }

          .error {
            color: red;
          }
        `}
      </style>
    </Layout>
  );
}
