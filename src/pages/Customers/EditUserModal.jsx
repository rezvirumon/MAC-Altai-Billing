import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2

const EditUserModal = ({ customer, isOpen, onClose, currentUser, handleUpdateCustomer }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        email: '',
        deviceName: '',
        macAddress: '',
        price: '',
        payAmount: '',
    });

    useEffect(() => {
        if (customer) {
            setFormData({
                fullName: customer.fullName,
                mobile: customer.mobile,
                email: customer.email,
                deviceName: customer.deviceName,
                macAddress: customer.macAddress,
                price: customer.price,
                payAmount: customer.payAmount,
            });
        }
    }, [customer]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`https://billing-manager-server.vercel.app/api/customers/update/${customer._id}`, {
                ...formData,
                updatedBy: currentUser ? currentUser.email : 'Unknown',
            });
            console.log('Customer updated successfully:', response.data);
            handleUpdateCustomer(response.data); // Notify parent of update
            onClose(); // Close modal after successful update

            // Show success alert
            Swal.fire({
                title: 'Success!',
                text: 'Customer updated successfully!',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        } catch (error) {
            console.error('Error updating customer:', error);
            // Show error alert
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update customer. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow-md max-w-lg w-full">
                <h3 className="text-xl font-semibold mb-4">Edit Customer</h3>
                <form onSubmit={handleSubmit}>
                    {['fullName', 'mobile', 'email', 'deviceName', 'macAddress'].map((field, idx) => (
                        <div className="mb-4" key={idx}>
                            <label className="block text-sm font-medium">{field.replace(/([A-Z])/g, ' $1')}</label>
                            <input
                                type={field === 'email' ? 'email' : 'text'}
                                name={field}
                                value={formData[field]}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    ))}
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Price (1 Month)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Amount Paid</label>
                        <input
                            type="number"
                            name="payAmount"
                            value={formData.payAmount}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" className="btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
