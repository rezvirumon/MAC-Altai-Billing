import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const MyCollections = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth(); // Get the logged-in user's data

    // Fetch customers and their payment history
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('https://billing-manager-server.vercel.app/api/customers');
                setCustomers(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch customer data');
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">My Collections</h1>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">Customer Name</th>
                            <th className="border border-gray-300 px-4 py-2">MAC Address</th>
                            <th className="border border-gray-300 px-4 py-2">Payment Amount</th>
                            <th className="border border-gray-300 px-4 py-2">Payment Date</th>
                            <th className="border border-gray-300 px-4 py-2">Receiver Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) =>
                            // Filter payments where receiverName matches the logged-in user's email
                            customer.paymentHistory
                                .filter((payment) => payment.receiverName === user.email)
                                .map((payment) => (
                                    <tr key={payment._id} className='hover:bg-base-200'>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {customer.fullName || 'N/A'}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {customer.macAddress}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            ${payment.amount}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {new Date(payment.payDate).toLocaleDateString()}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {payment.receiverName}
                                        </td>
                                    </tr>
                                ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyCollections;
