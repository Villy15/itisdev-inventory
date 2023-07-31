import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchAPI, postAPI, patchAPI, deleteAPI } from '@api/*';


const DeleteUserForm = () => {
    const router = useRouter();
    const [users, setUsers] = useState([]);
     
    const [formValues, setFormValues] = useState({
        id: '',
    });

    useEffect(() => {
        getUsers();
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formValues.id) {
            alert('Please select a user to delete.');
            return;
        }

        const newUser = {
            id: formValues.id,
            // Add other properties here if needed...
        };

        patchUser(newUser);

        setFormValues({
            id: '',
        });
    };


    async function getUsers() {
        try {
            const data = await fetchAPI("/api/users/getUsersDisable");
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function patchUser(newUser) {
        try {
            const data = await patchAPI("/api/users/patchUserDisable", newUser);
            console.log(data);
            router.push('/users');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className='add-inventory-form'>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="quantity">Employee Full Name<span>* </span>
                    </label>
                    <select
                        type="text"
                        name="id"
                        id="id"
                        value={formValues.id}
                        onChange={handleInputChange}
                    >
                        <option value="" hidden>Select User</option>
                        {users.map((i) => (
                            <option key={i.id} value={i.id}>
                                {i.firstname} {i.lastname}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="button"
                    onClick={
                        () => router.push('/users')
                    }> Cancel</button>
                <button type="submit">Delete</button>
            </form>
        </div>
    )
}

export default DeleteUserForm