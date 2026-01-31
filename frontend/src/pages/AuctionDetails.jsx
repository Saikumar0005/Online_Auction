import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const AuctionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [auction, setAuction] = useState(null);
    const [bids, setBids] = useState([]);
    const [bidAmount, setBidAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchAuctionData = async () => {
        try {
            const auctionRes = await api.get(`/auctions/${id}`);
            setAuction(auctionRes.data);
            
            const bidRes = await api.get(`/bids/${id}`);
            setBids(bidRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchAuctionData();
        const interval = setInterval(fetchAuctionData, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [id]);

    const handleBid = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await api.post('/bids', { auctionId: id, amount: Number(bidAmount) });
            setSuccess('Bid placed successfully!');
            setBidAmount('');
            fetchAuctionData(); // Immediate update
        } catch (err) {
            setError(err.response?.data?.message || 'Bid failed');
        }
    };

    if (!auction) return <div className="text-center mt-10">Loading...</div>;

    const isEnded = auction.status !== 'LIVE' || new Date(auction.endTime) < new Date();

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="bg-white rounded shadow-lg p-6 mb-6">
                {auction.imageUrl && (
                    <div className="w-full h-80 mb-6 rounded-lg overflow-hidden bg-gray-100">
                        <img src={`http://localhost:5000${auction.imageUrl}`} alt={auction.title} className="w-full h-full object-contain" />
                    </div>
                )}

                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold">{auction.title}</h1>
                    {isEnded ? (
                         <span className="bg-gray-500 text-white px-3 py-1 rounded font-bold">ENDED</span>
                    ) : (
                         <span className="bg-red-600 text-white px-3 py-1 rounded font-bold animate-pulse">LIVE</span>
                    )}
                </div>
                
                <p className="text-gray-700 text-lg mb-6">{auction.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="bg-gray-50 p-4 rounded mb-4">
                            <p className="text-sm text-gray-500">Current Price</p>
                            <p className="text-3xl font-bold text-green-600">₹{auction.currentPrice}</p>
                        </div>
                        <div className="mb-4">
                             <p className="text-sm text-gray-500">Starting Price: ₹{auction.startingPrice}</p>
                             <p className="text-sm text-gray-500">Ends At: {new Date(auction.endTime).toLocaleString()}</p>
                        </div>

                        {auction.winner && (
                            <div className="bg-yellow-100 border border-yellow-300 p-4 rounded mb-4 text-center">
                                <h3 className="font-bold text-yellow-800 text-xl">🏆 Winner Declared</h3>
                                <p className="text-yellow-700">{auction.winner.name}</p>
                                {user && user._id === auction.winner._id && (
                                     <button 
                                        onClick={() => navigate('/payment')}
                                        className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                     >
                                        Proceed to Payment
                                     </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        {!isEnded && user && (
                            <form onSubmit={handleBid} className="bg-blue-50 p-4 rounded mb-6">
                                <h3 className="font-bold mb-2">Place Your Bid</h3>
                                {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
                                {success && <p className="text-green-600 text-sm mb-2">{success}</p>}
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        className="flex-1 border p-2 rounded"
                                        placeholder={`Min ₹${auction.currentPrice + 1}`}
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                        Bid
                                    </button>
                                </div>
                            </form>
                        )}

                        <h3 className="font-bold text-lg mb-2">Recent Bids</h3>
                        <div className="overflow-y-auto max-h-64 border rounded">
                            {bids.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-100 sticky top-0">
                                        <tr>
                                            <th className="p-2 text-sm">Bidder</th>
                                            <th className="p-2 text-sm">Amount</th>
                                            <th className="p-2 text-sm">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bids.map((bid, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="p-2">{bid.userId.name}</td>
                                                <td className="p-2 font-bold">₹{bid.amount}</td>
                                                <td className="p-2 text-xs text-gray-500">{new Date(bid.timestamp).toLocaleTimeString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="p-4 text-gray-500 text-center">No bids yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionDetails;
