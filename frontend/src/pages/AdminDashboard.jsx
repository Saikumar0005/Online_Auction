import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAuctions: 0,
        liveAuctions: 0,
        endedAuctions: 0,
        totalBids: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch Auctions Stats
                const auctionStatsRes = await api.get('/auctions/analytics/stats');
                const auctionData = auctionStatsRes.data;

                // Fetch Users to count
                const usersRes = await api.get('/auth/users');
                
                // Fetch Bids to count (or use what we have)
                const bidsRes = await api.get('/bids/admin/all');

                setStats({
                    totalUsers: usersRes.data.length,
                    totalAuctions: auctionData.totalAuctions,
                    liveAuctions: '?', // Analytics endpoint might not split this, need to improve or manual calc
                    endedAuctions: '?',
                    totalBids: bidsRes.data.length,
                    // Note: Ideally backend should provide a single dashboard-stats endpoint
                });
                
                // Manual calc for Live/Ended from auction list if needed, or rely on existing stats
                // For now, let's fetch all auctions to be precise
                const allAuctionsRes = await api.get('/auctions');
                const allAuctions = allAuctionsRes.data;
                const live = allAuctions.filter(a => a.status === 'LIVE').length;
                
                setStats(prev => ({
                    ...prev,
                    liveAuctions: live,
                    endedAuctions: allAuctions.length - live
                }));

            } catch (error) {
                console.error("Dashboard Stats Error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DashboardCard title="Total Users" value={stats.totalUsers} icon="👥" color="bg-blue-500" />
                <DashboardCard title="Total Auctions" value={stats.totalAuctions} icon="📦" color="bg-purple-500" />
                <DashboardCard title="Live Auctions" value={stats.liveAuctions} icon="🟢" color="bg-green-500" />
                <DashboardCard title="Total Bids" value={stats.totalBids} icon="🔨" color="bg-yellow-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                         <a href="/admin/auctions" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 text-blue-600 font-medium">Manage Auctions &rarr;</a>
                         <a href="/admin/users" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 text-blue-600 font-medium">View Users &rarr;</a>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-4">System Status</h3>
                    <div className="flex items-center text-green-600">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        System Operational
                    </div>
                    <p className="mt-2 text-gray-500 text-sm">Last updated: {new Date().toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

const DashboardCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        <div className="p-5 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm uppercase tracking-wide font-semibold">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${color}`}>
                {icon}
            </div>
        </div>
    </div>
);

export default AdminDashboard;
