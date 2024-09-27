import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBars, FaUsers, FaUserClock, FaUserPlus, FaTimes } from 'react-icons/fa';
import { PiIdentificationBadgeFill } from 'react-icons/pi';
import { FaUsersGear } from 'react-icons/fa6';
import { Tooltip } from 'react-tooltip'; // Update the import statement
import useAuth from '../hooks/useAuth';
import Search from './Search';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuth();

    const links = [
        { path: '/', label: 'Home', icon: <FaHome /> },
        { path: '/profile', label: 'My Profile', icon: <PiIdentificationBadgeFill /> },
        { path: '/add-customers', label: 'Add New Customers', icon: <FaUserPlus /> },
        { path: '/list-customers', label: 'Customers List', icon: <FaUserClock /> }
    ];

    const userLinks = [
        { path: '/add-user', label: 'Add Panel User', icon: <FaUsersGear /> },
        { path: '/all-users', label: 'Panel Users', icon: <FaUsers /> },
    ];

    // Handle responsiveness
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    return (
        <>
            <div
                className={`bg-gray-800 text-white min-h-screen flex flex-col
                ${isMobile ? `absolute z-20 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}` : 'relative'}
                ${isSidebarOpen ? 'w-64' : 'w-16'}
                transition-all duration-300 ease-in-out`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4">
                    <div className={`text-2xl font-bold transition-opacity duration-300 h-24 ${isSidebarOpen ? 'opacity-100' : 'flex items-center justify-center'}`}>
                        <img
                            src={user.photoURL} alt=""
                            className='h-24 object-cover'
                        />
                    </div>

                    <button
                        onClick={toggleSidebar}
                        className="text-2xl transition-transform duration-300 hover:rotate-90 border-2 border-transparent bg-gradient-to-r rounded-full from-red-500 to-red-500 bg-clip-border hover:bg-gradient-to-l"
                    >
                        {isSidebarOpen ? <FaTimes /> : <FaBars className='hidden' />}
                    </button>
                </div>

                <div className={`outline-0 p-2 ${isSidebarOpen ? 'opacity-100' : 'hidden'}`}>
                    <Search />
                </div>

                {/* Sidebar Links */}
                <nav className="flex-grow">
                    <ul className="space-y-2">
                        {links.map(link => (
                            <li key={link.path} className="relative group">
                                <Link
                                    to={link.path}
                                    className={`flex items-center p-3 transition duration-200 
                                    ${location.pathname === link.path ? 'bg-gray-700' : 'hover:bg-gray-600'}`}
                                    data-tip={link.label}
                                    data-for={link.label}
                                >
                                    <span className="mr-3 text-xl">{link.icon}</span>
                                    <span className={`whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 overflow-hidden'}`}>
                                        {link.label}
                                    </span>
                                </Link>
                                <Tooltip id={link.label} place="right" effect="solid" />
                            </li>
                        ))}
                        
                        {/* Dropdown for user management */}
                        <li className="relative group">
                            <button 
                                onClick={toggleDropdown}
                                className={`flex items-center p-3 w-full transition duration-200 
                                ${isDropdownOpen ? 'bg-gray-700' : 'hover:bg-gray-600'}`}
                            >
                                <span className="mr-3 text-xl"><FaUsers /></span>
                                <span className={`whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 overflow-hidden'}`}>
                                    User Management
                                </span>
                            </button>
                            {isDropdownOpen && (
                                <ul className={`ml-3 space-y-2`}>
                                    {userLinks.map(link => (
                                        <li key={link.path}>
                                            <Link
                                                to={link.path}
                                                className={`flex items-center p-3 transition duration-200 
                                                ${location.pathname === link.path ? 'bg-gray-700' : 'hover:bg-gray-600'}`}
                                                data-tip={link.label}
                                                data-for={link.label}
                                            >
                                                <span className="mr-3 text-xl">{link.icon}</span>
                                                <span className={`whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 overflow-hidden'}`}>
                                                    {link.label}
                                                </span>
                                            </Link>
                                            <Tooltip id={link.label} place="right" effect="solid" />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Mobile Overlay */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
};

export default Sidebar;
