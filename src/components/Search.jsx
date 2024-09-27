import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Search = () => {
    const [query, setQuery] = useState(''); // State for the search query
    const [results, setResults] = useState([]); // State for search results
    const [error, setError] = useState(null); // State for error handling
    const [isOpen, setIsOpen] = useState(false); // State for results dropdown visibility
    const resultsRef = useRef(null); // Ref to the results container

    // Fetch customers whenever the query changes and is not empty
    useEffect(() => {
        const fetchCustomers = async () => {
            if (!query) {
                setResults([]); // Clear results if query is empty
                setIsOpen(false); // Close results dropdown
                return;
            }

            setError(null); // Clear any previous errors
            setResults([]); // Clear previous results before fetching new data

            try {
                const response = await axios.get(`http://localhost:5000/api/customers/search?query=${query}`);
                setResults(response.data); // Set the results in state
                setIsOpen(true); // Open the results dropdown
            } catch (err) {
                console.error(err);
                setError('Failed to fetch customers'); // Set error message
            }
        };

        const timeoutId = setTimeout(fetchCustomers, 300); // Add a debounce effect

        return () => clearTimeout(timeoutId); // Cleanup timeout on unmount
    }, [query]);

    // Close the results dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (resultsRef.current && !resultsRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [resultsRef]);

    return (
        <div className="relative text-black"> {/* Use relative positioning for the results */}
            <form className="flex items-center">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)} // Update query state on input change
                    placeholder="Search by MAC address or email"
                    className="input input-bordered input-success w-full max-w-xs" // Make the input take up available space
                />
            </form>

            {error && <p className="text-red-500">{error}</p>} {/* Display error message */}

            {isOpen && ( // Only render the results when isOpen is true
                <ul ref={resultsRef} className="absolute z-50 mt-4 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {results.length > 0 ? (
                        results.map((customer) => (
                            <li key={customer._id} className="border-b py-2 px-4 hover:bg-gray-100 cursor-pointer">
                                <Link
                                    to='/customer-details'
                                    state={{ customer }} // Pass the selected customer data
                                    className="block w-full text-left text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setIsOpen(false)} // Close dropdown on click
                                >
                                    <span className="font-bold">{customer.fullName}</span> - {customer.macAddress} - {customer.email}
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className="py-2 px-4 text-gray-500">No results found.</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Search;
