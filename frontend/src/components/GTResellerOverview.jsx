import React, { useState } from 'react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function GTResellerOverview() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 11, 30),
        end: new Date(2026, 0, 28)
    });

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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    const formatNumber = (value) => {
        return new Intl.NumberFormat('id-ID').format(value);
    };

    // Mock Data
    const metrics = {
        sales_value: 85000000,
        target_achievement: 92.5,
        growth_mom: 5.4,
        growth_yoy: 12.1,
        active_outlets: 68,
        registered_outlets: 85,
        new_outlets: 12,
    };

    const growthTrend = [
        { month: 'Aug', sales: 60, target: 55 },
        { month: 'Sep', sales: 65, target: 60 },
        { month: 'Oct', sales: 70, target: 70 },
        { month: 'Nov', sales: 72, target: 75 },
        { month: 'Dec', sales: 80, target: 78 },
        { month: 'Jan', sales: 85, target: 82 },
    ]; // In Millions

    const aoRoData = [
        { name: 'Active (AO)', value: metrics.active_outlets, color: '#10B981' },
        { name: 'Inactive', value: metrics.registered_outlets - metrics.active_outlets, color: '#E5E7EB' },
    ];

    const MetricCard = ({ title, value, subValue, subLabel, color }) => (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
            {subValue && (
                <p className={`text-xs mt-1 ${color || 'text-gray-500'}`}>
                    {subValue} <span className="text-gray-400">{subLabel}</span>
                </p>
            )}
        </div>
    );

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">GT Reseller Overview</h2>
                        <p className="text-sm text-gray-500 mt-1">Overall performance summary</p>
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
                        </div>
                        {showDatePicker && (
                            <DateRangePicker 
                                onClose={() => setShowDatePicker(false)} 
                                onApply={handleDateApply} 
                                align="right"
                            />
                        )}
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard 
                        title="Sales Value" 
                        value={formatCurrency(metrics.sales_value)} 
                        subValue={`${metrics.target_achievement}%`}
                        subLabel="Achievement"
                        color={metrics.target_achievement >= 100 ? 'text-green-600' : 'text-blue-600'}
                    />
                    <MetricCard 
                        title="MoM Growth" 
                        value={`${metrics.growth_mom > 0 ? '+' : ''}${metrics.growth_mom}%`}
                        subValue="Month over Month"
                        color={metrics.growth_mom > 0 ? 'text-green-600' : 'text-red-500'}
                    />
                    <MetricCard 
                        title="Active Outlets (AO)" 
                        value={formatNumber(metrics.active_outlets)}
                        subValue={`${((metrics.active_outlets / metrics.registered_outlets) * 100).toFixed(0)}%`}
                        subLabel="of Registered"
                        color="text-purple-600"
                    />
                    <MetricCard 
                        title="New Outlets (NOO)" 
                        value={formatNumber(metrics.new_outlets)}
                        subValue="This Period"
                        color="text-orange-500"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Growth Trend Chart */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Trend vs Target (Millions)</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={growthTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => formatCurrency(value * 1000000)} />
                                    <Legend />
                                    <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={3} name="Sales" activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="target" stroke="#9CA3AF" strokeDasharray="5 5" strokeWidth={2} name="Target" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* AO vs RO Chart */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Coverage Status</h3>
                        <div className="h-72 flex justify-center items-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={aoRoData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {aoRoData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-sm text-gray-500">Total Registered: <span className="font-bold text-gray-800">{metrics.registered_outlets}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
