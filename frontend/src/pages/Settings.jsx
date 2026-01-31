import React from 'react';

const Settings = () => {
    return (
        <div className="container mx-auto p-4 max-w-xl">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="bg-white shadow rounded-lg p-6">
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Display Name</label>
                        <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your name" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Change Password</label>
                        <input type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="New Password" />
                    </div>
                    <div className="mb-6">
                        <label className="flex items-center">
                            <input type="checkbox" className="form-checkbox text-blue-600" checked onChange={() => {}} />
                            <span className="ml-2 text-gray-700">Receive Email Notifications</span>
                        </label>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
