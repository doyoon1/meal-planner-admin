import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Select from 'react-select';

export default function Dashboard() {
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalAdminEmails, setTotalAdminEmails] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  
  const router = useRouter();

  useEffect(() => {
    // Fetch and set the total number of recipes
    fetch("/api/recipes")
      .then((response) => response.json())
      .then((data) => {
        setTotalRecipes(data.length);
        // Set the list of available recipes
        setRecipes(data);

        // Find the recipes with "featured" set to true and set them as the initial values
        const featuredRecipes = data.filter((recipe) => recipe.featured === true);
        if (featuredRecipes.length > 0) {
          setSelectedRecipes(featuredRecipes.map((recipe) => ({ value: recipe._id, label: recipe.title })));
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

  useEffect(() => {
    // Retrieve selected recipes from localStorage on component mount
    const storedSelectedRecipes = localStorage.getItem('selectedRecipes');
    if (storedSelectedRecipes) {
      setSelectedRecipes(JSON.parse(storedSelectedRecipes));
    }
  }, []);

  return (
    <Layout>
      <div className="text-gray-900 flex justify-between text-lg">
        <h2>
          <b>Dashboard</b>
        </h2>
      </div>
      <div className="flex flex-col justify-center mt-16 space-x-4">
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