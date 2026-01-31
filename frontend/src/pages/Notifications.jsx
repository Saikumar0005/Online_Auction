import React, { useState, useEffect } from 'react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/notifications', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setNotifications(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading notifications...</div>;

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Notifications</h1>
            
            <div className="bg-white shadow rounded-lg divide-y divide-gray-100">
                {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No notifications yet.
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div 
                            key={notif.id} 
                            className={`p-4 flex justify-between items-start transition-colors ${notif.isRead ? 'bg-white' : 'bg-blue-50'}`}
                        >
                            <div className="flex-1">
                                <p className={`text-sm ${notif.isRead ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
                                    {notif.message}
                                </p>
                                <span className="text-xs text-gray-400 mt-1 block">
                                    {new Date(notif.createdAt).toLocaleString()}
                                </span>
                            </div>
                            {!notif.isRead && (
                                <button 
                                    onClick={() => markAsRead(notif.id)}
                                    className="ml-4 text-xs text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Mark as read
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
