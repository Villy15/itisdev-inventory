import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchAPI, postAPI, patchAPI, deleteAPI } from '@api/*';


const InputPhysicalForm = ({user}) => {
    const router = useRouter();

    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        getInventory();
    }, []);

    async function getInventory() {
        try {
            const data = await fetchAPI("/api/inventory/getInventoryWithId");
            setInventory(data);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className='add-inventory-form'>
        
        </div>
    )
}

export default InputPhysicalForm