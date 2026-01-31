import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Navbar from './components/Navbar';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AuctionDetails from './pages/AuctionDetails';
import CreateAuction from './pages/CreateAuction';
import History from './pages/History';
import Payment from './pages/Payment';
import LiveAuctions from './pages/LiveAuctions';
import MyAuctions from './pages/MyAuctions';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import ManageAuctions from './pages/ManageAuctions';
import ManageUsers from './pages/ManageUsers';
import ManageBids from './pages/ManageBids';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminPayments from './pages/AdminPayments';
import AuthContext from './context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div>Loading...</div>;
    return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  const { user, logout } = useContext(AuthContext); // Access context here to pass to Header

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Header user={user} unreadNotifications={2} onLogout={logout} />
        <main className="py-6">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auction/:id" element={<AuctionDetails />} />
                <Route path="/live" element={<LiveAuctions />} />
                <Route path="/my-auctions" element={
                    <PrivateRoute>
                        <MyAuctions user={user} />
                    </PrivateRoute>
                } />
                <Route path="/notifications" element={
                    <PrivateRoute>
                        <Notifications />
                    </PrivateRoute>
                } />
                <Route path="/profile" element={
                    <PrivateRoute>
                         <Profile user={user} />
                    </PrivateRoute>
                } />
                <Route path="/settings" element={
                    <PrivateRoute>
                        <Settings />
                    </PrivateRoute>
                } />
                <Route path="/payment" element={<Payment />} />
                
                <Route path="/create-auction" element={
                    <AdminRoute>
                        <CreateAuction />
                    </AdminRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/auctions" element={<AdminRoute><ManageAuctions /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
                <Route path="/admin/bids" element={<AdminRoute><ManageBids /></AdminRoute>} />
                <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
                <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />

                <Route path="/history" element={
                    <PrivateRoute>
                        <History />
                    </PrivateRoute>
                } />
            </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
