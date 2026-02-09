import React, { useState, useEffect } from 'react';
import { format, eachMonthOfInterval } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Line } from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function BDEventCost() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 7, 1), // Aug 2025
        end: new Date(2026, 0, 28)   // Jan 2026
    });
    
    const [monthlyTrend, setMonthlyTrend] = useState([]);

    const handleDateApply = (start, end) => {
        if (start && end) {
            setDateRange({ start, end });
        }
        setShowDatePicker(false);
    };

    useEffect(() => {
        if (dateRange.start && dateRange.end) {
            try {
                const months = eachMonthOfInterval({
                    start: dateRange.start,
                    end: dateRange.end
                });

                const data = months.map(date => ({
                    month: format(date, 'MMM yyyy'),
                    sales: Math.floor(Math.random() * (200000000 - 100000000) + 100000000),
                    cost: Math.floor(Math.random() * (60000000 - 30000000) + 30000000),
                }));
                
                // Calculate ratio
                const dataWithRatio = data.map(item => ({
                    ...item,
                    ratio: ((item.cost / item.sales) * 100).toFixed(1)
                }));

                setMonthlyTrend(dataWithRatio);
            } catch (error) {
                console.error("Error generating trend data:", error);
                setMonthlyTrend([]);
            }
        }
    }, [dateRange]);

    const formatDateRange = () => {
        if (!dateRange.start || !dateRange.end) return 'Select Date Range';
        const days = Math.round((dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24)) + 1;
        return `${format(dateRange.start, 'd MMM yyyy')} - ${format(dateRange.end, 'd MMM yyyy')} (${days} days)`;
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    // Mock Data
    const metrics = {
        total_sales: 120000000,
        total_cost: 35000000,
        cost_ratio: 29.1,
    };

    const costBreakdown = [
        { name: 'Venue Rental', value: 15000000 },
        { name: 'Staffing', value: 8000000 },
        { name: 'Logistics', value: 5000000 },
        { name: 'Marketing', value: 7000000 },
    ];

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

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
                        <h2 className="text-2xl font-bold text-gray-800">Event Cost vs Sales</h2>
                        <p className="text-sm text-gray-500 mt-1">Cost Efficiency Analysis</p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <MetricCard 
                        title="Total Sales" 
                        value={formatCurrency(metrics.total_sales)} 
                        subValue="Revenue"
                        color="text-green-600"
                    />
                    <MetricCard 
                        title="Total Cost" 
                        value={formatCurrency(metrics.total_cost)} 
                        subValue="Expenses"
                        color="text-red-500"
                    />
                    <MetricCard 
                        title="Cost Ratio" 
                        value={`${metrics.cost_ratio}%`} 
                        subValue="Cost / Sales"
                        color="text-orange-500"
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Cost Breakdown</h3>
                        <div className="h-80 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={costBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {costBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Cost vs Sales Trend</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={monthlyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                                    <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(val) => `${val/1000000}M`} />
                                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} unit="%" />
                                    <Tooltip 
                                        formatter={(value, name) => [name === 'ratio' ? `${value}%` : formatCurrency(value), name === 'ratio' ? 'Cost Ratio' : (name === 'sales' ? 'Total Sales' : 'Total Cost')]}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="sales" name="Sales" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Bar yAxisId="left" dataKey="cost" name="Cost" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Line yAxisId="right" type="monotone" dataKey="ratio" name="Cost Ratio %" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}