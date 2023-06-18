import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ReplenishStockForm = ({user}) => {
    const router = useRouter();

    const [inventory, setInventory] = useState([]);
    const [formValues, setFormValues] = useState({
        name: '',
        quantity: '',
        description: '',
    });

    useEffect(() => {
        getInventory();
    }, []);

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

        const newIncrease_Inventory = { 
            newDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }),
            userId: user,
            inventoryId: inventory.find((i) => i.ingredientName === formValues.name).inventoryId,
            quantity: formValues.quantity,
            unit: inventory.find((i) => i.ingredientName === formValues.name).unit,
            // description: formValues.description,
        };

        const updateInventoryQuantity = {
            inventoryId: inventory.find((i) => i.ingredientName === formValues.name).inventoryId,
            quantity: parseFloat(formValues.quantity) + parseFloat(inventory.find((i) => i.ingredientName === formValues.name).quantity),
        };

        postIncreaseInventory(newIncrease_Inventory);
        patchInventory(updateInventoryQuantity);

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
 
    async function postIncreaseInventory(newIncrease_Inventory) {
        try {
            const response = await fetch('/api/inventory/postIncreaseInventory', {
                method: 'POST',
                body: JSON.stringify(newIncrease_Inventory),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Request failed with status ' + response.status);
            }

            const data = await response.json();
        } catch (error) {
            console.error(error);
        }
    }


    async function patchInventory(updateInventoryQuantity) {
        try {
            const response = await fetch('/api/inventory/patchInventory', {
                method: 'PATCH',
                body: JSON.stringify(updateInventoryQuantity),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error('Request failed with status ' + response.status);
            }

            const data = await response.json();
            router.push('/inventory');
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
                <button type="submit">Replenish</button>
                {/* Add Cancel Button */}
            </form>
        </div>
    )
}

export default ReplenishStockForm