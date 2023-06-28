import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AddUserForm = () => {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [formValues, setFormValues] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        position: '',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formValues.username || !formValues.password || !formValues.confirmPassword || !formValues.position) {
            alert('Please fill out all fields');
            return;
        }

        const newUser = { 
            id: Math.max.apply(Math, users.map(function(i) { return i.id; })) + 1,
            username: formValues.username,
            password: formValues.password,
            role: formValues.position,
    
            // inventoryId: Math.max.apply(Math, inventory.map(function(i) { return i.inventoryId; })) + 1,
            // ingredientName: formValues.name,
            // quantity: parseFloat(formValues.quantity),
            // unit: formValues.unit,
            // updateDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }),
            // enable: true,
            // enableDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }),
         };

        postUser(newUser);

        setFormValues({
            username: '',
            password: '',
            confirmPassword: '',
            position: '',
        });
    };

    async function postUser(newUser) {
        try {
            const response = await fetch('/api/users/postUser', {
                method: 'POST',
                body: JSON.stringify(newUser),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Request failed with status ' + response.status);
            }

            const data = await response.json();
            console.log(data);
            router.push('/users');
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchUsers() {
        try {
          const response = await fetch('/api/users/getUsers', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (!response.ok) {
            throw new Error('Request failed with status ' + response.status);
          }
    
          const data = await response.json();
          setUsers(data);
        } catch (err) {
          console.error(err);
        }
      }


    return (
        <div className='add-inventory-form'>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Input Username: <span>* </span></label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={formValues.username}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="sub-group">
                    <div className="form-group">
                        <label htmlFor="password">Input Password: <span>* </span></label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formValues.password}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmpassword">Confirm Password: <span>* </span></label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={formValues.confirmPassword}
                            onChange={handleInputChange}
                        />
                        {/* Add password does not match */}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="unit">Position <span>* </span></label>
                    <select
                        type="text"
                        name="position"
                        id="position"
                        value={formValues.position}
                        onChange={handleInputChange}
                    >
                        <option value="" hidden>Select Ingredient</option>
                        <option value="Manager">Manager</option>
                        <option value="Stock Controller">Stock Controller</option>
                        <option value="Cashier">Cashier</option>                       
                    </select>
                </div>
                <button type="button" 
                    onClick={
                        () => router.push('/inventory')
                    }> Cancel</button>
                <button type="submit">Save</button>
            </form>
        </div>
    )
}

export default AddUserForm