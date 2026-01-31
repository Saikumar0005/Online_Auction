import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AuctionCard = ({ auction }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const end = new Date(auction.endTime);
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft('Ended');
                clearInterval(interval);
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [auction.endTime]);

    return (
        <div className="border rounded-lg p-4 shadow-lg bg-white relative overflow-hidden">
            {auction.status === 'LIVE' && (
                <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
                    LIVE
                </span>
            )}
            <h3 className="text-xl font-bold mb-2">{auction.title}</h3>
            <p className="text-gray-600 truncate mb-4">{auction.description}</p>
            
            <div className="flex justify-between items-center mb-4">
                <div>
                    <p className="text-sm text-gray-500">Current Price</p>
                    <p className="text-lg font-bold text-green-600">₹{auction.currentPrice}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Time Remaining</p>
                    <p className={`font-mono font-bold ${timeLeft === 'Ended' ? 'text-red-500' : 'text-blue-600'}`}>
                        {timeLeft}
                    </p>
                </div>
            </div>

            <Link 
                to={`/auction/${auction._id}`} 
                className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
                View Auction
            </Link>
        </div>
    );
};

export default AuctionCard;
