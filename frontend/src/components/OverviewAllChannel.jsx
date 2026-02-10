import { useEffect, useState, useMemo } from 'react';
import api from '../api/axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import DateRangePicker from './DateRangePicker';
import { format } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function OverviewAllChannel() {
    const [stats, setStats] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [dateRange, setDateRange] = useState({ 
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), 
        endDate: new Date() 
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const params = {};
                if (dateRange.startDate) params.date_from = dateRange.startDate.toISOString().split('T')[0];
                if (dateRange.endDate) params.date_to = dateRange.endDate.toISOString().split('T')[0];

                const response = await api.get('/dashboard/general', { params });
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            }
        };
        fetchStats();
    }, [dateRange]);

    const handleDateApply = (start, end) => {
        setDateRange({ startDate: start, endDate: end });
        setShowDatePicker(false);
    };

    const formatDateRange = () => {
        if (!dateRange.startDate || !dateRange.endDate) return 'Select Date Range';
        return `${format(dateRange.startDate, 'd MMM yyyy')} - ${format(dateRange.endDate, 'd MMM yyyy')}`;
    };

    const getChannelCategory = (channelName) => {
        if (!channelName) return 'Other';
        const name = channelName.toUpperCase();
        
        const onlineKeywords = ['SHOPEE', 'TOKOPEDIA', 'TIKTOK', 'LAZADA', 'BLIBLI', 'ZALORA', 'WEBSITE', 'WHATSAPP'];
        if (onlineKeywords.some(k => name.includes(k))) return 'Online';

        const bdKeywords = ['MALAYSIA', 'OFFLINE DISTRIBUTOR', 'POP UP', 'EVENT'];
        if (bdKeywords.some(k => name.includes(k))) return 'BD';

        const offlineKeywords = ['PLAZA INDONESIA', 'MALL TAMAN ANGGREK', 'GENERAL TRADE', 'MODERN TRADE', 'STORE', 'OFFLINE'];
        if (offlineKeywords.some(k => name.includes(k))) return 'Offline';

        return 'Other';
    };

    const filteredData = useMemo(() => {
        if (!stats || !stats.by_channel) return [];
        
        return stats.by_channel.map(item => ({
            ...item,
            category: getChannelCategory(item.channel_distribution)
        })).filter(item => {
            if (selectedCategory === 'All') return true;
            return item.category === selectedCategory;
        });
    }, [stats, selectedCategory]);

    const kpis = useMemo(() => {
        const totalEntries = filteredData.reduce((sum, item) => sum + item.entries_count, 0);
        const topChannel = filteredData.reduce((max, item) => max.entries_count > item.entries_count ? max : item, filteredData[0] || null);
        
        // Mock Revenue Calculation (since backend only gives entries count)
        // Assuming avg order value varies by channel type for demo purposes
        const estimatedRevenue = filteredData.reduce((sum, item) => {
            let avgValue = 150000; // Default
            if (item.category === 'Online') avgValue = 120000;
            if (item.category === 'Offline') avgValue = 250000;
            if (item.category === 'BD') avgValue = 5000000; // Bulk orders
            return sum + (item.entries_count * avgValue);
        }, 0);

        return { totalEntries, topChannel, estimatedRevenue };
    }, [filteredData]);

    const chartData = useMemo(() => {
        // Pie Chart: Distribution by Category (if All) or Channel (if filtered)
        let pieData = [];
        if (selectedCategory === 'All') {
            const catMap = {};
            filteredData.forEach(item => {
                catMap[item.category] = (catMap[item.category] || 0) + item.entries_count;
            });
            pieData = Object.keys(catMap).map(key => ({ name: key, value: catMap[key] }));
        } else {
            pieData = filteredData.map(item => ({ name: item.channel_distribution, value: item.entries_count }));
        }

        // Bar Chart: Top 5 Channels in current view
        const barData = [...filteredData]
            .sort((a, b) => b.entries_count - a.entries_count)
            .slice(0, 5)
            .map(item => ({
                name: item.channel_distribution,
                entries: item.entries_count
            }));

        return { pieData, barData };
    }, [filteredData, selectedCategory]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
    };

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 h-full">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview All Channel</h1>
                        <p className="text-sm text-gray-500 mt-1">Monitor performance across all sales channels</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 shadow-sm"
                        >
                            <option value="All">All Channels</option>
                            <option value="Online">Online Sales</option>
                            <option value="BD">Business Development (BD)</option>
                            <option value="Offline">Offline Sales</option>
                        </select>
                        <div className="relative">
                            <button 
                                className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm hover:bg-gray-50 text-sm font-medium text-gray-700"
                                onClick={() => setShowDatePicker(!showDatePicker)}
                            >
                                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {formatDateRange()}
                            </button>
                            {showDatePicker && (
                                <DateRangePicker 
                                    onClose={() => setShowDatePicker(false)} 
                                    onApply={handleDateApply} 
                                    align="right"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-6 mb-8 md:grid-cols-3">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-gray-900">{kpis.totalEntries}</span>
                            <span className="ml-2 text-sm text-gray-500">entries</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Est. Revenue (Mock)</h3>
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-gray-900">{formatCurrency(kpis.estimatedRevenue)}</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Top Channel</h3>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-gray-900 truncate">
                                {kpis.topChannel ? kpis.topChannel.channel_distribution : '-'}
                            </div>
                            <div className="text-sm text-gray-500">
                                {kpis.topChannel ? `${kpis.topChannel.entries_count} entries` : 'No data'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid gap-6 mb-8 md:grid-cols-2">
                    {/* Distribution Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">
                            {selectedCategory === 'All' ? 'Channel Category Distribution' : 'Channel Breakdown'}
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData.pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {chartData.pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Channels Bar Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Top 5 Channels (Volume)</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData.barData}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" />
                                    <YAxis type="category" dataKey="name" width={100} />
                                    <Tooltip />
                                    <Bar dataKey="entries" fill="#6366f1" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Data Table (Optional) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">Detailed Breakdown</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Channel</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3 text-right">Entries</th>
                                    <th className="px-6 py-3 text-right">Avg Price (Max)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {item.channel_distribution}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                ${item.category === 'Online' ? 'bg-blue-100 text-blue-800' : 
                                                  item.category === 'Offline' ? 'bg-orange-100 text-orange-800' : 
                                                  item.category === 'BD' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {item.entries_count}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {formatCurrency(item.max_pricing_rsp_new)}
                                        </td>
                                    </tr>
                                ))}
                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colspan="4" className="px-6 py-8 text-center text-gray-500">
                                            No data available for selected filters
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
