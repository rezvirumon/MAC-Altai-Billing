import React from 'react';
import useAuth from '../hooks/useAuth';
import { auth } from '../firebase/firebase.config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa'; // Importing an icon for editing
import MyCollections from './MyCollections';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return <p className='text-center text-gray-700'>Loading...</p>;
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (err) {
            console.error("Error signing out:", err);
        }
    };



    return (
        <div className='min-h-screen bg-gray-100 p-4 w-[90vw] max-w-7xl mx-auto'>
            <div className='bg-white shadow-lg rounded-lg p-6'>
                <div className='flex flex-col lg:flex-row items-center lg:justify-between'>
                    <div className='flex flex-col lg:flex-row items-center'>
                        {/* User Avatar */}
                        {user.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt="User Avatar"
                                className='w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 border-blue-500 shadow-lg mb-4 lg:mb-0 lg:mr-6 transition-transform transform hover:scale-110'
                            />
                        ) : (
                            <div className='w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gray-300 mr-4 flex items-center justify-center text-white text-3xl'>
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        )}
                        {/* User Details */}
                        <div className='text-center lg:text-left'>
                            <h2 className='text-2xl lg:text-3xl font-bold'>{user.name || 'No Name Provided'}</h2>
                            <p className='text-gray-600 mt-2'><strong>Email:</strong> {user.email}</p>
                            <p className='text-gray-600'><strong>Mobile:</strong> {user.mobile || 'N/A'}</p>
                            <p className='text-gray-600'><strong>Area:</strong> {user.area || 'N/A'}</p>
                            <p className='text-gray-600'><strong>Role:</strong> {user.role || 'N/A'}</p>
                            <p className='text-gray-600'><strong>Panel Charge:</strong> {user.panelCharge !== undefined ? user.panelCharge : 'N/A'}</p>
                        </div>
                    </div>

                    {/* Edit & Logout Buttons */}
                    <div className='mt-4 lg:mt-0 lg:ml-4 flex flex-col lg:flex-row lg:items-center'>
                        <button
                           
                            className="mb-2 lg:mb-0 lg:mr-4 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center transition-all"
                        >
                            <FaEdit className='mr-1' /> Edit Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* MyCollections Component */}
                <div className='mt-8'>
                    <MyCollections />
                </div>
            </div>
        </div>
    );
};

export default Profile;
