import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AddVariantForm = () => {
    const router = useRouter();

    const [inventory, setInventory] = useState([]);
    const [formValues, setFormValues] = useState({
        name: '',
        variant: '',
        amount: '',
        unit: '',
    });
    const[selectedInventoryId, setSelectedInventoryId] = useState(null);

    useEffect(() => {
        getInventory();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const inventoryId = inventory.find((i) => i.ingredientName === value)?.inventoryId;
        setSelectedInventoryId(inventoryId); // Update selected inventoryId
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formValues.name || !formValues.quantity) {
            alert('Please fill out all required (*) fields');
            return;
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
            variant: '',
            quantity: '',
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
                    <label htmlFor="quantity">Variant name <span>* </span>
                    </label>
                    <input
                        type="text"
                        name="variant"
                        id="variant"
                        value={formValues.variant}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Unit <span>* </span>
                    </label>
                    <input
                        type="text"
                        name="unit"
                        id="unit"
                        value={formValues.unit}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Amount <span>* </span>
                    </label>
                    <input
                        type="text"
                        name="amount"
                        id="amount"
                        value={formValues.amount}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="button" 
                    onClick={
                        () => router.push('/variants')
                    }> Cancel</button>
                <button type="submit">Submit</button>
                {/* Add Cancel Button */}
            </form>
        </div>
    );
}

export default AddVariantForm