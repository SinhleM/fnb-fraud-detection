import React from 'react';

const Header = () => {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo / Title */}
                    <div className="flex-shrink-0">
                        <h1 className="text-xl font-semibold text-gray-900">
                            FNB <span className="text-gray-800">Fraud Detection</span> {/* Green branding hint */}
                        </h1>
                    </div>

                    {/* Minimalist Nav */}
                    <nav className="hidden md:flex space-x-6">
                        <a 
                            href="#" 
                            className="text-sm text-gray-600 hover:text-teal-600 transition-colors duration-200" // subtle green hint
                        >
                            Dashboard
                        </a>
                        <a 
                            href="#" 
                            className="text-sm text-gray-600 hover:text-teal-600 transition-colors duration-200"
                        >
                            Reports
                        </a>
                        <a 
                            href="#" 
                            className="text-sm text-gray-600 hover:text-teal-600 transition-colors duration-200"
                        >
                            Settings
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
