import React from 'react';

const Payment = () => {
    return (
        <div className="container mx-auto p-8 text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4">Payment Gateway</h1>
            <div className="bg-white shadow-lg rounded p-6 border-t-4 border-blue-600">
                <p className="mb-6 text-gray-600">Simulating secure payment processing...</p>
                
                <div className="animate-pulse bg-gray-200 h-8 w-full mb-4 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-8 w-2/3 mx-auto mb-6 rounded"></div>

                <div className="space-y-4">
                     <button className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 font-bold">
                        Confirm Payment (Simulated)
                    </button>
                    <button className="w-full bg-red-100 text-red-600 py-3 rounded hover:bg-red-200">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Payment;
