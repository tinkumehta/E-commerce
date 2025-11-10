import React,{useState, useContext} from "react";
import {AuthContext} from '../../context/AuthContext'

function Profile() {
    const { user } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // In a real app, you would save the changes to your backend here
        console.log("Saving changes:", editedUser);
        setIsEditing(false);
        // Update user context if needed
    };

    const handleCancel = () => {
        setEditedUser({ ...user });
        setIsEditing(false);
    };

    const handleChange = (field, value) => {
        setEditedUser(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
    };

    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'moderator':
                return 'bg-blue-100 text-blue-800';
            case 'premium':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-green-100 text-green-800';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
                    <p className="text-gray-600 text-lg">Manage your account information and preferences</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Profile Header with Gradient */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white relative">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* User Avatar */}
                            <div className="relative">
                                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold border-4 border-white border-opacity-30 shadow-lg">
                                    {user.avatar ? (
                                        <img 
                                            src={user.avatar} 
                                            alt={user.name} 
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span>{getInitials(user.name)}</span>
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300">
                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-2xl font-bold mb-2">{user.name || 'User'}</h2>
                                <p className="text-blue-100 opacity-90 mb-3">{user.email}</p>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                                        {user.role || 'User'}
                                    </span>
                                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                                        Member since {new Date().getFullYear()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <div className="absolute top-6 right-6">
                            {!isEditing ? (
                                <button 
                                    onClick={handleEdit}
                                    className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handleSave}
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md"
                                    >
                                        Save
                                    </button>
                                    <button 
                                        onClick={handleCancel}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Personal Information */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Personal Information
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedUser.name || ''}
                                                onChange={(e) => handleChange('name', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            />
                                        ) : (
                                            <p className="text-gray-800 font-medium">{user.name || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editedUser.email || ''}
                                                onChange={(e) => handleChange('email', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            />
                                        ) : (
                                            <p className="text-gray-800 font-medium">{user.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedUser.username || ''}
                                                onChange={(e) => handleChange('username', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            />
                                        ) : (
                                            <p className="text-gray-800 font-medium">@{user.username || 'username'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Account Details */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Account Details
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Account Role</label>
                                        <p className="text-gray-800 font-medium">
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                                                {user.role || 'User'}
                                            </span>
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Member Since</label>
                                        <p className="text-gray-800 font-medium">
                                            {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Account Status</label>
                                        <p className="text-green-600 font-medium flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            Active
                                        </p>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="pt-4 border-t border-gray-200">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-300 text-sm font-medium">
                                            Change Password
                                        </button>
                                        <button className="bg-purple-50 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors duration-300 text-sm font-medium">
                                            Privacy Settings
                                        </button>
                                        <button className="bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors duration-300 text-sm font-medium">
                                            Notification
                                        </button>
                                        <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors duration-300 text-sm font-medium">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">12</h3>
                        <p className="text-gray-600">Total Orders</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">8</h3>
                        <p className="text-gray-600">Wishlist Items</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976-2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">24</h3>
                        <p className="text-gray-600">Reviews Given</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile