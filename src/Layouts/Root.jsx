import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import useAuth from '../hooks/useAuth';

const Root = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAuth();

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev); // Toggle sidebar visibility
    };

    return (
        <div className="flex h-screen">
            {/* Pass the isSidebarOpen state and toggleSidebar function to the Sidebar */}
            {user && <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
            <div className="flex-grow flex flex-col">
                {user && <Navbar toggleSidebar={toggleSidebar} />} {/* Pass toggleSidebar to Navbar */}
                <div className="flex-grow overflow-auto bg-gray-100">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Root;
