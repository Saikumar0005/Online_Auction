import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MyAuctions = ({ user }) => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyAuctions = async () => {
            try {
                // Need auth token
                const token = localStorage.getItem('token'); // Assuming stored here
                const res = await fetch('http://localhost:5000/api/auctions/my-auctions', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAuctions(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyAuctions();
    }, []);

    if (loading) return <div className="p-8 text-center animate-pulse">Loading your auctions...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">My Auctions</h1>
            <p className="text-gray-600 mb-6">Auctions you have participated in or created.</p>
            
            {auctions.length === 0 ? (
                <div className="bg-yellow-50 p-6 rounded-lg text-center border border-yellow-200">
                    <p className="text-gray-700 mb-4">You haven't joined any auctions yet.</p>
                    <Link to="/live" className="text-blue-600 hover:underline font-semibold">Browse Live Auctions</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auctions.map((auction) => (
                        <div key={auction._id} className="bg-white rounded-lg shadow border border-gray-200 relative overflow-hidden">
                             <div className={`p-1 absolute top-2 right-2 rounded text-xs px-2 font-bold z-10 ${
                                 auction.status === 'LIVE' ? 'bg-green-100 text-green-800' : 
                                 auction.status === 'CLOSED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                             }`}>
                                 {auction.status}
                             </div>
                             <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                                {auction.imageUrl ? (
                                    <img src={`http://localhost:5000${auction.imageUrl}`} alt={auction.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl">🏷️</span>
                                )}
                            </div>
                            <div className="p-5 mt-0">
                                <h2 className="text-xl font-bold mb-2 text-gray-900">{auction.title}</h2>
                                <p className="text-gray-500 text-sm mb-4">
                                    Start Price: <span className="font-medium text-gray-800">₹{auction.startingPrice}</span>
                                </p>
                                <Link 
                                    to={`/auction/${auction._id}`} 
                                    className="block w-full text-center border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-2 rounded transition-all"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAuctions;
