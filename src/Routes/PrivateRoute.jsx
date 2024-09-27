import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import 'daisyui'; // Make sure DaisyUI is installed and imported

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth(); // Assuming useAuth returns a loading state as well

    // Show loader if loading is true
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-ring loading-xs"></span>
                <span className="loading loading-ring loading-sm"></span>
                <span className="loading loading-ring loading-md"></span>
                <span className="loading loading-ring loading-lg"></span>
            </div>
        );
    }

    // Navigate to login if user is not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
