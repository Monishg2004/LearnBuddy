//layout
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookOpen, Clock } from 'lucide-react';
import '../index.css';
export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center px-2 py-2 text-gray-900">
                <BookOpen className="h-6 w-6 mr-2" />
                <span className="font-semibold text-xl">Study Helper</span>
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                to="/recent"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <Clock className="h-5 w-5 mr-2" />
                Recent
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}