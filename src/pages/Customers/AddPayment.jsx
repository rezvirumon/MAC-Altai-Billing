import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth'; // Import useAuth to get current user

const AddPayment = ({ customer, isOpen, onClose, handleUpdateCustomer }) => {
    const { user } = useAuth(); // Get current user
    const [receivedPayment, setReceivedPayment] = useState('');

    const handleInputChange = (e) => {
        setReceivedPayment(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const paymentDate = new Date(); // Get the current date for the payment
            const updatedCustomer = {
                ...customer,
                payAmount: customer.payAmount + Number(receivedPayment),
                connectionDate: paymentDate.toISOString(), // Update connection date
                updatedBy: user ? user.email : 'Unknown', // Use user email
            };

            // Make the API call to update the customer with the new payAmount and connectionDate
            const response = await axios.put(`http://localhost:5000/api/customers/update/${customer._id}`, updatedCustomer);
            
            // Ensure handleUpdateCustomer is defined and a function
            if (typeof handleUpdateCustomer === 'function') {
                handleUpdateCustomer(response.data); // Update the customer in the parent component
            } else {
                console.error('handleUpdateCustomer is not a function');
            }

            // Display success alert and close the modal afterwards
            Swal.fire({
                icon: 'success',
                title: 'Payment Received',
                text: `Payment of ${receivedPayment} TK received for ${customer.fullName}.`,
            }).then(() => {
                onClose(); // Close the modal after the alert is dismissed
            });

        } catch (error) {
            console.error('Error updating payment:', error);
            // Display error alert
            Swal.fire({
                icon: 'error',
                title: 'Payment Failed',
                text: error.response ? error.response.data.message : 'There was an error processing the payment. Please try again.',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4 ">Receive Payment for <span className='text-green-500 font-extrabold'>{customer.fullName}</span></h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Amount Received (TK)</label>
                        <input
                            type="number"
                            name="receivedPayment"
                            value={receivedPayment}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" className="btn" onClick={onClose}>
                        Payment Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Add Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPayment;
