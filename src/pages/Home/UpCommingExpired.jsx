import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpCommingExpired = () => {
    const [expiredCustomers, setExpiredCustomers] = useState([]);

    useEffect(() => {
        const fetchExpiredCustomers = async () => {
            try {
                const response = await axios.get('https://billing-manager-server.vercel.app/api/customers/search?query=FC:A6:21:AB:AB:33');
                const customers = response.data;
                const upcomingExpired = customers.filter(customer => customer.remainingDays > 0 && customer.remainingDays <= 2);
                setExpiredCustomers(upcomingExpired);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchExpiredCustomers();
    }, []);

    return (
        <div className='bg-white p-5 rounded-lg shadow-md'>
            <h2 className="text-2xl font-bold mb-4">Upcoming Expired Customers</h2>
            {expiredCustomers.length > 0 ? (
                <ul>
                    {expiredCustomers.map(customer => (
                        <li key={customer._id} className="border-b py-2">
                            <p className="font-semibold">{customer.fullName}</p>
                           
                            <p>Remaining Days: {customer.remainingDays}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No customers expiring in the next two days.</p>
            )}
        </div>
    );
};

export default UpCommingExpired;
