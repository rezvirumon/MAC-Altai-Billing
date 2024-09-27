import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InactiveCustomers = () => {
    const [inactiveCustomers, setInactiveCustomers] = useState([]);

    useEffect(() => {
        const fetchInactiveCustomers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/customers');
                const customers = response.data;
                const inactive = customers.filter(customer => customer.status !== 'Active');
                setInactiveCustomers(inactive);
            } catch (error) {
                console.error('Error fetching inactive customers:', error);
            }
        };

        fetchInactiveCustomers();
    }, []);

    const getLastPaymentDate = (paymentHistory) => {
        if (paymentHistory.length === 0) return 'N/A';
        const lastPayment = paymentHistory.reduce((latest, payment) => {
            return new Date(payment.payDate) > new Date(latest.payDate) ? payment : latest;
        });
        return new Date(lastPayment.payDate).toLocaleDateString();
    };

    return (
        <div className='bg-white p-5 rounded-lg shadow-md'>
            <h2 className="text-2xl font-bold mb-4">Inactive Customers</h2>
            <div className='overflow-x-auto'>
                {inactiveCustomers.length > 0 ? (
                    <table className='min-w-full table-auto'>
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className='py-2 px-4 border'>Name</th>
                                <th className='py-2 px-4 border'>MAC Address</th>
                                <th className='py-2 px-4 border'>Mobile</th>
                                <th className='py-2 px-4 border'>Last Payment Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inactiveCustomers.map((customer) => (
                                <tr key={customer._id} className="hover:bg-gray-50">
                                    <td className='py-2 px-4 border'>{customer.fullName}</td>
                                    <td className='py-2 px-4 border'>{customer.macAddress}</td>
                                    <td className='py-2 px-4 border'>{customer.mobile}</td>
                                    <td className='py-2 px-4 border'>{getLastPaymentDate(customer.paymentHistory)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No inactive customers found.</p>
                )}
            </div>
        </div>
    );
};

export default InactiveCustomers;
