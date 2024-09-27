import React, { useState } from 'react';
import { auth } from '../../firebase/firebase.config';
import {
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2
import useAuth from '../../hooks/useAuth';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [rememberMe, setRememberMe] = useState(false); // New state for Remember Me
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setUser } = useAuth(); // Assuming setUser updates user state

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRememberMeChange = () => {
        setRememberMe((prev) => !prev); // Toggle remember me
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        if (!email || !password) {
            setError('Please enter both email and password.');
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter both email and password.',
            });
            return;
        }

        try {
            // Set session persistence based on "Remember Me" checkbox
            await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

            // Sign in with Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user); // Update user state

            // Show success notification with SweetAlert2
            Swal.fire({
                icon: 'success',
                title: 'Login successful!',
                showConfirmButton: false,
                timer: 1500,
            });

            navigate('/');
        } catch (err) {
            setError(err.message);
            
            // Show error notification with SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message,
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-200">
            <div className="bg-white shadow-lg rounded-xl w-full max-w-sm p-10">
                <div className="cursor-pointer">
                    <div>
                        <img
                            src="https://icc-golapganj.netlify.app/assets/ICC-Logo-CgisyQxn.png"
                            alt="ICC-Logo"
                            className="w-24 mx-auto"
                        />
                    </div>
                    <h3 className="text-center text-lg font-semibold divider">ADMIN PANEL</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div>
                        <label className="label font-semibold">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="input input-bordered w-full px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* Password */}
                    <div>
                        <label className="label font-semibold">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="input input-bordered w-full px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* Remember Me Checkbox */}
                    <div className="flex items-center my-3">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={handleRememberMeChange}
                                className="mr-2"
                            />
                            <span className="label">Remember Me</span>
                        </label>
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="btn w-full text-lg font-semibold bg-green-500 hover:bg-green-600 text-white rounded-md transition-all"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
            <label className="text-sm mt-10 font-semibold">Powered by ICC Communication Golapganj POP</label>
        </div>
    );
};

export default Login;
