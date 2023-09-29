import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function RecipeForm({
        _id,
        title:existingTitle,
        description:existingDescription,
        ingredients:existingIngredients,
        images:existingImages,
        category:assignedCategory,
        procedure:existingProcedure,
        videoLink:existingVideoLink,
    }) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [category, setCategory] = useState(assignedCategory || '');
    const [ingredients, setIngredients] = useState(existingIngredients || []);
    const [images, setImages] = useState(existingImages || []);
    const [goBack, setGoBack] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [procedure, setProcedure] = useState(existingProcedure || '');
    const [videoLink, setVideoLink] = useState(existingVideoLink || '');

    const router = useRouter();
    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }, []);
    
    async function saveRecipe(ev) {
        ev.preventDefault();
        const categoryId = category || null;
        const data = { 
            title,
            description, 
            images, 
            category: categoryId,
            ingredients: ingredients.map(i => ({
                name: i.name,
                values: typeof i.values === 'string' ? i.values.split(',') : i.values,
            })),
            procedure,
            videoLink,
        };
    
        if (_id) {
            // Update
            await axios.put('/api/recipes', { ...data, _id });
        } else {
            // Create
            await axios.post('/api/recipes', data);
        }
        setGoBack(true);
    }
    
    if (goBack) {
        router.push('/recipes');
    }
    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true)
            const data = new FormData();
            for (const file of files){
                data.append('file', file)
            }
            const res = await axios.post('/api/upload', data)
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false)
        }
    }

    function updateImagesOrder(images) {
        setImages(images);
    }

    function addIngredient() {
        setIngredients((prev) => [...prev, { name: "", values: "" }]);
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

    function removeIngredient(indexToRemove) {
        setIngredients((prev) => prev.filter((_, i) => i !== indexToRemove));
    }
    
    return (
            <form onSubmit={saveRecipe}>
                <label>Recipe name</label>
                <input 
                    type="text" 
                    placeholder="recipe name" 
                    value={title} 
                    onChange={ev => setTitle(ev.target.value)}/>
                <label>Category</label>
                <select value={category}
                        onChange={ev => setCategory(ev.target.value)}>
                    <option value="">Uncategorized</option>
                    {categories.length > 0 && categories.map(c => (
                        <option value={c._id}>{c.name}</option>
                    ))};
                </select>
                <label>
                    Images
                </label>
                <div className="mb-2 flex flex-wrap gap-1">
                    <ReactSortable 
                        list={images} 
                        className="flex flex-wrap gap-1"
                        setList={updateImagesOrder}>
                        {!!images?.length && images.map(link => (
                            <div key={link} className="h-24 shadow-md">
                                <img src={link} alt="" className="rounded-lg" />
                            </div>
                        ))}
                    </ReactSortable>
                    {isUploading && (
                        <div className="h-24 p-1 flex items-center">
                            <Spinner />
                        </div>
                    )}
                    <label className="w-24 h-24 text-center flex flex-col items-center justify-center text-sm text-gray-700 rounded-md bg-white shadow-md cursor-pointer border border-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Add image
                    </div>
                    <input type="file" onChange={uploadImages} className="hidden"/>
                    </label>
                </div>

                <label>Description</label>
                <textarea 
                    type="text" 
                    className="h-20"
                    placeholder="description"
                    value={description}
                    onChange={ev => setDescription(ev.target.value)}/>
                <div className="mb-2">
                <label className="block">Ingredients</label>
                    <button 
                        onClick={addIngredient}
                        type="button" 
                        className="btn-default block text-sm mb-2">
                            Add new ingredient
                    </button>
                    {ingredients.length > 0 && ingredients.map((ingredient, index) => (
                        <div className="flex gap-1 mb-2">
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
                                            values: ev.target.value,
                                        })
                                    }
                                    value={ingredient.values}
                                    placeholder="quantity"
                                />
                            <button 
                                onClick={() => removeIngredient(index)}
                                type="button"
                                className="bg-red-200 text-red-600 text-sm px-4 py-1 rounded-sm">Remove</button>
                        </div>
                    ))}
                <label>Procedure</label>
                <textarea
                    type="text" 
                    className="h-40"
                    required
                    placeholder="procedure" 
                    value={procedure} 
                    onChange={ev => setProcedure(ev.target.value)}
                />

                <label>Video URL</label>
                <input 
                    type="text" 
                    placeholder="video link" 
                    value={videoLink} 
                    onChange={ev => setVideoLink(ev.target.value)}
                />
                </div>
                <button className="btn-primary">Save</button>
            </form>
    );
}