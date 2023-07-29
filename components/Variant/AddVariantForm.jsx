import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchAPI, postAPI, patchAPI, deleteAPI } from '@api/*';


const AddVariantForm = () => {
    const router = useRouter();
    const { ingredientId } = router.query; 

    const [inventory, setInventory] = useState([]);
    const [formValues, setFormValues] = useState({
        name: '',
        variant: '',
        amount: '',
        units: '',
    });

    const [units, setUnits] = useState([]);
    const [variants, setVariants] = useState([]);

    useEffect(() => {
        getInventory();
        getUnits();
        getAllVariants();
    }, []);


    useEffect(() => {
        // ... existing useEffect code ...
    
        // When the "ingredientId" changes, set the corresponding ingredient name in the form
        if (ingredientId) {
          const selectedIngredient = inventory.find(
            (i) => i.inventoryId === parseInt(ingredientId)
          );
    
          if (selectedIngredient) {
            setFormValues((prevFormValues) => ({
              ...prevFormValues,
              name: selectedIngredient.ingredientName,
            }));
          }
        }
      }, [ingredientId, inventory]);
      
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formValues.name || !formValues.variant || !formValues.amount || !formValues.units) {
            alert('Please fill out all fields');
            return;
        }

        const newVariant = {
            variationId: Math.max.apply(Math, variants.map(function(i) { return i.variationId; })) + 1,
            inventoryId: inventory.find((i) => i.ingredientName === formValues.name).inventoryId,
            amount: formValues.amount,
            unit: formValues.units,
            variationName: formValues.variant,
        };
        
        console.log(newVariant);
        postVariation(newVariant);

        setFormValues({
            name: '',
            variant: '',
            amount: '',
            units: '',
        });
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

    async function getAllVariants() {
        try {
            const data = await fetchAPI("/api/variation/getAllVariantswId");
            setVariants(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function postVariation(newVariant) {
        try {
            const data = await postAPI("/api/variation/postVariant", newVariant);
            console.log(data);
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
                    <label htmlFor="quantity">Amount <span>* </span>
                    </label>
                    <input
                        type="number"
                        name="amount"
                        id="amount"
                        value={formValues.amount}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Unit Measurement <span>* </span>
                    </label>
                    <select
                        type="text"
                        name="units"
                        id="units"
                        value={formValues.units}
                        onChange={handleInputChange}
                    >
                        <option value="" hidden>Select Unit</option>
                        {units.map((i) => (
                            <option key={i.unitshort} value={i.unitshort}>
                                {i.unitshort}
                            </option>
                        ))}
                    </select>
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