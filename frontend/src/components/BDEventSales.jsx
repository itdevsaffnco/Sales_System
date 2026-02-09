import React, { useState } from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, ComposedChart } from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function BDEventSales() {
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
        sales_value: 120000000,
        sales_qty: 3500,
        contribution_percent: 15,
        gmv_mtd: 45000000,
        sales_per_day: 4000000,
        atv: 34285
    };

    const eventPerformance = [
        { event: 'Pop Up A', sales: 45000000, target: 50000000, gap: -5000000 },
        { event: 'Pop Up B', sales: 38000000, target: 35000000, gap: 3000000 },
        { event: 'Event C', sales: 25000000, target: 30000000, gap: -5000000 },
        { event: 'Event D', sales: 12000000, target: 10000000, gap: 2000000 },
    ];

    const MetricCard = ({ title, value, subValue, subLabel, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            {subValue && (
                <p className={`text-xs mt-2 font-medium ${color || 'text-gray-500'}`}>
                    {subValue} <span className="text-gray-400 font-normal ml-1">{subLabel}</span>
                </p>
            )}
        </div>
    );

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Event Sales Performance</h2>
                        <p className="text-sm text-gray-500 mt-1">Sales Value, Quantity, Target & Gap Analysis</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Date Picker */}
                        <div className="relative">
                            <div 
                                className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors h-full"
                                onClick={() => setShowDatePicker(!showDatePicker)}
                            >
                                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{formatDateRange()}</span>
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
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard 
                        title="Sales Value" 
                        value={formatCurrency(metrics.sales_value)} 
                        subValue={`${metrics.contribution_percent}%`}
                        subLabel="Contribution"
                        color="text-blue-600"
                    />
                    <MetricCard 
                        title="GMV MTD" 
                        value={formatCurrency(metrics.gmv_mtd)} 
                        subValue="Month to Date"
                        color="text-green-600"
                    />
                    <MetricCard 
                        title="Sales per Day" 
                        value={formatCurrency(metrics.sales_per_day)} 
                        subValue="Average"
                        color="text-purple-600"
                    />
                    <MetricCard 
                        title="ATV" 
                        value={formatCurrency(metrics.atv)} 
                        subValue="Avg Transaction Value"
                        color="text-orange-500"
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Achievement vs Target */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Achievement vs Target per Event</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={eventPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="event" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(val) => `${val/1000000}M`} />
                                    <Tooltip 
                                        formatter={(value) => formatCurrency(value)}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="sales" name="Actual Sales" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                                    <Line type="monotone" dataKey="target" name="Target" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Gap Analysis */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Gap Sales per Event</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={eventPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="event" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(val) => `${val/1000000}M`} />
                                    <Tooltip 
                                        formatter={(value) => formatCurrency(value)}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="gap" name="Sales Gap (Actual - Target)" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={30}>
                                        {eventPerformance.map((entry, index) => (
                                            <cell key={`cell-${index}`} fill={entry.gap >= 0 ? '#10B981' : '#EF4444'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}