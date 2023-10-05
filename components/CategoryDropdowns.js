// CategoryDropdowns.js
import React from "react";

function CategoryDropdowns({
  categories,
  categoryDropdowns,
  handleCategoryChange,
  addCategoryDropdown,
  removeCategoryDropdown,
}) {
  return (
    <>
      <label className="block">Category</label>
      <button
        type="button"
        onClick={addCategoryDropdown}
        className="btn-default block text-sm mb-2"
      >
        Add Category
      </button>
      {categoryDropdowns.map((dropdown) => (
        <div key={dropdown.id} className="flex gap-1 mb-2">
          <select
            value={dropdown.selectedCategory}
            onChange={(ev) => handleCategoryChange(ev, dropdown.id)}
            className="mb-0"
          >
            {categories.length > 0 &&
              categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>
          <button
            type="button"
            onClick={() => removeCategoryDropdown(dropdown.id)}
            className="bg-red-200 text-red-600 text-sm px-4 py-1 rounded-sm"
          >
            Remove
          </button>
        </div>
      ))}
    </>
  );
}

export default CategoryDropdowns;