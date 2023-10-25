import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function RecipeForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    ingredients: existingIngredients,
    images: existingImages,
    category: assignedCategories,
    servings: existingServings,
    procedure: existingProcedure,
    videoLink: existingVideoLink,
    nutriValue: existingNutriValue,
}) {
    const [title, setTitle] = useState(existingTitle || "");
    const [description, setDescription] = useState(existingDescription || "");
    const [categories, setCategories] = useState([]);
    const [categoryDropdowns, setCategoryDropdowns] = useState([]);
    const [ingredients, setIngredients] = useState(existingIngredients || []);
    const [images, setImages] = useState(existingImages || []);
    const [goBack, setGoBack] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [procedure, setProcedure] = useState(existingProcedure || []);
    const [videoLink, setVideoLink] = useState(existingVideoLink || "");
    const [nutriValue, setNutriValue] = useState(existingNutriValue || []);
    const [servings, setServings] = useState(existingServings || "");


    const router = useRouter();

    useEffect(() => {
        axios.get("/api/categories").then((result) => {
            const fetchedCategories = result.data;
            setCategories(fetchedCategories);

            if (assignedCategories && assignedCategories.length > 0) {
                const initialCategoryDropdowns = assignedCategories.map((category, index) => ({
                    id: index,
                    selectedCategory: category,
                }));
                setCategoryDropdowns(initialCategoryDropdowns);
            } else {
                setCategoryDropdowns([{ id: 0, selectedCategory: "" }]);
            }
        });
    }, [assignedCategories]);

    async function saveRecipe(ev) {
        ev.preventDefault();
        // Filter out empty values from selected categories
        const selectedCategories = categoryDropdowns
            .map((dropdown) => dropdown.selectedCategory)
            .filter((categoryId) => categoryId);

            const data = {
                title,
                description,
                images,
                category: selectedCategories,
                ingredients: ingredients.map((i) => ({
                    name: i.name,
                    quantity: i.quantity,
                    measurement: i.measurement,
                })),
                procedure: procedure.map((step) => String(step)),
                videoLink,
                nutriValue: nutriValue.map((i) => ({
                    name: i.name,
                    value: i.value,
                })),
                servings, // Add servings to the data object
            };

        if (_id) {
            // Update
            await axios.put("/api/recipes", { ...data, _id });
        } else {
            // Create
            await axios.post("/api/recipes", data);
        }
        setGoBack(true);
    }

    if (goBack) {
        router.push("/recipes");
    }

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            if (images.length + files.length > 3) {
                alert("You can only upload up to three images.");
                return;
            }
    
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append("file", file);
            }
            const res = await axios.post("/api/upload", data);
            setImages((oldImages) => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }
    
    function updateImagesOrder(images) {
        setImages(images);
    }

    function removeImage(indexToRemove) {
        setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
    }    

    function addIngredient() {
        setIngredients((prev) => [
            ...prev,
            { name: "", quantity: "", measurement: "" },
        ]);
    }

    function addNutriValue() {
        setNutriValue((prev) => [...prev, { name: "", value: "" }]);
    }

    function handleIngredientNameChange(index, newIngredient) {
        setIngredients((prev) => {
            const updatedIngredients = [...prev];
            updatedIngredients[index] = newIngredient;
            return updatedIngredients;
        });
    }

    function handleIngredientQuantityChange(index, newIngredient) {
        setIngredients((prev) => {
            const updatedIngredients = [...prev];
            updatedIngredients[index] = newIngredient;
            return updatedIngredients;
        });
    }

    function handleIngredientMeasurementChange(index, newIngredient) {
        setIngredients((prev) => {
            const updatedIngredients = [...prev];
            updatedIngredients[index] = newIngredient;
            return updatedIngredients;
        });
    }

    function handleCategoryChange(event, dropdownId) {
        const selectedOptions = Array.from(
            event.target.selectedOptions,
            (option) => option.value
        );
        setCategoryDropdowns((prev) =>
            prev.map((dropdown) =>
                dropdown.id === dropdownId
                    ? { ...dropdown, selectedCategory: selectedOptions[0] }
                    : dropdown
            )
        );
    }

    function addCategoryDropdown() {
        setCategoryDropdowns((prev) => [
            ...prev,
            { id: Date.now(), selectedCategory: "" },
        ]);
    }

    function removeCategoryDropdown(dropdownId) {
        setCategoryDropdowns((prev) =>
            prev.filter((dropdown) => dropdown.id !== dropdownId)
        );
    }

    function removeIngredient(indexToRemove) {
        setIngredients((prev) => prev.filter((_, i) => i !== indexToRemove));
    }

    function handleNutriValueNameChange(index, newNutriValue) {
        setNutriValue((prev) => {
            const updatedNutriValue = [...prev];
            updatedNutriValue[index] = newNutriValue;
            return updatedNutriValue;
        });
    }

    function handleNutriValueValueChange(index, newNutriValue) {
        setNutriValue((prev) => {
            const updatedNutriValue = [...prev];
            updatedNutriValue[index] = newNutriValue;
            return updatedNutriValue;
        });
    }

    function removeNutriValue(indexToRemove) {
        setNutriValue((prev) => prev.filter((_, i) => i !== indexToRemove));
    }

    function addProcedureStep() {
        setProcedure((prevProcedure) => [...prevProcedure, ""]);
    }
    
    function removeProcedureStep(indexToRemove) {
        setProcedure((prevProcedure) =>
            prevProcedure.filter((_, index) => index !== indexToRemove)
        );
    }
    
    function handleProcedureStepChange(index, newStep) {
        setProcedure((prevProcedure) => {
            const updatedProcedure = [...prevProcedure];
            updatedProcedure[index] = newStep;
            return updatedProcedure;
        });
    }
    
    function cancel() {
        router.push("/recipes");
    }

    return (
        <form onSubmit={saveRecipe}>
            <label>Recipe name</label>
            <input
                type="text"
                placeholder="recipe name"
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
            />
            <label className="block">Category</label>
            <button
                type="button"
                onClick={addCategoryDropdown}
                className="btn-default block text-sm mb-2"
            >
                Add category
            </button>
            {categoryDropdowns.length > 0 && (
                categoryDropdowns.map((dropdown) => (
                    <div key={dropdown.id} className="flex gap-1 mb-2">
                        <select
                            value={dropdown.selectedCategory}
                            onChange={(ev) => handleCategoryChange(ev, dropdown.id)}
                            className="mb-0"
                        >
                            <option value="">Select category</option>
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
                ))
            )}
            <label>Images</label>
            <div className="mb-2 flex flex-wrap gap-1">
            <ReactSortable
                list={images}
                className="flex flex-wrap gap-1"
                setList={updateImagesOrder}
            >
                {!!images?.length &&
                    images.map((link, index) => (
                        <div key={link} className="h-24 shadow-md relative">
                            <img src={link} alt="" className="rounded-lg" />
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute top-0 right-0 text-white text-sm px-1 py-1 rounded-tl-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))}
            </ReactSortable>
                {isUploading && (
                    <div className="h-24 p-1 flex items-center">
                        <Spinner />
                    </div>
                )}
                <label className="w-24 h-24 text-center flex flex-col items-center justify-center text-sm text-gray-700 rounded-md bg-white shadow-md cursor-pointer border border-gray-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                    </svg>
                    <div>Add image</div>
                    <input type="file" onChange={uploadImages} className="hidden" />
                </label>
            </div>

            <label>Description</label>
            <textarea
                type="text"
                className="h-20"
                placeholder="description"
                value={description}
                onChange={(ev) => setDescription(ev.target.value)}
            />
            <label>Servings</label>
                <input
                    type="number"
                    placeholder="servings"
                    value={servings}
                    onChange={(ev) => setServings(ev.target.value)}
                />
            <div className="mb-2">
                <label className="block">Ingredients</label>
                <button
                    onClick={addIngredient}
                    type="button"
                    className="btn-default block text-sm mb-2"
                >
                    Add new ingredient
                </button>
                {ingredients.length > 0 &&
                    ingredients.map((ingredient, index) => (
                        <div className="flex gap-1 mb-2" key={index}>
                            <input
                                type="text"
                                required
                                value={ingredient.name}
                                className="mb-0"
                                onChange={(ev) =>
                                    handleIngredientNameChange(index, {
                                        ...ingredient,
                                        name: ev.target.value,
                                    })
                                }
                                placeholder="ingredient name (example: tomato)"
                            />
                            <input
                                type="text"
                                required
                                className="mb-0"
                                onChange={(ev) =>
                                    handleIngredientQuantityChange(index, {
                                        ...ingredient,
                                        quantity: ev.target.value,
                                    })
                                }
                                value={ingredient.quantity}
                                placeholder="quantity"
                            />
                            <input
                                type="text"
                                required
                                className="mb-0"
                                onChange={(ev) =>
                                    handleIngredientMeasurementChange(index, {
                                        ...ingredient,
                                        measurement: ev.target.value,
                                    })
                                }
                                value={ingredient.measurement}
                                placeholder="measurement"
                            />
                            <button
                                onClick={() => removeIngredient(index)}
                                type="button"
                                className="bg-red-200 text-red-600 text-sm px-4 py-1 rounded-sm"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <label>Procedure</label>
                    <button
                        onClick={addProcedureStep}
                        type="button"
                        className="btn-default block text-sm mb-2"
                    >
                        Add procedure step
                    </button>
                    {procedure.map((step, index) => (
                        <div className="flex gap-1 mb-2" key={index}>
                            <input
                                type="text"
                                required
                                className="mb-0"
                                value={step}
                                onChange={(ev) => handleProcedureStepChange(index, ev.target.value)}
                                placeholder={`Step ${index + 1}`}
                            />
                            <button
                                onClick={() => removeProcedureStep(index)}
                                type="button"
                                className="bg-red-200 text-red-600 text-sm px-4 py-1 rounded-sm"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                <label>Video URL</label>
                <input
                    type="text"
                    placeholder="video link"
                    value={videoLink}
                    onChange={(ev) => setVideoLink(ev.target.value)}
                />
            </div>
            <label className="block">Nutritional Values</label>
            <button
                onClick={addNutriValue}
                type="button"
                className="btn-default block text-sm mb-2"
            >
                Add nutritional value
            </button>
            {nutriValue.length > 0 &&
                nutriValue.map((nutriValue, index) => (
                    <div className="flex gap-1 mb-2" key={index}>
                        <input
                            type="text"
                            required
                            value={nutriValue.name}
                            className="mb-0"
                            onChange={(ev) =>
                                handleNutriValueNameChange(index, {
                                    ...nutriValue,
                                    name: ev.target.value,
                                })
                            }
                            placeholder="nutrition name (example: calories)"
                        />
                        <input
                            type="text"
                            required
                            className="mb-0"
                            onChange={(ev) =>
                                handleNutriValueValueChange(index, {
                                    ...nutriValue,
                                    value: ev.target.value,
                                })
                            }
                            value={nutriValue.value}
                            placeholder="value"
                        />
                        <button
                            onClick={() => removeNutriValue(index)}
                            type="button"
                            className="bg-red-200 text-red-600 text-sm px-4 py-1 rounded-sm"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                    <button type="submit" className="btn-primary">Save</button>
                    <button type="button" onClick={cancel} className="btn-secondary ml-1">
                        Cancel
                    </button>
        </form>
    );
}