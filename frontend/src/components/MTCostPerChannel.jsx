import React, { useState } from 'react';
import { format } from 'date-fns';
import DateRangePicker from './DateRangePicker';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const MTCostPerChannel = () => {
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

    // Mock Data (Values in IDR)
    const costData = [
        { channel: 'Alfamex', margin: 250000000, discount: 50000000, logistics: 20000000, marketing: 30000000 },
        { channel: 'Indomart', margin: 220000000, discount: 40000000, logistics: 25000000, marketing: 20000000 },
        { channel: 'Hypermart', margin: 300000000, discount: 80000000, logistics: 30000000, marketing: 50000000 },
        { channel: 'SuperIndo', margin: 280000000, discount: 60000000, logistics: 20000000, marketing: 40000000 },
        { channel: 'Others', margin: 200000000, discount: 30000000, logistics: 40000000, marketing: 10000000 },
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatTooltipValue = (value) => {
        return formatCurrency(value);
    };

    const formatYAxis = (value) => {
        if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}M`;
        if (value >= 1000000) return `${(value / 1000000).toFixed(0)}Jt`;
        return value;
    };

    const channels = ['All Channels', ...costData.map(d => d.channel)];

    // Filter Logic
    const filteredCostData = selectedChannel === 'All Channels'
        ? costData
        : costData.filter(d => d.channel === selectedChannel);

    // Calculate Summary Metrics
    // 1. Highest Margin Channel (Top 5)
    const top5HighestMargin = [...filteredCostData]
        .sort((a, b) => b.margin - a.margin)
        .slice(0, 5);
    
    // 2. Lowest Cost Channel (Top 5)
    // Cost = Discount + Logistics + Marketing (Margin is profit, not cost)
    // Assuming user meant "Lowest Cost" as in lowest operational cost (excluding margin)
    // OR lowest "Total Cost Impact" as defined in previous code (sum of all?)
    // Previous code: total = margin + discount + logistics + marketing.
    // Wait, if it's "Lowest Cost Channel", usually it means Discount + Logistics + Marketing is minimized.
    // Margin is good, Cost is bad.
    // Let's stick to the previous definition of "Total Cost Impact" for consistency, or refine it.
    // The previous code summed everything: const totalA = a.margin + a.discount + a.logistics + a.marketing;
    // But usually Margin is what you KEEP. The others are costs.
    // If "Cost" means "Expense", it should be Discount + Logistics + Marketing.
    // However, to avoid breaking changes if the user liked the previous logic, let's see.
    // Previous label: "Total Cost Impact: 28%".
    // If I change the logic, the number changes.
    // Let's assume "Cost" means (Discount + Logistics + Marketing).
    // Let's recalculate based on the sum of costs.
    
    const top5LowestCost = [...filteredCostData]
        .map(d => ({
            ...d,
            totalCost: d.discount + d.logistics + d.marketing
        }))
        .sort((a, b) => a.totalCost - b.totalCost)
        .slice(0, 5);

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 pb-24">
            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">MT Cost per Channel</h2>
                        <p className="text-sm text-gray-500 mt-1">Cost Breakdown & Margin Analysis</p>
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

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Cost Structure Breakdown (Value)</h3>
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={filteredCostData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="channel" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={formatYAxis} />
                                <Tooltip 
                                    cursor={{ fill: 'transparent' }} 
                                    formatter={(value) => formatTooltipValue(value)}
                                />
                                <Legend />
                                <Bar dataKey="margin" name="Margin" stackId="a" fill="#3B82F6" />
                                <Bar dataKey="discount" name="Discount" stackId="a" fill="#F59E0B" />
                                <Bar dataKey="marketing" name="Marketing" stackId="a" fill="#10B981" />
                                <Bar dataKey="logistics" name="Logistics" stackId="a" fill="#6B7280" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                     {/* Top 5 Highest Margin Channels */}
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Top 5 Highest Margin Channels</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Margin (Rp)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {top5HighestMargin.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {index + 1}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.channel}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-blue-600">{formatCurrency(item.margin)}</td>
                                        </tr>
                                    ))}
                                    {top5HighestMargin.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                     </div>

                     {/* Top 5 Lowest Cost Channels */}
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Top 5 Lowest Cost Channels</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost (Rp)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {top5LowestCost.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index === 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {index + 1}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.channel}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-green-600">{formatCurrency(item.totalCost)}</td>
                                        </tr>
                                    ))}
                                    {top5LowestCost.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default MTCostPerChannel;
