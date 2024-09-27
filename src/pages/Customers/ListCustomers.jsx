import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaCopy, FaEllipsisV, FaCalendarAlt, FaRegClock, FaCheckCircle } from 'react-icons/fa';
import EditUserModal from './EditUserModal';
import AddPayment from './AddPayment';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import swal from 'sweetalert';
import { FaBangladeshiTakaSign } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const ListCustomers = () => {
    const { user } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('All');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/customers', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setCustomers(response.data);
            setFilteredCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
            swal('Error', 'Failed to fetch customers. Please try again.', 'error');
        }
    };

    useEffect(() => {
        if (user) {
            fetchCustomers();
        }
    }, [user]);

    useEffect(() => {
        const filtered = customers.filter(customer => {
            const isMatchingName = customer.fullName.toLowerCase().includes(searchTerm.toLowerCase());
            const isMatchingMac = customer.macAddress.toLowerCase().includes(searchTerm.toLowerCase());
            const isMatchingEmail = customer.email ? customer.email.toLowerCase().includes(searchTerm.toLowerCase()) : false;
            return isMatchingName || isMatchingMac || isMatchingEmail;
        });

        const filteredByPayment = paymentFilter === 'All' ? filtered : filtered.filter(customer => getPaymentStatus(customer) === paymentFilter);
        setFilteredCustomers(filteredByPayment);
    }, [searchTerm, paymentFilter, customers]);

    const getPaymentStatus = (customer) => {
        return customer.payAmount >= customer.price ? 'Paid' : 'Due';
    };

    const copyMacAddress = (macAddress) => {
        navigator.clipboard.writeText(macAddress);
        swal('Copied!', 'MAC Address copied to clipboard.', 'success');
    };

    const openEditModal = (customer) => {
        setSelectedCustomer(customer);
        setEditModalOpen(true);
        setPaymentModalOpen(false); // Close payment modal if it's open
        setDropdownOpen(null);
    };

    const closeEditModal = () => {
        setSelectedCustomer(null);
        setEditModalOpen(false);
    };

    const handleUpdateCustomer = (updatedCustomer) => {
        setCustomers(prevCustomers =>
            prevCustomers.map(customer =>
                customer._id === updatedCustomer._id ? updatedCustomer : customer
            )
        );
    };


    const openPaymentModal = (customer) => {
        setSelectedCustomer(customer);
        setPaymentModalOpen(true);
        setEditModalOpen(false); // Close edit modal if it's open
        setDropdownOpen(null);
    };

    const closePaymentModal = () => {
        setSelectedCustomer(null);
        setPaymentModalOpen(false);
    };

    const toggleDropdown = (customerId) => {
        setDropdownOpen((prev) => (prev === customerId ? null : customerId));
    };

    const deleteCustomer = async (customerId) => {
        try {
            const willDelete = await swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this customer's data!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            });

            if (willDelete) {
                await axios.delete(`http://localhost:5000/api/customers/delete/${customerId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                setCustomers(customers.filter((customer) => customer._id !== customerId));
                setFilteredCustomers(filteredCustomers.filter((customer) => customer._id !== customerId));

                swal('Deleted!', 'Customer has been deleted successfully!', 'success');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            swal('Error', 'Failed to delete customer. Please try again.', 'error');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8">
            <h3 className="text-center text-4xl font-extrabold mb-10 text-gray-900 tracking-wide">Customer List</h3>

            {/* Search and Filter Section */}
            <div className="mb-8 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
                <input
                    type="text"
                    className="border border-gray-300 p-3 rounded-lg shadow-md w-full md:w-2/3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Search by MAC, Name, Email, Mobile..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="border border-gray-300 p-3 rounded-lg shadow-md w-full md:w-1/3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="Paid">Paid</option>
                    <option value="Due">Unpaid</option>
                </select>
            </div>

            {/* Customer List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCustomers.map((customer) => (
                    <div key={customer._id} className="p-6 border-gray-300 rounded-lg shadow-lg bg-white hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2">
                        <div className="flex justify-between items-center">
                            <Link to='/customer-details' state={{ customer }} className='text-xl font-bold mb-4 text-blue-500 hover:underline'>
                                <h4 className="">
                                    Customer-ID #{customer._id.slice(20, 24)}
                                </h4>
                            </Link>
                            <div className="relative">
                                <button
                                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    onClick={() => toggleDropdown(customer._id)}
                                >
                                    <FaEllipsisV />
                                </button>
                                {dropdownOpen === customer._id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                                        <ul className="py-2">
                                            <li>
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => openEditModal(customer)}
                                                >
                                                    Edit Customer
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => openPaymentModal(customer)}
                                                >
                                                    Update Payment
                                                </button>
                                            </li>
                                            <li>
                                                <Link to='/customer-details' state={{ customer }} // Pass the selected customer data
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    View Details
                                                </Link>

                                            </li>
                                            <li>
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                                                    onClick={() => deleteCustomer(customer._id)}
                                                >
                                                    Delete Customer
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <ul className="text-gray-600 space-y-2 mb-4">
                            <li>
                                <strong>MAC Address:</strong> {customer.macAddress}{' '}
                                <button
                                    className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                                    onClick={() => copyMacAddress(customer.macAddress)}
                                >
                                    <FaCopy />
                                </button>
                            </li>
                            <li className='flex justify-between'>
                                <div>
                                    <strong>Full Name:</strong> {customer.fullName}
                                </div>
                                <span className='bg-base-300 px-2 rounded-full'>{customer.status}</span>
                            </li>
                            <li>
                                <strong>Mobile No:</strong> <FaPhone className="inline mr-1" /> {customer.mobile}
                            </li>
                            <li>
                                <strong>Email:</strong> <FaEnvelope className="inline mr-1" /> {customer.email || 'N/A'}
                            </li>
                            <li>
                                <strong>Connection Date:</strong> <FaCalendarAlt className="inline mr-1" /> {new Date(customer.connectionDate).toLocaleDateString()}
                            </li>
                        </ul>

                        <div className="bg-white hover:bg-gray-100  shadow-md p-6 rounded-lg border border-gray-200">
                            <h5 className="font-semibold text-gray-800 mb-4">Payment Info</h5>
                            <ul className="text-gray-700 space-y-2">
                                <li>
                                    <strong>Price (1 Month):</strong>
                                    <FaBangladeshiTakaSign className="inline mr-1" />
                                    <span className="font-medium text-gray-900">{customer.price} TK</span>
                                </li>
                                <li>
                                    <strong>Amount Paid:</strong>
                                    <FaBangladeshiTakaSign className="inline mr-1" />
                                    <span className="font-medium text-gray-900">{customer.payAmount} TK</span>
                                </li>
                                <li>
                                    <strong>Due Amount:</strong>
                                    <span className="bg-red-600 text-white px-3 py-1 rounded-full font-medium">
                                        <FaBangladeshiTakaSign className="inline mr-1" /> {customer.dueAmount} TK
                                    </span>
                                </li>
                                <li>
                                    <strong>Remaining Days:</strong>
                                    <span className="bg-green-500 text-white px-3 py-1 rounded-full font-medium">
                                        <FaRegClock className="inline mr-1" /> {customer.remainingDays} Days
                                    </span>
                                </li>
                            </ul>
                            <div className='flex justify-between items-center mt-4 bg-base-200 p-3'>
                                <div>
                                    <span className={`font-bold ${getPaymentStatus(customer) === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                                        <FaCheckCircle className="inline mr-1" /> Status: {getPaymentStatus(customer)}
                                    </span>
                                </div>
                                <div>
                                    <button
                                        className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 hover:bg-green-600 disabled:opacity-50"
                                        onClick={() => openPaymentModal(customer)}
                                        disabled={getPaymentStatus(customer) === 'Paid'} // Disable if status is 'Paid'
                                    >
                                        Add Payment
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {/* Modals */}
            {isEditModalOpen && (
                <EditUserModal
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    customer={selectedCustomer}
                    handleUpdateCustomer={handleUpdateCustomer} // Pass the function here
                />

            )}
            {isPaymentModalOpen && (
                <AddPayment
                    isOpen={isPaymentModalOpen}
                    onClose={closePaymentModal}
                    customer={selectedCustomer}
                />
            )}
        </div>
    );
};

export default ListCustomers;
