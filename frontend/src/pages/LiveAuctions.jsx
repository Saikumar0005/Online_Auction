import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LiveAuctions = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/auctions');
                const data = await res.json();
                // Filter locally just in case, though backend should return LIVE
                const live = data.filter(a => a.status === 'LIVE');
                setAuctions(live);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAuctions();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Live Auctions...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Live Auctions</h1>
            {auctions.length === 0 ? (
                <p>No live auctions at the moment.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auctions.map((auction) => (
                        <div key={auction._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-200">
                             {/* Image Placeholder - since we don't have images yet */}
                             <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                                {auction.imageUrl ? (
                                    <img src={`http://localhost:5000${auction.imageUrl}`} alt={auction.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl">🏷️</span>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-xl font-semibold text-gray-900 line-clamp-1">{auction.title}</h2>
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                                        LIVE
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{auction.description}</p>
                                
                                <div className="flex justify-between items-center text-sm font-medium text-gray-700 mb-4">
                                    <span>Current: ₹{auction.currentPrice || auction.startingPrice}</span>
                                    <span>{new Date(auction.endTime).toLocaleDateString()}</span>
                                </div>

                                <Link 
                                    to={`/auction/${auction._id}`} 
                                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                                >
                                    Bid Now
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LiveAuctions;
