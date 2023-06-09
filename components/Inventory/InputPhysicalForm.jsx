import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const InputPhysicalForm = ({user}) => {
    const router = useRouter();

    const [inventory, setInventory] = useState([]);
    const [formValues, setFormValues] = useState({
        name: '',
        quantity: '',
        description: '',
    });

    useEffect(() => {
        getInventory();
    }, []);;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formValues.name || !formValues.quantity) {
            alert('Please fill out all required (*) fields');
            return;
        }

        if (formValues.description == '') {
            formValues.description = 'No description';
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

    async function getInventory() {
        try {
            const response = await fetch('/api/inventory/getInventory', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Request failed with status ' + response.status);
            }

            const data = await response.json();
            setInventory(data);
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
                    <label htmlFor="name"> Ingredient Name <span>* </span>
                        {formValues.name && (
                            <span className="current-quantity">
                                {/* Add a heading of Current Quantity of <Name>  */}
                                    Current Quantity: {inventory.find((i) => i.ingredientName === formValues.name)?.quantity} {inventory.find((i) => i.ingredientName === formValues.name)?.unit}
                            </span>
                        )}
                    </label>
                    <select
                        type="text"
                        name="name"
                        id="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                    >
                        <option value="" hidden>Select Ingredient</option>
                        {inventory.map((i) => (
                            <option key={i.inventoryId} value={i.ingredientName}>
                                {i.ingredientName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity <span>* </span>
                        {formValues.name && (
                            <span className="current-quantity">
                                {/* Add a heading of Current Quantity of <Name>  */}
                                Input in {inventory.find((i) => i.ingredientName === formValues.name)?.unit}
                            </span>
                        )}
                    </label>
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



                <button type="button" 
                    onClick={
                        () => router.push('/inventory')
                    }> Cancel</button>
                <button type="submit">Submit to Manager</button>
                {/* Add Cancel Button */}
            </form>
        </div>
    )
}

export default InputPhysicalForm