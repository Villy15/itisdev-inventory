import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const InputPhysicalForm = ({user}) => {

    const router = useRouter();
    const [ingredients, setIngredients] = useState([]);
    const [formValues, setFormValues] = useState({
        name: '',
        quantity: '',
        description: '',
    });

    useEffect(() => {
        getIngredients();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formValues.name || !formValues.quantity || !formValues.description) {
            alert('Please fill out all fields');
            return;
        }

        const newReport = { 
            // reportid: 1,
            ingredientname: formValues.name,    
            // ingredientID: ingredients.find((ingredient) => ingredient.name === formValues.name).id,
            quantity: ingredients.find((ingredient) => ingredient.name === formValues.name).quantity,
            physicalcount: formValues.quantity,
            datetime: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }),
            userid: user,
            description: formValues.description,
         };

        postReport(newReport);

        setFormValues({
            name: '',
            quantity: '',
            description: '',
        });
    };

    async function getIngredients() {
        try {
            const response = await fetch('/api/inventory/getIngredients', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Request failed with status ' + response.status);
            }

            const data = await response.json();
            setIngredients(data);
        } catch (err) {
            console.error(err);
        }
    }
 
    async function postReport(newReport) {
        try {
            const response = await fetch('/api/reports/postReport', {
                method: 'POST',
                body: JSON.stringify(newReport),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Request failed with status ' + response.status);
            }

            const data = await response.json();
            console.log(data);
            router.push('/reports');
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div className='add-inventory-form'>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name"> Ingredient Name</label>
                    <select
                        type="text"
                        name="name"
                        id="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                    >
                        <option value="" hidden>Select Ingredient</option>
                        {ingredients.map((ingredient) => (
                            <option key={ingredient._id} value={ingredient.name}>{ingredient.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                        type="text"
                        name="quantity"
                        id="quantity"
                        value={formValues.quantity}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        value={formValues.description}
                        onChange={handleInputChange}
                        className='description'
                    />
                </div>

                <button type="submit">Save</button>
            </form>
        </div>
    )
}

export default InputPhysicalForm