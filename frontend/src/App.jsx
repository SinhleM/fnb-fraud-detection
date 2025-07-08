// frontend/src/App.jsx
import React, { useState } from 'react';
import Home from './pages/Home';
import UserDetailPage from './pages/UserDetailPage'; // New import for the full page detail view

const App = () => {
    // State to manage the current page view: 'home' or 'userDetail'
    const [currentPage, setCurrentPage] = useState('home');
    // State to hold the data for the selected user when navigating to UserDetailPage
    const [selectedUserDetail, setSelectedUserDetail] = useState(null);

    // Function to navigate to the user detail page
    const navigateToUserDetail = (user, transactions) => {
        setSelectedUserDetail({ user, transactions });
        setCurrentPage('userDetail');
    };

    // Function to navigate back to the home page
    const navigateToHome = () => {
        setSelectedUserDetail(null); // Clear selected user data
        setCurrentPage('home');
    };

    return (
        <>
            {currentPage === 'home' && (
                <Home navigateToUserDetail={navigateToUserDetail} />
            )}
            {currentPage === 'userDetail' && selectedUserDetail && (
                <UserDetailPage
                    user={selectedUserDetail.user}
                    transactions={selectedUserDetail.transactions}
                    onBack={navigateToHome}
                />
            )}
        </>
    );
};

export default App;