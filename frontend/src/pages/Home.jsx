import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AuctionCard from '../components/AuctionCard';

const Home = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const { data } = await api.get('/auctions');
                // Filter only LIVE auctions for the main view or separate them
                setAuctions(data);
            } catch (error) {
                console.error("Failed to fetch auctions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading Auctions...</div>;

    const liveAuctions = auctions.filter(a => a.status === 'LIVE');
    const endedAuctions = auctions.filter(a => a.status !== 'LIVE');

    return (
        <div className="container mx-auto p-4">
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4 border-b pb-2">Live Auctions <span className="text-red-500 text-sm align-middle">● Live</span></h2>
                {liveAuctions.length === 0 ? (
                    <p className="text-gray-500">No live auctions at the moment.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {liveAuctions.map(auction => (
                            <AuctionCard key={auction._id} auction={auction} />
                        ))}
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-700">Recent Auctions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                    {endedAuctions.slice(0, 6).map(auction => (
                        <AuctionCard key={auction._id} auction={auction} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
