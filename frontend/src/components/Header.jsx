import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import './Header.css';

/**
 * Header Component
 * Accessible, responsive navigation bar.
 * 
 * Props:
 * @param {object} user - User object { name, email, avatarUrl }
 * @param {number} unreadNotifications - Count of unread notifications
 * @param {function} onLogout - Handler for logout action
 */
const Header = ({ user, unreadNotifications = 0, onLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close dropdowns on ESC key
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setIsProfileOpen(false);
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

    const handleLogout = () => {
        if (onLogout) onLogout();
        // Fallback internal logout if prop not provided
        navigate('/login');
    };

    // Navigation Items Data
    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Live Auctions', path: '/live' },
        { label: 'My Auctions', path: '/my-auctions' },
        { label: 'History', path: '/history' },
        { label: 'Notifications', path: '/notifications' },
    ];

    const adminNavItems = [
        { label: 'Dashboard', path: '/admin/dashboard' },
        { label: 'Manage Auctions', path: '/admin/auctions' },
        { label: 'Users', path: '/admin/users' },
        { label: 'Bids', path: '/admin/bids' },
        { label: 'Analytics', path: '/admin/analytics' },
        { label: 'Payments', path: '/admin/payments' },
    ];

    const isUserAdmin = user?.role === 'admin';
    const currentNavItems = isUserAdmin ? adminNavItems : navItems;

    return (
        <header className={`header-container ${isUserAdmin ? 'admin-header' : ''}`}>
            {/* Left: Branding */}
            <Link to={isUserAdmin ? "/admin/dashboard" : "/"} className="header-brand" aria-label="Bid & Win Home">
                <div className="brand-logo" aria-hidden="true">BW</div>
                <span>Bid & Win</span>
                {isUserAdmin && <span className="admin-badge">Admin Panel</span>}
            </Link>

            {/* Mobile Menu Button */}
            <button 
                className="hamburger-btn"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                onClick={toggleMobileMenu}
            >
                {isMobileMenuOpen ? '✕' : '☰'}
            </button>

            {/* Center: Navigation */}
            <nav 
                className={`nav-desktop ${isMobileMenuOpen ? 'mobile-open' : ''}`} 
                aria-label="Main navigation"
            >
                <ul className="nav-list" role="menubar">
                    {currentNavItems.map((item) => (
                        <li key={item.path} role="none">
                            <NavLink 
                                to={item.path}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                role="menuitem"
                            >
                                {item.label}
                                {(item.label === 'Notifications' && unreadNotifications > 0) && (
                                    <span className="badge">{unreadNotifications}</span>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Right: User Actions */}
            <div className="user-actions">
                {/* Notifications Icon (Desktop) */}
                <button className="notification-btn" aria-label="Notifications">
                    <span aria-hidden="true">🔔</span>
                    {unreadNotifications > 0 && <span className="badge">{unreadNotifications}</span>}
                </button>

                {/* Profile Dropdown */}
                {user ? (
                    <div className="profile-container" ref={profileRef}>
                        <button 
                            className="profile-btn"
                            aria-haspopup="true"
                            aria-expanded={isProfileOpen}
                            onClick={toggleProfile}
                        >
                            <div className="avatar">
                                {user.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={`${user.name}'s avatar`} />
                                ) : (
                                    <span className="avatar-placeholder">{user.name?.charAt(0) || 'U'}</span>
                                )}
                            </div>
                            <span className="profile-username">{user.name}</span>
                            <span aria-hidden="true">▼</span>
                        </button>

                        <div 
                            className={`dropdown-menu ${isProfileOpen ? 'open' : ''}`}
                            role="menu"
                            aria-label="User menu"
                        >
                            <Link to="/profile" className="dropdown-item" role="menuitem" onClick={() => setIsProfileOpen(false)}>
                                Profile
                            </Link>
                             <Link to="/settings" className="dropdown-item" role="menuitem" onClick={() => setIsProfileOpen(false)}>
                                Settings
                            </Link>
                            <div className="dropdown-divider"></div>
                            <button 
                                className="dropdown-item" 
                                role="menuitem"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="nav-list">
                         <Link to="/login" className="nav-link">Login</Link>
                         <Link to="/register" className="nav-link active" style={{color: 'white', backgroundColor: 'var(--header-primary)'}}>Join</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
