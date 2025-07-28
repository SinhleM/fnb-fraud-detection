import React from 'react';
// Import UserDetailPage as it will be displayed inside this modal
import UserDetailPage from '../pages/UserDetailPage';

const DetailModal = ({ isOpen, onClose, data }) => {
    // If the modal is not open, don't render anything
    if (!isOpen) return null;

    // Destructure the user and transactions data passed to the modal
    const { user, transactions } = data;

    return (
        // Fixed positioning to cover the screen with a semi-transparent background
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            {/* Modal content container */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden w-11/12 max-w-4xl max-h-[90vh] flex flex-col">
                {/* Scrollable area for UserDetailPage content */}
                <div className="flex-grow overflow-y-auto">
                    {/* Render the UserDetailPage component inside the modal.
                        Pass the user and transactions data to it.
                        The 'onBack' prop for UserDetailPage will now trigger the modal's 'onClose'. */}
                    <UserDetailPage user={user} transactions={transactions} onBack={onClose} />
                </div>
            </div>
        </div>
    );
};

export default DetailModal;