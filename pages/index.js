import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalAdminEmails, setTotalAdminEmails] = useState(0);

  useEffect(() => {
    // Fetch and set the total number of recipes
    fetch("/api/recipes")
      .then((response) => response.json())
      .then((data) => {
        setTotalRecipes(data.length);
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
    </Layout>
  );
}