import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import api from '../api/axios';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/general');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center py-6 px-8 bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="mr-4 p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                            M
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    <div className="container mx-auto px-8 py-8">
                        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                            <div className="flex items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                                <div className="p-3 mr-4 text-emerald-600 bg-emerald-100 rounded-lg">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="mb-1 text-sm font-medium text-gray-500">
                                        Total Entries
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {stats ? stats.total_entries : '...'}
                                    </p>
                                </div>
                            </div>
                            
                            {stats && stats.top_channel && (
                                <div className="flex items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                                    <div className="p-3 mr-4 text-blue-600 bg-blue-100 rounded-lg">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-sm font-medium text-gray-500">
                                            Top Channel
                                        </p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {stats.top_channel.channel_distribution}
                                        </p>
                                        <p className="text-xs text-gray-500 font-medium">
                                            {stats.top_channel.entries_count} entries
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
