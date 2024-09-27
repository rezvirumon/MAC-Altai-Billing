import React, { useState, useRef, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase.config'; // Adjust the import based on your config path
import { useNavigate } from 'react-router-dom';
import Search from './Search';
import { FaBars } from 'react-icons/fa'; // Import the toggle icon

const Navbar = ({ toggleSidebar }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // Create a ref for the dropdown

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login'); // Redirect to login page
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <div className="bg-gray-900 text-white flex justify-between items-center p-4 shadow-lg">
            <div className="flex items-center">
                <button onClick={toggleSidebar} className="mr-4">
                    <FaBars className="text-2xl transition-transform duration-300 hover:rotate-90" />
                </button>
                <Search />
            </div>
            <div className="relative flex items-center">
                {user ? (
                    <div className="relative">
                        <img
                            src={user.photoURL || 'https://via.placeholder.com/40'}
                            alt="Profile"
                            className="w-10 h-10 rounded-full mr-3 cursor-pointer transition-transform duration-300 hover:scale-110"
                            onClick={toggleDropdown}
                        />
                        {dropdownOpen && (
                            <div 
                                ref={dropdownRef}
                                className="absolute right-0 mt-2 w-64 sm:w-72 md:w-80 lg:w-96  bg-gray-800 shadow-xl rounded-lg z-10 p-4"
                            >
                                <div className="flex flex-col items-center text-white">
                                    <img
                                        src={user.photoURL || 'https://via.placeholder.com/150'}
                                        alt="Profile"
                                        className="rounded-full w-24 h-24 mb-2"
                                    />
                                    <h2 className="text-xl font-semibold">
                                        {user.displayName || ''}
                                        <span className="badge badge-secondary ml-2">{user.role}</span>
                                    </h2>
                                    <p className="">{user.email || 'No email provided'}</p>
                                    <div className="mt-3">
                                        <button
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                navigate('/profile');
                                            }}
                                            className="btn btn-outline text-white"
                                        >
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                handleLogout();
                                            }}
                                            className="btn btn-outline text-red-500 ml-2"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300 transform hover:scale-105"
                    >
                        Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
