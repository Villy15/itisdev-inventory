import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchAPI, postAPI, patchAPI, deleteAPI } from '@api/*';
import { FileUploader } from 'react-drag-drop-files';

const fileTypes = ['JPEG', 'JPG', 'PNG'];

const AddDishForm = () => {
    const router = useRouter();

    const [formValues, setFormValues] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        image: '',
    });

    const [ingredients, setIngredients] = useState([]);
    const [units, setUnits] = useState([]); 
    const [inventory, setInventory] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {   
        getInventory();
        getUnits();
        getDishes();
        getRecipes();
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index][field] = value;
        setIngredients(updatedIngredients);
      };
    
      const handleAddIngredient = () => {
        setIngredients([...ingredients, { ingredient: '', quantity: '', unit: '' }]);
      };
    
      const handleRemoveIngredient = (index) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients.splice(index, 1);
        setIngredients(updatedIngredients);
      };

    const [file, setFile] = useState(null);

    const handleChange = (file) => {
        // Assuming you want to handle only one file for the image, so we'll take the first one from the array.
        // If you want to handle multiple images, modify accordingly.
        setFile(file[0]);
    };

    useEffect(() => {
        console.log(ingredients);
    }, [ingredients]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if all required fields are filled
        if (!formValues.name || !formValues.price || !formValues.category) {
          alert('Please fill out all required fields');
          return;
        }
    
        const dishId = Math.max.apply(Math, dishes.map(function(i) { return i.dishId; })) + 1;
        // Construct the new dish object
        const newDish = {
            dishId: dishId,
            dishName: formValues.name,
            dishPhoto: getFileNameFromPath(formValues.image),
            category: formValues.category,
            price: parseFloat(formValues.price),
            enable: false,
            enableDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }),
            description: formValues.description,
            confirmed: false,
        };

         // Append the image file to the newDish object (if present)
        if (file) {
            newDish.image = file.preview;
        }

        console.log(newDish);
        await postDish(newDish);
    
        // Reset form values and ingredients
    
        // loop ingredients and post to dish_ingredient table
        let  recipeId = Math.max.apply(Math, recipes.map(function(i) { return i.recipeId; })) + 1;

        ingredients.forEach(async (ingredient) => {
            const newRecipe = {
                recipeId: recipeId,
                dishId: dishId,
                ingredientId: inventory.find((i) => i.ingredientName === ingredient.ingredient).inventoryId,
                quantity: parseFloat(ingredient.quantity),
                unit: ingredient.unit,
            };
            console.log(newRecipe);
            recipeId++;

            await postRecipe(newRecipe);
        });

        setFormValues({
            name: '',
            price: '',
            category: '',
            description: '',
            image: '',
          });

        setIngredients([]);
        setFile(null); // Reset the selected file after form submission
    };

    async function getInventory() {
        try {
            const data = await fetchAPI("/api/inventory/getInventoryWithId");
            setInventory(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function getUnits() {
        try {
            const data = await fetchAPI("/api/units_table/getUnits");
            setUnits(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function postDish(newDish) {
        try {
            const data = await postAPI("/api/dish/postDish", newDish);
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function getDishes () {
        try {
            const data = await fetchAPI("/api/dish/getDish");
            setDishes(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function getRecipes () {
        try {
            const data = await fetchAPI("/api/recipe/getRecipes");
            setRecipes(data);
        } catch (err) {
            console.error(err);
        }
    }
    
    async function postRecipe (newRecipe) {
        try {
            const data = await postAPI("/api/recipe/postRecipe", newRecipe);
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className='add-inventory-form'>
            <form onSubmit={handleSubmit}>
                <div className="sub-group">
                    <div className="form-group">
                        <label htmlFor="name">Input Food/Drink Name: <span>* </span></label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formValues.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Input Price: <span>* </span></label>
                        <input
                            type="number" // Number
                            name="price"
                            id="price"
                            value={formValues.price}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category <span>* </span></label>
                    <select
                        type="text"
                        name="category"
                        id="category"
                        value={formValues.category}
                        onChange={handleInputChange}
                    >

                        <option value="" hidden>Select Category</option>
                        <option value="Appetizers">Appetizers</option>
                        <option value="Mains">Mains</option>
                        <option value="Beverages">Beverages</option>                       
                        <option value="Desserts">Desserts</option>                       
                    </select>
                </div>
                <div className="sub-group">
                    <div className="form-group">
                            <label htmlFor="description">Input Food/Drink Description: </label>
                            <input
                                type="text"
                                name="description"
                                id="description"
                                className='description'
                                value={formValues.description}
                                onChange={handleInputChange}
                            />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Upload your image here: </label>
                        <FileUploader
                            multiple={true}
                            handleChange={handleChange}
                            name="image"
                            types={fileTypes}
                            uploadText="Drop or click to select an image"
                        />
                        <p>{file ? `File name: ${file.name}` : 'no image selected'}</p>
                    </div> 
                </div>
                {/* Add Table where you can input ingredients, quantity, and unit */}
                <div className="ingredients-table">
                    <h2>Input List of Recipe Ingredients</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Ingredient</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>
                                    <button type="button" onClick={handleAddIngredient}>
                                        Add Ingredient
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {ingredients.map((ingredient, index) => (
                                <tr key={index}>
                                    <td>
                                        <select
                                            type="text"
                                            value={ingredient.ingredient}
                                            onChange={(e) => handleIngredientChange(index, 'ingredient', e.target.value)}
                                        >
                                            <option value="" hidden>Select Ingredient</option>
                                            {inventory.map((i) => (
                                                <option key={i.inventoryId} value={i.ingredientName}>
                                                    {i.ingredientName}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={ingredient.quantity}
                                            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                        />
                                    </td>
                                    <td>

                                        <select
                                            type="text"
                                            value={ingredient.unit}
                                            onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                        >
                                            <option value="" hidden>Select Unit</option>
                                            {units.map((i) => (
                                                <option key={i.unitshort} value={i.unitshort}>
                                                    {i.unitshort}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <button type="button" onClick={() => handleRemoveIngredient(index)}>
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button type="button" 
                    onClick={
                        () => router.push('/inventory')
                    }> Cancel</button>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

function getFileNameFromPath(filePath) {
    // Split the filePath by the backslash (\) or forward slash (/) to separate the path and filename
    const pathSegments = filePath.split(/[\\\/]/);
    // Get the last segment (filename) and split it by the dot (.) to separate the filename and extension
    const filenameSegments = pathSegments.pop().split('.');
    // Join all segments except the last one to get the filename without the extension
    return filenameSegments.slice(0, -1).join('.');
}


export default AddDishForm