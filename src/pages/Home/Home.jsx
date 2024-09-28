import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    FaUsers, FaMoneyBillWave, FaCalendarDay, FaRegMoneyBillAlt,
    FaUserCheck, FaUserAlt, FaCheckCircle, FaExclamationCircle, FaPlusCircle, FaHourglassHalf, FaFlagCheckered
} from 'react-icons/fa';
import InactiveCustomers from './InactiveCustomers';
import RecentPayment from './RecentPayment';
import UpCommingExpired from './UpCommingExpired';
import Charts from './Charts';
import DateAndTime from '../../components/DateAndTime';

const Home = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalCollections, setTotalCollections] = useState(0);
    const [todayCollections, setTodayCollections] = useState(0);
    const [totalDue, setTotalDue] = useState(0);
    const [activeCustomers, setActiveCustomers] = useState(0);
    const [inactiveCustomers, setInactiveCustomers] = useState(0);
    const [averagePayment, setAveragePayment] = useState(0);
    const [paidCount, setPaidCount] = useState(0);
    const [unpaidCount, setUnpaidCount] = useState(0);
    const [newCustomers, setNewCustomers] = useState(0);
    const [upcomingExpirations, setUpcomingExpirations] = useState(0);
  
    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true); // Start loading
            try {
                const response = await axios.get('https://billing-manager-server.vercel.app/api/customers');
                const data = response.data;
                setCustomers(data);
                setTotalCustomers(data.length);
                calculateFinancialStats(data);
                calculateCustomerStats(data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchCustomers();
    }, []);

    const calculateFinancialStats = (customers) => {
        let totalCollections = 0;
        let totalDue = 0;
        let todayCollections = 0;

        const today = new Date().toISOString().split('T')[0];

        customers.forEach(customer => {
            totalCollections += customer.payAmount;
            totalDue += customer.dueAmount;

            customer.paymentHistory.forEach(payment => {
                const paymentDate = new Date(payment.payDate).toISOString().split('T')[0];
                if (paymentDate === today) {
                    todayCollections += payment.amount;
                }
            });
        });

        setTotalCollections(totalCollections);
        setTotalDue(totalDue);
        setTodayCollections(todayCollections);
    };

    const calculateCustomerStats = (customers) => {
        let activeCount = 0;
        let inactiveCount = 0;
        let paidCount = 0;
        let unpaidCount = 0;
        let newCustomers = 0;
        let upcomingExpirations = 0;

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();

        customers.forEach(customer => {
            if (customer.status === "Active") {
                activeCount++;
            } else {
                inactiveCount++;
            }

            // Paid and Unpaid Count
            if (customer.dueAmount === 0) {
                paidCount++;
            } else {
                unpaidCount++;
            }

            // New Customers This Month
            const connectionDate = new Date(customer.connectionDate);
            if (connectionDate.getMonth() === currentMonth) {
                newCustomers++;
            }

            // Upcoming Expirations (less than 7 days)
            if (customer.remainingDays <= 7 && customer.remainingDays > 0) {
                upcomingExpirations++;
            }
        });

        setActiveCustomers(activeCount);
        setInactiveCustomers(inactiveCount);
        setPaidCount(paidCount);
        setUnpaidCount(unpaidCount);
        setNewCustomers(newCustomers);
        setUpcomingExpirations(upcomingExpirations);

        // Calculate average payment
        const totalPayments = customers.reduce((acc, customer) => acc + customer.payAmount, 0);
        setAveragePayment(totalPayments / customers.length || 0);
    };

    return (
        <div className='flex flex-col min-h-screen p-6 container mx-auto lg:w-full w-[97vw]'>
                <h3 className='text-2xl font-bold mb-5'>Dashboard</h3>
                <div>
                    <DateAndTime></DateAndTime>
                </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-5 gap-6 w-full'>
                {[{
                    label: 'Total Customers', value: totalCustomers, icon: <FaUsers className="text-white text-5xl" />, color: 'from-blue-500 to-blue-700'
                }, {
                    label: 'Collections This Month', value: totalCollections, icon: <FaMoneyBillWave className="text-white text-5xl" />, color: 'from-green-500 to-green-700'
                }, {
                    label: 'Today\'s Collections', value: todayCollections, icon: <FaCalendarDay className="text-white text-5xl" />, color: 'from-yellow-500 to-yellow-700'
                }, {
                    label: 'Total Due', value: totalDue, icon: <FaRegMoneyBillAlt className="text-white text-5xl" />, color: 'from-red-500 to-red-700'
                }, {
                    label: 'Active Customers', value: activeCustomers, icon: <FaUserCheck className="text-white text-5xl" />, color: 'from-green-500 to-green-700'
                }, {
                    label: 'Inactive Customers', value: inactiveCustomers, icon: <FaUserAlt className="text-white text-5xl" />, color: 'from-red-500 to-red-700'
                }, {
                    label: 'Paid Count', value: paidCount, icon: <FaCheckCircle className="text-white text-5xl" />, color: 'from-blue-400 to-blue-600'
                }, {
                    label: 'Unpaid Count', value: unpaidCount, icon: <FaExclamationCircle className="text-white text-5xl" />, color: 'from-red-400 to-red-600'
                }, {
                    label: 'New Customers', value: newCustomers, icon: <FaPlusCircle className="text-white text-5xl" />, color: 'from-green-400 to-green-600'
                }, {
                    label: 'Upcoming Expirations', value: upcomingExpirations, icon: <FaHourglassHalf className="text-white text-5xl" />, color: 'from-orange-400 to-orange-600'
                }, {
                    label: 'Average Payment', value: averagePayment.toFixed(2), icon: <FaFlagCheckered className="text-white text-5xl" />, color: 'from-orange-500 to-orange-700'
                }].map((stat, index) => (
                    <div key={index} className={`bg-gradient-to-r ${stat.color} text-white p-6 rounded-lg shadow-lg`}>
                        <div className="flex items-center justify-between">
                            <div>
                                {loading ? (
                                    <div className="animate-pulse">
                                        <div className="h-6 bg-gray-300 rounded-md w-20 mb-2"></div>
                                        <div className="h-4 bg-gray-300 rounded-md w-32"></div>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-bold">{stat.value}</h2>
                                        <p className="text-white text-lg">{stat.label}</p>
                                    </>
                                )}
                            </div>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Include additional components */}
            {!loading && (
                <>
                    <InactiveCustomers />
                    <RecentPayment />
                    <UpCommingExpired />
                    <Charts />
                </>
            )}
        </div>
    );
};

export default Home;
