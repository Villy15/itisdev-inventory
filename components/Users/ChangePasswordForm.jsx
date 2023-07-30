import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchAPI, postAPI, deleteAPI, patchAPI } from '@api/*';

const ChangePasswordForm = ({ id }) => {
    const router = useRouter();

    const [users, setUsers] = useState([]);

    const [formValues, setFormValues] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    useEffect(() => {
        async function getUser() {
            try {
                const data = await fetchAPI(`/api/users/getUser?userId=${id}`);
                setUsers(data);
                console.log(data);
            }
            catch (err) {
                console.error(err);
            }
        }

        getUser();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formValues.newPassword || !formValues.confirmPassword) {
            alert('Please fill out all fields');
            return;
        }

        if (formValues.newPassword !== formValues.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const newUser = {
            userId: id,
            password: formValues.newPassword,
        }


        patchUser(newUser);
    };

    async function patchUser(newUser) {
        try {
            const data = await patchAPI(`/api/users/patchUser`, newUser);
            console.log(data);
            router.push('/users');
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="add-inventory-form">
            {users[0] ? (
                <>
                    <h1>{users[0].firstname} {users[0].lastname}</h1>
                    <p>Position: {users[0].role}</p>
                    <form onSubmit={handleSubmit}>
                        {/* Rest of the form elements ... */}
                    </form>
                </>
            ) : (
                <p>Loading user data...</p>
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="password">Input New Password: <span>* </span></label>
                    <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={formValues.newPassword}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmpassword">Input Confirm New Password: <span>* </span></label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formValues.confirmPassword}
                        onChange={handleInputChange}
                    />
                    {/* Add password does not match */}
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

export default ChangePasswordForm