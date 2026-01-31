import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold flex items-center">
                   <span className="bg-white text-blue-600 px-2 py-1 rounded mr-2 text-sm">BW</span>
                   Bid & Win
                </Link>
                <div className="space-x-4">
                    <Link to="/" className="hover:text-blue-200">Home</Link>
                    {user ? (
                        <>
                            {user.role === 'admin' && <Link to="/create-auction" className="hover:text-blue-200">Create Auction</Link>}
                            <Link to="/history" className="hover:text-blue-200">History</Link>
                            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-blue-200">Login</Link>
                            <Link to="/register" className="hover:text-blue-200">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
