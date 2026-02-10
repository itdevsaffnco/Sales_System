import React, { useState } from 'react';
import { format } from 'date-fns';
import DateRangePicker from './DateRangePicker';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    ComposedChart, Line, Area, AreaChart, PieChart, Pie, Cell
} from 'recharts';

const MTOverview = () => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 11, 30), // 30 Dec 2025
        end: new Date(2026, 0, 28)     // 28 Jan 2026
    });
    const [selectedChannel, setSelectedChannel] = useState('All Channels');

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
    const salesValueData = [
        { account: 'Alfamex', value: 450, qty: 1200, percentage: 35 },
        { account: 'Indomart', value: 380, qty: 950, percentage: 30 },
        { account: 'Hypermart', value: 250, qty: 600, percentage: 20 },
        { account: 'SuperIndo', value: 120, qty: 300, percentage: 10 },
        { account: 'Others', value: 70, qty: 150, percentage: 5 },
    ];

    const gapSalesData = [
        { account: 'Alfamex', target: 500, actual: 450, gap: -50 },
        { account: 'Indomart', target: 400, actual: 380, gap: -20 },
        { account: 'Hypermart', target: 200, actual: 250, gap: 50 },
        { account: 'SuperIndo', target: 150, actual: 120, gap: -30 },
    ];

    const achievementData = [
        { account: 'Alfamex', achievement: 90 },
        { account: 'Indomart', achievement: 95 },
        { account: 'Hypermart', achievement: 125 },
        { account: 'SuperIndo', achievement: 80 },
    ];

    const growthData = {
        mom: 12.5,
        yoy: 25.8
    };

    const growthTrendData = [
        { name: 'Jan', mom: 4, yoy: 10 },
        { name: 'Feb', mom: 6, yoy: 15 },
        { name: 'Mar', mom: 8, yoy: 12 },
        { name: 'Apr', mom: 5, yoy: 18 },
        { name: 'May', mom: 9, yoy: 22 },
        { name: 'Jun', mom: 12.5, yoy: 25.8 },
    ];

    const TrendCard = ({ title, value, data, dataKey, color, type = 'percent', icon }) => {
        const isPercent = type === 'percent';
        const displayValue = isPercent 
            ? `${value > 0 ? '+' : ''}${value}%`
            : `IDR ${value.toLocaleString()}M`;
            
        const valueColor = isPercent
            ? (value >= 0 ? 'text-green-600' : 'text-red-600')
            : 'text-gray-900';

        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="flex justify-between items-start relative z-10 mb-4">
                    <div>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</p>
                        <h3 className={`text-3xl font-bold mt-2 ${valueColor}`}>{displayValue}</h3>
                    </div>
                    <div className={`p-3 rounded-lg bg-opacity-10`} style={{ backgroundColor: `${color}20` }}>
                        {icon}
                    </div>
                </div>
                
                <div className="h-16 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={color} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area 
                                type="monotone" 
                                dataKey={dataKey} 
                                stroke={color} 
                                fill={`url(#gradient-${dataKey})`} 
                                strokeWidth={2}
                                dot={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    const topAccounts = [
        { id: 1, account: 'Alfamex', sku: 'SKU-001', value: 150, contribution: 33 },
        { id: 2, account: 'Indomart', sku: 'SKU-002', value: 120, contribution: 26 },
        { id: 3, account: 'Hypermart', sku: 'SKU-003', value: 90, contribution: 20 },
        { id: 4, account: 'Alfamex', sku: 'SKU-002', value: 60, contribution: 13 },
        { id: 5, account: 'SuperIndo', sku: 'SKU-001', value: 40, contribution: 8 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    const formatCurrency = (value) => `IDR ${value}M`;

    const channels = ['All Channels', ...salesValueData.map(d => d.account)];

    // Filter Logic
    const filteredSalesValueData = selectedChannel === 'All Channels'
        ? salesValueData
        : salesValueData.filter(d => d.account === selectedChannel);

    const filteredGapSalesData = selectedChannel === 'All Channels'
        ? gapSalesData
        : gapSalesData.filter(d => d.account === selectedChannel);

    const totalSales = filteredSalesValueData.reduce((acc, curr) => acc + curr.value, 0);

    const salesTrendData = [
        { name: 'Jan', value: 850 },
        { name: 'Feb', value: 920 },
        { name: 'Mar', value: 980 },
        { name: 'Apr', value: 1050 },
        { name: 'May', value: 1150 },
        { name: 'Jun', value: 1270 },
    ];

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 pb-24">
            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">MT Overview</h2>
                        <p className="text-sm text-gray-500 mt-1">Modern Trade Performance Summary</p>
                    </div>
                    
                    <div className="flex gap-4">
                        {/* Channel Filter */}
                        <div className="relative">
                            <select
                                value={selectedChannel}
                                onChange={(e) => setSelectedChannel(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                            >
                                {channels.map((channel) => (
                                    <option key={channel} value={channel}>{channel}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>

                        {/* Date Range Picker */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{formatDateRange()}</span>
                            </button>
                            {showDatePicker && (
                                <div className="absolute right-0 mt-2 z-50">
                                    <DateRangePicker
                                        startDate={dateRange.start}
                                        endDate={dateRange.end}
                                        onApply={handleDateApply}
                                        onCancel={() => setShowDatePicker(false)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <TrendCard 
                        title="Total Sales" 
                        value={totalSales} 
                        data={salesTrendData} 
                        dataKey="value" 
                        color="#6366F1" // Indigo-500
                        type="currency"
                        icon={
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <TrendCard 
                        title="MoM Growth" 
                        value={growthData.mom} 
                        data={growthTrendData} 
                        dataKey="mom" 
                        color="#10B981"
                        icon={
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        }
                    />
                    <TrendCard 
                        title="YoY Growth" 
                        value={growthData.yoy} 
                        data={growthTrendData} 
                        dataKey="yoy" 
                        color="#3B82F6"
                        icon={
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        }
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Sales Value per Account */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Sales Value per Account</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={filteredSalesValueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="account" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} cursor={{ fill: 'transparent' }} />
                                    <Legend />
                                    <Bar dataKey="value" name="Value (M)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Gap Sales per Account */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Gap Sales (Actual vs Target)</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={filteredGapSalesData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="account" type="category" width={80} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="actual" name="Actual" stackId="a" fill="#10B981" />
                                    <Bar dataKey="gap" name="Gap" stackId="a" fill="#EF4444" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Achievement vs Target */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Achievement %</h3>
                        <div className="space-y-6">
                            {achievementData.map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">{item.account}</span>
                                        <span className="text-sm font-medium text-gray-700">{item.achievement}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className={`h-2.5 rounded-full ${item.achievement >= 100 ? 'bg-green-600' : 'bg-blue-600'}`} 
                                            style={{ width: `${Math.min(item.achievement, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Account Table */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Top Accounts (SKU Level)</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value (M)</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Contribution</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {topAccounts.map((row) => (
                                        <tr key={row.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.account}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.sku}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{row.value}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{row.contribution}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MTOverview;
