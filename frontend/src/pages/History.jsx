import React, { useEffect, useState } from 'react';
import api from '../services/api';

const History = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/auctions/analytics/stats');
                setStats(data);
            } catch (error) {
                console.error("Fetch stats error", error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div className="text-center mt-10">Loading Analytics...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Auction History & Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-500 text-white p-6 rounded shadow">
                    <h3 className="text-xl">Total Auctions</h3>
                    <p className="text-4xl font-bold">{stats.totalAuctions}</p>
                </div>
                <div className="bg-green-500 text-white p-6 rounded shadow">
                    <h3 className="text-xl">Average Bid Value</h3>
                    <p className="text-4xl font-bold">₹{stats.averageBidValue.toFixed(2)}</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Top Bidders</h2>
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4">Rank</th>
                            <th className="p-4">User</th>
                            <th className="p-4">Total Bids</th>
                            <th className="p-4">Max Bid</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.topBidders.map((bidder, idx) => (
                            <tr key={idx} className="border-b">
                                <td className="p-4 font-bold text-gray-500">#{idx + 1}</td>
                                <td className="p-4">{bidder.name}</td>
                                <td className="p-4">{bidder.totalBids}</td>
                                <td className="p-4 text-green-600 font-bold">₹{bidder.maxBid}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default History;
