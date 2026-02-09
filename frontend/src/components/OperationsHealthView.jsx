import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, LineChart, Line, ComposedChart } from 'recharts';
import { format } from 'date-fns';
import DateRangePicker from './DateRangePicker';

export default function OperationsHealthView() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 11, 30),
        end: new Date(2026, 0, 28)
    });
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
        slaRisk: 24, // Orders nearing SLA breach
        deliveryDelay: 15, // Orders currently delayed
        refundRate: 1.8 // Percentage
    };

    // Chart Data - Refund Rate (Monthly)
    // Formula: Total Qty / Refund (per user request interpretation, but standard is %)
    // We will show Sales vs Refunds and the Rate line
    const refundTrendData = [
        { month: 'Jan', sales: 1200, refunds: 15, rate: 1.25 },
        { month: 'Feb', sales: 1350, refunds: 22, rate: 1.63 },
        { month: 'Mar', sales: 1100, refunds: 18, rate: 1.64 },
        { month: 'Apr', sales: 1600, refunds: 25, rate: 1.56 },
        { month: 'May', sales: 1900, refunds: 35, rate: 1.84 },
        { month: 'Jun', sales: 2100, refunds: 42, rate: 2.0 },
    ];

    // Chart Data - SLA & Delay
    const fulfillmentData = [
        { name: 'Mon', onTime: 145, risk: 12, delayed: 5 },
        { name: 'Tue', onTime: 132, risk: 8, delayed: 3 },
        { name: 'Wed', onTime: 156, risk: 15, delayed: 7 },
        { name: 'Thu', onTime: 140, risk: 10, delayed: 4 },
        { name: 'Fri', onTime: 165, risk: 18, delayed: 8 },
        { name: 'Sat', onTime: 98, risk: 5, delayed: 2 },
        { name: 'Sun', onTime: 85, risk: 3, delayed: 1 },
    ];

    return (
        <div className="flex-1 bg-gray-50 p-8 overflow-y-auto h-full pb-64">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Operations Health</h1>

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
                {/* SLA Risk */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">SLA Risk</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.slaRisk}</p>
                        <p className="text-sm text-orange-600 mt-1">Orders nearing breach (&lt; 4h)</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <span className="p-2 bg-orange-50 rounded-lg">
                            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Delivery Delay */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Delivery Delay</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.deliveryDelay}</p>
                        <p className="text-sm text-red-600 mt-1">Orders late &gt; 2 days</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <span className="p-2 bg-red-50 rounded-lg">
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Return/Refund Rate */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Return / Refund Rate</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.refundRate}%</p>
                        <p className="text-sm text-gray-500 mt-1">Total Qty / Refund per Month</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <span className="p-2 bg-blue-50 rounded-lg">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Refund Rate Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Refund Rate Monthly Analysis</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={refundTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} unit="%" />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
                                    labelStyle={{fontWeight: 'bold', color: '#111827'}}
                                />
                                <Legend />
                                <Bar yAxisId="left" dataKey="sales" name="Total Sales Qty" fill="#E0E7FF" radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="left" dataKey="refunds" name="Refund Qty" fill="#FCA5A5" radius={[4, 4, 0, 0]} />
                                <Line yAxisId="right" type="monotone" dataKey="rate" name="Refund Rate (%)" stroke="#DC2626" strokeWidth={3} dot={{r: 4}} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Fulfillment Performance Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">SLA & Delivery Performance (Weekly)</h3>
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={fulfillmentData} stacked>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
                                    cursor={{fill: 'transparent'}}
                                />
                                <Legend />
                                <Bar dataKey="onTime" name="On Time" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="risk" name="SLA Risk" stackId="a" fill="#F59E0B" />
                                <Bar dataKey="delayed" name="Delayed" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Date Picker moved to top; floating removed */}
        </div>
    );
}
