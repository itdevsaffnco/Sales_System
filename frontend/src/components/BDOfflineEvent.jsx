import React, { useState } from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Legend } from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function BDOfflineEvent() {
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
        gmv_mtd: 150000000,
        target_event: 180000000,
        sales_per_day: 5357142, // Average
        atv: 250000,
        promo_value: 12000000,
        cost_vs_sales: 15.5, // %
    };

    const eventPerformance = [
        { event: 'Pop Up Batam', sales: 45000000, target: 50000000, days: 10 },
        { event: 'Pop Up Sency', sales: 60000000, target: 70000000, days: 14 },
        { event: 'Event JXB', sales: 30000000, target: 40000000, days: 5 },
        { event: 'Pop Up Kokas', sales: 15000000, target: 20000000, days: 7 },
    ];

    const dailyTrend = [
        { day: 'Day 1', sales: 4000000, visitors: 300 },
        { day: 'Day 2', sales: 5500000, visitors: 450 },
        { day: 'Day 3', sales: 4800000, visitors: 380 },
        { day: 'Day 4', sales: 6000000, visitors: 500 },
        { day: 'Day 5', sales: 7500000, visitors: 650 }, // Weekend
        { day: 'Day 6', sales: 8000000, visitors: 700 }, // Weekend
        { day: 'Day 7', sales: 5000000, visitors: 400 },
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
                        <h2 className="text-2xl font-bold text-gray-800">Offline (Pop Up & Event)</h2>
                        <p className="text-sm text-gray-500 mt-1">Temporary event and pop-up store performance</p>
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
                        title="GMV MTD" 
                        value={formatCurrency(metrics.gmv_mtd)} 
                        subValue={`${((metrics.gmv_mtd / metrics.target_event) * 100).toFixed(1)}%`}
                        subLabel="of Target"
                        color={metrics.gmv_mtd >= metrics.target_event ? 'text-green-600' : 'text-yellow-600'}
                    />
                    <MetricCard 
                        title="Avg Sales / Day" 
                        value={formatCurrency(metrics.sales_per_day)}
                        subValue={formatCurrency(metrics.atv)}
                        subLabel="ATV"
                        color="text-blue-600"
                    />
                    <MetricCard 
                        title="Gap Sales" 
                        value={formatCurrency(metrics.target_event - metrics.gmv_mtd)}
                        subValue="To Target"
                        color="text-red-500"
                    />
                    <MetricCard 
                        title="Cost vs Sales" 
                        value={`${metrics.cost_vs_sales}%`}
                        subValue={formatCurrency(metrics.promo_value)}
                        subLabel="Promo Value"
                        color="text-purple-600"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Event Performance Chart */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance by Event</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={eventPerformance} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" tickFormatter={(value) => `${value / 1000000}M`} />
                                    <YAxis dataKey="event" type="category" width={100} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                    <Bar dataKey="sales" name="Sales" fill="#F59E0B" />
                                    <Bar dataKey="target" name="Target" fill="#E5E7EB" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Daily Trend Chart (Last 7 Days) */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Sales Trend (Last 7 Days)</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={dailyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip formatter={(value, name) => [name === 'Sales' ? formatCurrency(value) : value, name]} />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="sales" name="Sales" fill="#F59E0B" barSize={30} />
                                    <Line yAxisId="right" type="monotone" dataKey="visitors" name="Visitors" stroke="#3B82F6" strokeWidth={2} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
