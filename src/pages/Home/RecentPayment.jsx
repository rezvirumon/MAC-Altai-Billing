import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecentPayment = () => {
    const [recentPayments, setRecentPayments] = useState([]);

    useEffect(() => {
        const fetchRecentPayments = async () => {
            try {
                const response = await axios.get('https://billing-manager-server.vercel.app/api/customers');
                const customers = response.data;

                const payments = customers
                    .filter(customer => customer.paymentHistory.length > 0)
                    .map(customer => {
                        const lastPayment = customer.paymentHistory.reduce((latest, payment) => {
                            return new Date(payment.payDate) > new Date(latest.payDate) ? payment : latest;
                        });
                        return {
                            fullName: customer.fullName,
                            payDate: lastPayment.payDate,
                            receiverName: lastPayment.receiverName,
                        };
                    });

                payments.sort((a, b) => new Date(b.payDate) - new Date(a.payDate));
                setRecentPayments(payments.slice(0, 1));
            } catch (error) {
                console.error('Error fetching recent payments:', error);
            }
        };

        fetchRecentPayments();
    }, []);

    return (
        <div className='bg-white p-5 rounded-lg shadow-md'>
            <h2 className="text-2xl font-bold mb-4">Recent Payment</h2>
            <div className='w-full'>
                {recentPayments.length > 0 ? (
                    <table className='min-w-full'>
                        <thead>
                            <tr>
                                <th className='py-2 px-4 border'>Full Name</th>
                                <th className='py-2 px-4 border'>Payment Date</th>
                              
                            </tr>
                        </thead>
                        <tbody>
                            {recentPayments.map((payment, index) => (
                                <tr key={index}>
                                    <td className='py-2 px-4 border'>{payment.fullName}</td>
                                    <td className='py-2 px-4 border'>{new Date(payment.payDate).toLocaleDateString()}</td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No recent payments found.</p>
                )}
            </div>
        </div>
    );
};

export default RecentPayment;
