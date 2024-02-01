import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination"
import Select from 'react-select';
import { useSession } from "next-auth/react";
import Swal from 'sweetalert2';

export default function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const recipesPerPage = 10;
    const [message, setMessage] = useState("");
    const [selectedRecipes, setSelectedRecipes] = useState([]);
    const [totalRecipes, setTotalRecipes] = useState(0);
    const { data:session } = useSession();
    const [showHidden, setShowHidden] = useState(false);

    const handleHideRecipe = async (recipeId) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to hide this recipe?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, hide it!',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d33',
      });
    
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/hideRecipe?recipeId=${recipeId}&action=hide`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName: session?.user?.name }),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            setRecipes((prevRecipes) =>
              prevRecipes.map((recipe) =>
                recipe._id === recipeId ? { ...recipe, hidden: true } : recipe
              )
            );
            Swal.fire({
              icon: 'success',
              title: 'Recipe hidden successfully',
            });
          } else {
            console.error('Error hiding recipe:', data.error);
            Swal.fire({
              icon: 'error',
              title: 'Error hiding recipe',
              text: data.error || 'An error occurred while hiding the recipe.',
            });
          }
        } catch (error) {
          console.error('Error hiding recipe:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error hiding recipe',
            text: 'An unexpected error occurred while hiding the recipe.',
          });
        }
      }
    };    

    const handleUnhideRecipe = async (recipeId) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to unhide this recipe?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, unhide it!',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#3085d6',
      });
    
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/hideRecipe?recipeId=${recipeId}&action=unhide`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName: session?.user?.name }),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            setRecipes((prevRecipes) =>
              prevRecipes.map((recipe) =>
                recipe._id === recipeId ? { ...recipe, hidden: false } : recipe
              )
            );
            Swal.fire({
              icon: 'success',
              title: 'Recipe unhidden successfully',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error unhiding recipe',
              text: data.error || 'An error occurred while unhiding the recipe.',
            });
          }
        } catch (error) {
          console.error('Error unhiding recipe:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error unhiding recipe',
            text: 'An unexpected error occurred while unhiding the recipe.',
          });
        }
      }
    };    

    const renderHideButton = (recipe) => {
      if (recipe.hidden) {
        return (
          <button
            className="bg-gray-800 text-white text-sm px-4 py-1 rounded-sm"
            onClick={() => handleUnhideRecipe(recipe._id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
            </svg>
            Show
          </button>
        );
      } else {
        return (
          <button
            className="bg-gray-800 text-white text-sm px-4 py-1 rounded-sm"
            onClick={() => handleHideRecipe(recipe._id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
              <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
              <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
            </svg>
            Hide
          </button>
        );
      }
    };
  
    useEffect(() => {
      axios.get(`/api/recipes?showHidden=${showHidden}`)
          .then((response) => response.data)
          .then((data) => {
              setTotalRecipes(data.length);  
              setRecipes(data);
  
              const featuredRecipes = data.filter((recipe) => recipe.featured === true);
              if (featuredRecipes.length > 0) {
                  setSelectedRecipes(featuredRecipes.map((recipe) => ({ value: recipe._id, label: recipe.title })));
              }
          });
  
      axios.get('/api/categories')
          .then((response) => response.data)
          .then((data) => setCategories(data));
    }, [showHidden]);
  
      
      useEffect(() => {
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
          const isHidden = showHidden ? recipe.hidden : false;
  
          return (
              (!showHidden || isHidden) &&
              title.includes(searchQuery.toLowerCase())
          );
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
      
          console.log('Response Data:', data);
      
          if (response.ok) {
            if (data.recipes && Array.isArray(data.recipes)) {
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
        if (selectedOptions.length > 3) {

          selectedOptions.pop();
          setSelectedRecipes(selectedOptions);
    

        } else {
          setSelectedRecipes(selectedOptions);
        }
        localStorage.setItem('selectedRecipes', JSON.stringify(selectedOptions));
      };

    return (
        <Layout>
            <div className="flex flex-col justify-center space-x-4 mb-4">
                <div className="bg-gray-200 p-4 text-center">
                <h3 className="text-xl">Select Featured Recipe</h3>
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
                <div className="message-box">
                <p className={`message ${message.startsWith("Error") ? "error" : "success"}`}>
                    {message}
                </p>
                </div>
                </div>
            </div>
              <Link className="bg-icons text-white py-1 px-2 rounded-sm" href={'/recipes/new'}>Add new recipe</Link>
            <input
                type="text"
                className="mb-0 mt-2"
                placeholder="Search recipes"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            <div className="flex justify-between">
              <p className="mt-4">Total no. of Recipes: <span className="text-red-400">{totalRecipes}</span></p>
            <select
                className="h-8 w-32 m-0 p-0 mt-2"
                onChange={(e) => setShowHidden(e.target.value === "archived")}
            >
                <option value="all">All</option>
                <option value="archived">Archived</option>
            </select>
            </div>
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
                                {/* <Link className="bg-red-200 text-red-600 shadow-md" href={'recipes/delete/'+recipe._id}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                    Delete
                                </Link> */}
                                {renderHideButton(recipe)}
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