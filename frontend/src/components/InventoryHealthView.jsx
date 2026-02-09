import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import DateRangePicker from './DateRangePicker';

export default function InventoryHealthView() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 11, 30),
        end: new Date(2026, 0, 28)
    });
    const [activeTab, setActiveTab] = useState('all'); // all, critical, overstock
    const [activeChannel, setActiveChannel] = useState('All');
    const channels = ['All', 'Shopee', 'Tiktok', 'Lazada', 'Blibli', 'Zalora', 'Website'];

    const handleDateApply = (start, end) => {
        if (start && end) {
            setDateRange({ start, end });
        }
        setShowDatePicker(false);
    };

    const formatDateRange = () => {
        if (!dateRange.start || !dateRange.end) return 'Select Date Range';
        const days = Math.round((dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24)) + 1;
        return `${format(dateRange.start, 'd MMM yyyy')} - ${format(dateRange.end, 'd MMM yyyy')} (${days} days)`;
    };

    // Mock Data
    const stats = {
        criticalStock: 12, // Items with low stock
        avgDaysOfCover: 45, // Average days stock will last
        overstockRisk: 8   // Items with too much stock
    };

    // Chart Data - Distribution
    const distributionData = [
        { name: 'Critical', value: 12, color: '#EF4444' }, // Red-500
        { name: 'Healthy', value: 145, color: '#10B981' }, // Emerald-500
        { name: 'Overstock', value: 8, color: '#F59E0B' }, // Amber-500
    ];

    // Table Data
    const allProducts = [
        { id: 1, name: 'Slim Fit Chinos - Navy', sku: 'PANT-001', stock: 5, dailySales: 2, cover: 2.5, status: 'critical' },
        { id: 2, name: 'Cotton Crew Neck T-Shirt - White', sku: 'SHIRT-005', stock: 120, dailySales: 15, cover: 8, status: 'critical' },
        { id: 3, name: 'Denim Jacket - Vintage Blue', sku: 'JKT-003', stock: 450, dailySales: 1, cover: 450, status: 'overstock' },
        { id: 4, name: 'Leather Belt - Brown', sku: 'ACC-002', stock: 300, dailySales: 2, cover: 150, status: 'overstock' },
        { id: 5, name: 'Canvas Sneakers - Black', sku: 'SHOE-001', stock: 85, dailySales: 4, cover: 21, status: 'healthy' },
        { id: 6, name: 'Hoodie - Grey', sku: 'HOOD-004', stock: 60, dailySales: 3, cover: 20, status: 'healthy' },
        { id: 7, name: 'Oxford Shirt - Blue', sku: 'SHIRT-002', stock: 4, dailySales: 1, cover: 4, status: 'critical' },
    ];

    const getFilteredProducts = () => {
        if (activeTab === 'all') return allProducts;
        return allProducts.filter(p => p.status === activeTab);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'critical':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Critical</span>;
            case 'overstock':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Overstock</span>;
            default:
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Healthy</span>;
        }
    };

    return (
        <div className="flex-1 bg-gray-50 p-8 overflow-y-auto h-full pb-64">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Inventory Health</h1>

            {/* Top Controls: Channel Filter + Date Picker */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <div className="bg-gray-100 p-1 rounded-lg flex flex-wrap gap-1">
                    {channels.map(channel => (
                        <button
                            key={channel}
                            onClick={() => setActiveChannel(channel)}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                                activeChannel === channel
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                            }`}
                        >
                            {channel}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <div 
                        className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm cursor-pointer hover:bg-gray-50"
                        onClick={() => setShowDatePicker(!showDatePicker)}
                    >
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">{formatDateRange()}</span>
                        <svg className="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    {showDatePicker && (
                        <div className="absolute top-12 right-0 z-50">
                            <DateRangePicker 
                                onClose={() => setShowDatePicker(false)} 
                                onApply={handleDateApply} 
                                align="right"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stock Critical */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Stock Critical</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.criticalStock}</p>
                        <p className="text-sm text-red-600 mt-1">Items below reorder point</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <span className="p-2 bg-red-50 rounded-lg">
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Days of Cover */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Avg Days of Cover</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.avgDaysOfCover} <span className="text-lg font-normal text-gray-500">days</span></p>
                        <p className="text-sm text-gray-500 mt-1">Based on last 30 days sales</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <span className="p-2 bg-blue-50 rounded-lg">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Overstock Risk */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Overstock Risk</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.overstockRisk}</p>
                        <p className="text-sm text-yellow-600 mt-1">Items with &gt; 90 days cover</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <span className="p-2 bg-yellow-50 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12a8 8 0 11-16 0 8 8 0 0116 0v0zm0 0l-6-6M9 12h6" /> // Trend down ish
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Inventory Health Distribution</h3>
                    <div className="h-64 flex justify-center items-center">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2 flex flex-col justify-center items-center text-center p-12">
                     <h3 className="text-lg font-bold text-gray-800 mb-2">Detailed Analysis</h3>
                     <p className="text-gray-500">More charts can be added here (e.g., Stock Value Trends, Aging Report).</p>
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="text-lg font-bold text-gray-800">Inventory Details</h3>
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setActiveTab('critical')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'critical' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Critical
                        </button>
                         <button 
                            onClick={() => setActiveTab('overstock')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'overstock' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Overstock
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Sales (Avg)</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Days of Cover</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {getFilteredProducts().map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{product.stock}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{product.dailySales}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                                        {product.cover.toFixed(1)} days
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {getStatusBadge(product.status)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Date Picker moved to top; floating removed */}
        </div>
    );
}
