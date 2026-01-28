import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import api from '../api/axios';

export default function Dashboard() {
    const [stats, setStats] = useState(null);

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
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center py-4 px-6 bg-white border-b-4 border-indigo-600">
                    <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-6 py-8">
                        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                            <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
                                <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="mb-2 text-sm font-medium text-gray-600">
                                        Total Entries
                                    </p>
                                    <p className="text-lg font-semibold text-gray-700">
                                        {stats ? stats.total_entries : 'Loading...'}
                                    </p>
                                </div>
                            </div>
                            
                            {stats && stats.top_channel && (
                                <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
                                    <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                                            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-sm font-medium text-gray-600">
                                            Top Channel
                                        </p>
                                        <p className="text-lg font-semibold text-gray-700">
                                            {stats.top_channel.channel_distribution} ({stats.top_channel.entries_count})
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
