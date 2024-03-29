import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import Pagination from "@/components/Pagination"

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [recipesCount, setRecipesCount] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const categoryPerPage = 8;

  useEffect(() => {
    fetchCategories();
    fetchRecipesCount();
  }, []);

  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }

  function fetchRecipesCount() {
    axios.get('/api/recipeCounts').then(result => {
      setRecipesCount(result.data);
    });
  }

  function selectParentCategory(category) {
    setParentCategory(category);
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = { name, parent: parentCategory ? parentCategory._id : null };
  
    if (editedCategory) {
      if (editedCategory.name !== name) {
        const isDuplicateCategory = categories.some(category => category.name.toLowerCase() === name.toLowerCase());
  
        if (isDuplicateCategory) {
          swal.fire({
            icon: 'error',
            title: 'Duplicate Category',
            text: 'This category already exists in the table.',
          });
          return;
        }
      }
  
      data._id = editedCategory._id;
  
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      const isDuplicateCategory = categories.some(category => category.name.toLowerCase() === name.toLowerCase());
  
      if (isDuplicateCategory) {
        swal.fire({
          icon: 'error',
          title: 'Duplicate Category',
          text: 'This category already exists in the table.',
        });
        return;
      }
  
      await axios.post('/api/categories', data);
    }
  
    setParentCategory(null);
    setName('');
    fetchCategories();
  }
  

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
  
    if (category.parent) {
      setParentCategory(categories.find(cat => cat._id === category.parent));
    } else {
      setParentCategory(null);
    }
  }
  

  function deleteCategory(category) {
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#d55',
    }).then(async result => {
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete('/api/categories?_id=' + _id, { _id });
        fetchCategories();
      }
    });
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const getFilteredCategories = () => {
    const sortedCategories = categories.sort((a, b) => a.name.localeCompare(b.name));

    return sortedCategories.filter((category) => {
        const categoryName = category.name.toLowerCase();
        return categoryName.includes(searchQuery.toLowerCase());
    });
  };

  const filteredCategories = getFilteredCategories();

  const indexOfLastCategory = currentPage * categoryPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoryPerPage;
  const currentCategory = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Layout>
      <h1><b>Categories</b></h1>
            <label>
              {editedCategory
                ? `Edit ${editedCategory.name}`
                : 'Create new category'}
            </label>
            <form onSubmit={saveCategory} className="flex gap-1 mb-8">
              <input
                className="mb-0"
                type="text"
                placeholder={'Category name'}
                onChange={ev => setName(ev.target.value)}
                value={name} />
              <select
                className="mb-0"
                onChange={(ev) => selectParentCategory(categories.find(cat => cat._id === ev.target.value))}
              >
                <option value="">no parent category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
              <button type="submit" className="btn-primary text-sm">Save</button>
            </form>
            <input
              type="text"
              className="mb-0"
              placeholder="Search categories"
              value={searchQuery}
              onChange={handleSearchChange}
            />
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent Category</td>
            <td>No. of Recipes</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {currentCategory.map(category => (
            <tr key={category._id}>
            <td>{category.name}</td>
            <td>
              {category.parent && categories.find(cat => cat._id === category.parent)?.name || ''}
            </td>
            <td>{recipesCount[category._id] || 0}</td>
              <td className="text-center">
                <button
                  className="bg-white text-gray-600 border border-gray-200 shadow-md"
                  onClick={() => editCategory(category)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Edit
                </button>
                <button
                  className="bg-red-200 text-red-600 shadow-md"
                  onClick={() => deleteCategory(category)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-container">
          <Pagination
              recipesPerPage={categoryPerPage}
              totalRecipes={filteredCategories.length}
              currentPage={currentPage}
              paginate={paginate}
          />
      </div>
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => (
  <Categories swal={swal} />
));
