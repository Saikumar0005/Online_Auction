import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminAnalytics = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/auctions/analytics/stats');
                setStats(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div className="p-8">Loading Analytics...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Analytics</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                    <p className="text-gray-500">Average Bid Value</p>
                    <h2 className="text-3xl font-bold text-gray-900">₹{parseFloat(stats.averageBidValue).toFixed(2)}</h2>
                </div>
                 <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
                    <p className="text-gray-500">Total Auctions</p>
                    <h2 className="text-3xl font-bold text-gray-900">{stats.totalAuctions}</h2>
                </div>
                {/* Placeholder for now */}
                <div className="bg-white p-6 rounded shadow border-l-4 border-purple-500">
                    <p className="text-gray-500">System Uptime</p>
                    <h2 className="text-3xl font-bold text-gray-900">99.9%</h2>
                </div>
            </div>

            <div className="bg-white rounded shadow p-6">
                <h3 className="text-xl font-bold mb-4">Top Bidders</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2">User ID</th>
                                <th className="py-2">Total Bids</th>
                                <th className="py-2">Max Bid</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.topBidders && stats.topBidders.map((b, i) => (
                                <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="py-3">{b.userId}</td>
                                    <td className="py-3 font-semibold">{b.totalBids}</td>
                                    <td className="py-3 text-green-600">₹{b.maxBid}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
