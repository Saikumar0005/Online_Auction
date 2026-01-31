import React from 'react';

const Profile = ({ user }) => {
    if (!user) return <div className="p-8 text-center">Please login to view profile.</div>;

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
                
                <div className="px-6 py-4 relative">
                    <div className="absolute -top-12 left-6">
                         <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                            {user.name?.charAt(0) || 'U'}
                         </div>
                    </div>
                    
                    <div className="mt-14">
                        <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                        <p className="text-gray-600">{user.email}</p>
                        <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase tracking-wide font-semibold">
                            {user.role}
                        </span>
                    </div>

                    <div className="mt-8 border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-semibold mb-4">Account Details</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">User ID</span>
                                <span className="font-mono text-gray-800">{user.id}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-gray-600">Member Since</span>
                                <span className="text-gray-800">{new Date().toLocaleDateString()}</span> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
