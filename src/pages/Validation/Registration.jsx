import React, { useState } from 'react';
import { auth, db } from '../../firebase/firebase.config';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        mobile: '',
        area: '',
        role: '',
        panelCharge: '',
        photoURL: '',
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setError(null); // Reset error on change
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password, name, mobile, area, role, panelCharge, photoURL } = formData;

        try {
            setLoading(true);

            // Check if the email is already in use
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            if (signInMethods.length > 0) {
                throw new Error('Email is already in use. Please try a different email.');
            }

            // Create user with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user data in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name,
                mobile,
                area,
                role: role || 'user',
                panelCharge: panelCharge ? parseFloat(panelCharge) : 0,
                photoURL,
                createdAt: new Date(),
            });

            // Send user data to backend (MongoDB)
            const response = await fetch('https://billing-manager-server.vercel.app/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    name,
                    mobile,
                    area,
                    role: role || 'user',
                    panelCharge: panelCharge ? parseFloat(panelCharge) : 0,
                    photoURL,
                }),
            });

            if (response.ok) {
                navigate('/');
            } else {
                const errorResponse = await response.json();
                throw new Error(errorResponse.error || 'Failed to create user in the backend');
            }
        } catch (err) {
            console.error('Registration Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex flex-col justify-center items-center bg-gray-100'>
            <h3 className='text-3xl font-bold text-center mb-8'>Add A New User</h3>
            <div className='bg-white shadow-lg rounded-lg w-full max-w-4xl p-8'>
                <form className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="col-span-1">
                        <label className="label font-semibold">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter Email Address"
                            className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* Password */}
                    <div className="col-span-1">
                        <label className="label font-semibold">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="New Password"
                            className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* Operator's Name */}
                    <div className="col-span-1">
                        <label className="label font-semibold">Operator's Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter operator's name"
                            className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* Mobile Number */}
                    <div className="col-span-1">
                        <label className="label font-semibold">Mobile Number</label>
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="Enter mobile number"
                            className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* Area */}
                    <div className="col-span-1">
                        <label className="label font-semibold">Area</label>
                        <input
                            type="text"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            placeholder="Enter area"
                            className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* User Role */}
                    <div className="col-span-1">
                        <label className="label font-semibold">User Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="select select-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                    {/* Panel Charge */}
                    <div className="col-span-1">
                        <label className="label font-semibold">Panel Charge</label>
                        <input
                            type="number"
                            name="panelCharge"
                            value={formData.panelCharge}
                            onChange={handleChange}
                            placeholder="Enter panel charge"
                            className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* Photo URL */}
                    <div className="col-span-1">
                        <label className="label font-semibold">Photo URL</label>
                        <input
                            type="url"
                            name="photoURL"
                            value={formData.photoURL}
                            onChange={handleChange}
                            placeholder="Enter photo URL"
                            className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Submit Button */}
                    <div className="col-span-full">
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <button
                            type="submit"
                            className={`btn btn-primary w-full py-3 mt-4 text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Registration;
