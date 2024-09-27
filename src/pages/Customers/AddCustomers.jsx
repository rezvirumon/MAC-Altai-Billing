import React, { useState } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';  // Import useAuth to access user data

const AddCustomers = () => {
    const { user } = useAuth();  // Access logged-in user
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        email: '',
        connectionDate: '',
        deviceName: 'Mobile',
        macAddress: '',
        price: 100,
        addedBy: user?.email // Automatically set logged-in user's email
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Add the logged-in user's email to formData
            const customerData = {
                ...formData,
                addedBy: user.email  // Ensure addedBy field contains the current user's email
            };

            const response = await axios.post('http://localhost:5000/api/customers/add', customerData);
            if (response.status === 201) {
                alert('Customer created successfully!');
                setFormData({
                    fullName: '',
                    mobile: '',
                    email: '',
                    connectionDate: '',
                    deviceName: 'Mobile',
                    macAddress: '',
                    price: 100,
                    addedBy: user?.email // Reset form with user's email
                });
            }
        } catch (error) {
            console.error('There was an error creating the customer!', error);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-8">
            <h3 className="text-center text-3xl font-semibold my-10">
                Create Customer
            </h3>
            <div>
                <form onSubmit={handleSubmit}>
                    {/* Customer Info */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            placeholder="Enter full name"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Mobile No
                        </label>
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            placeholder="Enter mobile number"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Email (Optional)
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            placeholder="Enter email (optional)"
                        />
                    </div>

                    {/* Device Info */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Connection Date
                        </label>
                        <input
                            type="date"
                            name="connectionDate"
                            value={formData.connectionDate}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Device Name
                        </label>
                        <select
                            name="deviceName"
                            value={formData.deviceName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="Mobile">Mobile</option>
                            <option value="PC">PC</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Device MAC Address
                        </label>
                        <input
                            type="text"
                            name="macAddress"
                            value={formData.macAddress}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            placeholder="Enter MAC address"
                            required
                        />
                    </div>

                    {/* Set Price (Default 1 month) */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Price (1 Month)
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            placeholder="Enter price"
                            readOnly
                        />
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Create Customer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomers;
