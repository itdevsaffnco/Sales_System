import React, { useState } from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function GTDistributor() {
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
        sales_value: 150000000,
        sales_qty: 1200,
        target_achievement: 88.5,
        growth_mom: 3.2,
        growth_yoy: 9.5,
        active_outlets: 80,
        registered_outlets: 100,
        new_outlets: 5,
    };

    const accountPerformance = [
        { account: 'GT Distributor A', sales: 45000000, target: 50000000, achievement: 90.0, growth: 5.5 },
        { account: 'GT Distributor B', sales: 35000000, target: 40000000, achievement: 87.5, growth: -1.2 },
        { account: 'GT Distributor C', sales: 30000000, target: 30000000, achievement: 100.0, growth: 8.5 },
        { account: 'GT Distributor D', sales: 25000000, target: 20000000, achievement: 125.0, growth: 12.2 },
        { account: 'GT Distributor E', sales: 15000000, target: 20000000, achievement: 75.0, growth: -3.0 },
    ];

    const growthTrend = [
        { month: 'Aug', sales: 110, target: 100 },
        { month: 'Sep', sales: 120, target: 110 },
        { month: 'Oct', sales: 115, target: 115 },
        { month: 'Nov', sales: 130, target: 125 },
        { month: 'Dec', sales: 145, target: 140 },
        { month: 'Jan', sales: 150, target: 150 },
    ]; // In Millions

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
                        <h2 className="text-2xl font-bold text-gray-800">GT Distributor</h2>
                        <p className="text-sm text-gray-500 mt-1">GT Distributor network performance and coverage</p>
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
                        title="Sales Growth" 
                        value={`${metrics.growth_mom > 0 ? '+' : ''}${metrics.growth_mom}%`}
                        subValue="MoM Growth"
                        color={metrics.growth_mom > 0 ? 'text-green-600' : 'text-red-500'}
                    />
                    <MetricCard 
                        title="Active Outlets (AO)" 
                        value={formatNumber(metrics.active_outlets)}
                        subValue={`${((metrics.active_outlets / metrics.registered_outlets) * 100).toFixed(0)}%`}
                        subLabel="of Registered (RO)"
                        color="text-purple-600"
                    />
                    <MetricCard 
                        title="New Outlets (NOO)" 
                        value={formatNumber(metrics.new_outlets)}
                        subValue="This Period"
                        color="text-orange-500"
                    />
                </div>

                {/* Main Content Grid */}
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
                                    <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={2} name="Sales" />
                                    <Line type="monotone" dataKey="target" stroke="#9CA3AF" strokeDasharray="5 5" name="Target" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Accounts Table */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 lg:col-span-3">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Performance</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ach %</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Growth %</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {accountPerformance.map((account, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{account.account}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(account.sales)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(account.target)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${account.achievement >= 100 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {account.achievement.toFixed(1)}%
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${account.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {account.growth > 0 ? '+' : ''}{account.growth}%
                                            </td>
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
}
