import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination"
import Select from 'react-select';

export default function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const recipesPerPage = 10;
    const [message, setMessage] = useState("");
    const [selectedRecipes, setSelectedRecipes] = useState([]);
    const [totalRecipes, setTotalRecipes] = useState(0);


    useEffect(() => {
        // Fetch and set the total number of recipes
        axios.get('/api/recipes')
          .then((response) => response.data)
          .then((data) => {
            setTotalRecipes(data.length);  // <-- This line should be removed
            // Set the list of available recipes
            setRecipes(data);
      
            // Find the recipes with "featured" set to true and set them as the initial values
            const featuredRecipes = data.filter((recipe) => recipe.featured === true);
            if (featuredRecipes.length > 0) {
              setSelectedRecipes(featuredRecipes.map((recipe) => ({ value: recipe._id, label: recipe.title })));
            }
          });
      
        // Fetch and set the total number of categories
        axios.get('/api/categories')
          .then((response) => response.data)
          .then((data) => setCategories(data));
      }, []);
      
      useEffect(() => {
        // Retrieve selected recipes from localStorage on component mount
        const storedSelectedRecipes = localStorage.getItem('selectedRecipes');
        if (storedSelectedRecipes) {
          setSelectedRecipes(JSON.parse(storedSelectedRecipes));
        }
      }, []);    

    const renderCategoryNames = (categoryIds, categories) => {
        if (!categoryIds || !categories) {
            return '';
        }

        const categoryNames = categoryIds.map(categoryId => {
            const category = categories.find(cat => cat._id === categoryId);
            return category ? category.name : '';
    });

        return categoryNames.join(', ');
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const getFilteredRecipes = () => {
        const sortedRecipes = recipes.sort((a, b) => a.title.localeCompare(b.title));
    
        return sortedRecipes.filter((recipe) => {
            const title = recipe.title.toLowerCase();
            return title.includes(searchQuery.toLowerCase());
        });
    };
    
    const filteredRecipes = getFilteredRecipes();

    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleFeatureRecipe = async () => {
        try {
          if (selectedRecipes.length < 3) {
            setMessage("Select at least 3 recipes to feature.");
            return;
          }
      
          const recipeIds = selectedRecipes.map((recipe) => recipe.value);
      
          const response = await fetch("/api/featured", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ recipeIds }),
          });
      
          const data = await response.json();
      
          console.log('Response Data:', data); // Log the data received from the API
      
          if (response.ok) {
            if (data.recipes && Array.isArray(data.recipes)) {
              // Update the state with the new list of featured recipes
              setSelectedRecipes(data.recipes.map((recipe) => ({ value: recipe._id, label: recipe.title })));
              setMessage("Recipes featured successfully");
            } else {
              setMessage(data.message);
            }
          } else {
            setMessage(data.error);
          }
        } catch (error) {
          console.error("Error featuring recipes:", error);
          setMessage("Error featuring recipes.");
        }
      };  
    
      const handleSelectChange = (selectedOptions) => {
        // Check if the length exceeds 3
        if (selectedOptions.length > 3) {
          // You can either remove the last selected item or prevent further selections
          // Uncomment one of the following lines based on your preference
    
          // Remove the last selected item
          selectedOptions.pop();
          setSelectedRecipes(selectedOptions);
    
          // Or prevent further selections
          // setMessage("You can select up to 3 recipes.");
          // setSelectedRecipes([]);
        } else {
          setSelectedRecipes(selectedOptions);
        }
        localStorage.setItem('selectedRecipes', JSON.stringify(selectedOptions));
      };

    return (
        <Layout>
            <div className="flex flex-col justify-center space-x-4">
                <div className="bg-gray-200 rounded-lg p-4 text-center">
                <h3 className="text-xl font-semibold">Select Featured Recipe</h3>
                <Select
                    closeMenuOnSelect={false}
                    isMulti
                    className="w-full"
                    options={recipes.map((recipe) => ({ value: recipe._id, label: recipe.title }))}
                    value={selectedRecipes}
                    onChange={handleSelectChange}
                />
                <button
                    className="mt-2 bg-blue-500 text-white p-2 rounded-md"
                    onClick={handleFeatureRecipe}
                >
                    Feature Recipes
                </button>
                </div>
            </div>
            <div className="message-box">
            <p className={`message ${message.startsWith("Error") ? "error" : "success"}`}>
                {message}
            </p>
            </div>
            <Link className="bg-icons text-white py-1 px-2 rounded-sm" href={'/recipes/new'}>Add new recipe</Link>
            <input
                type="text"
                className="mb-0 mt-2"
                placeholder="Search recipes"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            <table className="basic">
                <thead>
                    <tr>
                        <td>Recipe name</td>
                        <td>Category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {currentRecipes.map((recipe) => (
                        <tr key={recipe._id}>
                            <td>{recipe.title}</td>
                            <td>{renderCategoryNames(recipe.category, categories)}</td>
                            <td className="text-center">
                                <Link className="bg-white text-gray-600 border border-gray-200 shadow-md" href={'/recipes/edit/'+recipe._id}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                                    Edit
                                </Link>
                                <Link className="bg-red-200 text-red-600 shadow-md" href={'recipes/delete/'+recipe._id}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                    Delete
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination-container">
                <Pagination
                    recipesPerPage={recipesPerPage}
                    totalRecipes={filteredRecipes.length}
                    currentPage={currentPage}
                    paginate={paginate}
                />
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