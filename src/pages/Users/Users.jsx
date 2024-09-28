import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]); // State to store user data
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to manage error messages

    // Function to fetch user data from the API
    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://billing-manager-server.vercel.app/api/users');
            setUsers(response.data); // Store user data in state
        } catch (err) {
            setError(err.message); // Set error message if the request fails
        } finally {
            setLoading(false); // Set loading to false after request completes
        }
    };

    // useEffect to fetch user data on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Display loading text while fetching data
    }

    if (error) {
        return <div>Error: {error}</div>; // Display error message if any
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 container mx-auto">
            {users.map((user) => (
                <div key={user._id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
                    <img src={user.photoURL} alt={user.name} className="w-full h-64 object-cover rounded-lg mb-4 bg-white" />
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-gray-600">{user.mobile}</p>
                    <p className="text-gray-600">{user.area}</p>
                    <p className="text-gray-600">Role: {user.role}</p>
                    <p className="text-gray-600">Panel Charge: {user.panelCharge}</p>
                </div>
            ))}
        </div>
    );
};

export default Users;
