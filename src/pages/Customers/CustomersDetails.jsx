import React from 'react';
import { FaLaptop, FaUserAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const CustomersDetails = () => {
    const location = useLocation();
    const customer = location.state?.customer; // Get the customer data from the state

    if (!customer) {
        return <div>No customer data available.</div>;
    }

    return (
        <div className=" mx-auto p-8 bg-white rounded-lg shadow-md w-[90vw] lg:max-w-4xl">
            {/* Profile Header */}
            <div className="flex items-center space-x-6 mb-6 ">
                {/* Placeholder image, replace src with customer's image URL if available */}
               
                    <FaUserAlt className="w-24 h-24 rounded-full object-cover"></FaUserAlt>
                  
               
                <div>
                    <h2 className="text-3xl font-bold">{customer.fullName}</h2>
                    <p className="text-gray-500">{customer.email || 'No email available'}</p>
                    <p className="text-gray-500">Customer ID: {customer._id.slice(20, 24)}</p>

                </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-200">
                    <h3 className="text-lg font-semibold mb-2">Personal Details</h3>
                    <ul className="text-gray-600 space-y-2">
                        <li><strong>Mobile:</strong> {customer.mobile}</li>
                        <li><strong>MAC Address:</strong> {customer.macAddress}</li>
                        <li><strong>Connection Date:</strong> {new Date(customer.connectionDate).toLocaleDateString()}</li>
                        <li><strong>Status:</strong> {customer.status}</li>
                    </ul>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-200">
                    <h3 className="text-lg font-semibold mb-2">Billing Details</h3>
                    <ul className="text-gray-600 space-y-2">
                        <li><strong>Price (1 Month):</strong> {customer.price} TK</li>
                        <li><strong>Amount Paid:</strong> {customer.payAmount} TK</li>
                        <li><strong>Due Amount:</strong> {customer.dueAmount} TK</li>
                        <li><strong>Remaining Days:</strong> {customer.remainingDays} Days</li>
                    </ul>
                </div>
            </div>

            {/* Payment History */}
            <h3 className="text-xl font-semibold mt-6 mb-4">Payment History</h3>
            {customer.paymentHistory.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100 ">
                                <th className="border border-gray-300 px-4 py-2">Amount (TK)</th>
                                <th className="border border-gray-300 px-4 py-2">Payment Date</th>
                                <th className="border border-gray-300 px-4 py-2">Receiver Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customer.paymentHistory.map(payment => (
                                <tr key={payment._id} className='hover:bg-gray-200'>
                                    <td className="border border-gray-300 px-4 py-2">{payment.amount} TK</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {new Date(payment.payDate).toLocaleDateString()}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{payment.receiverName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No payment history available.</p>
            )}
        </div>
    );
};

export default CustomersDetails;
