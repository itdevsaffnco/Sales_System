import React, { useState, useEffect } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, ComposedChart, Line } from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function BDDistributorCost() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 7, 1), // Aug 2025
        end: new Date(2026, 0, 28)   // Jan 2026
    });

    const [monthlyTrend, setMonthlyTrend] = useState([]);

    const [selectedDistributor, setSelectedDistributor] = useState('All Distributors');
    const distributors = ['All Distributors', 'Distributor A', 'Distributor B', 'Distributor C', 'Distributor D', 'Distributor E'];

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

    useEffect(() => {
        if (dateRange.start && dateRange.end) {
            try {
                const months = eachMonthOfInterval({
                    start: dateRange.start,
                    end: dateRange.end
                });

                const data = months.map(date => ({
                    month: format(date, 'MMM yyyy'),
                    investment: Math.floor(Math.random() * (15000000 - 8000000) + 8000000),
                    margin: Math.floor(Math.random() * (30000000 - 20000000) + 20000000),
                    roi: Math.floor(Math.random() * (25 - 15) + 15)
                }));

                setMonthlyTrend(data);
            } catch (error) {
                console.error("Error generating trend data:", error);
                setMonthlyTrend([]);
            }
        }
    }, [dateRange]);

    // Mock Data
    const metrics = {
        total_margin: 25000000,
        margin_percent: 18.5,
        total_discount: 15000000,
        marketing_support: 8500000,
        cost_per_account: 450000
    };

    const costBreakdown = [
        { name: 'Discounts', value: 15000000 },
        { name: 'Marketing Support', value: 8500000 },
        { name: 'Logistics', value: 4500000 },
        { name: 'Incentives', value: 3200000 },
    ];

    const COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6'];

    const costPerAccount = [
        { account: 'Distributor A', cost: 1200000, sales: 120000000, ratio: 1.0 },
        { account: 'Distributor B', cost: 950000, sales: 95000000, ratio: 1.0 },
        { account: 'Distributor C', cost: 850000, sales: 80000000, ratio: 1.1 },
        { account: 'Distributor D', cost: 1500000, sales: 65000000, ratio: 2.3 },
        { account: 'Distributor E', cost: 450000, sales: 50000000, ratio: 0.9 },
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
                        <h2 className="text-2xl font-bold text-gray-800">Cost & Investment</h2>
                        <p className="text-sm text-gray-500 mt-1">Margin, Discount & Marketing Spend Analysis</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Distributor Filter */}
                        <div className="relative">
                            <select 
                                value={selectedDistributor}
                                onChange={(e) => setSelectedDistributor(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer text-sm font-medium h-full"
                            >
                                {distributors.map((dist) => (
                                    <option key={dist} value={dist}>{dist}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                </svg>
                            </div>
                        </div>

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
                        title="Total Margin" 
                        value={formatCurrency(metrics.total_margin)} 
                        subValue={`${metrics.margin_percent}%`}
                        subLabel="Margin %"
                        color="text-green-600"
                    />
                    <MetricCard 
                        title="Total Discount" 
                        value={formatCurrency(metrics.total_discount)} 
                        subValue="Given to Distributors"
                        color="text-red-500"
                    />
                    <MetricCard 
                        title="Marketing Support" 
                        value={formatCurrency(metrics.marketing_support)} 
                        subValue="Invested"
                        color="text-blue-600"
                    />
                    <MetricCard 
                        title="Avg Cost per Account" 
                        value={formatCurrency(metrics.cost_per_account)} 
                        subValue="Operational Cost"
                        color="text-orange-500"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Cost Breakdown */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Investment Breakdown</h3>
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

                    {/* Cost per Account Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Cost vs Sales Ratio by Account</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={costPerAccount} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="account" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 10}} interval={0} />
                                    <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(val) => `${val/1000000}M`} />
                                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} unit="%" />
                                    <Tooltip 
                                        formatter={(value, name) => [name === 'ratio' ? `${value}%` : formatCurrency(value), name === 'ratio' ? 'Cost Ratio' : 'Cost']}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="cost" name="Cost Value" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={30} />
                                    <Bar yAxisId="right" dataKey="ratio" name="Cost Ratio %" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Monthly Trend Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Monthly Investment & Margin Trend</h3>
                            <p className="text-sm text-gray-500">Tracking financial performance over selected period</p>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={monthlyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                                <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(val) => `${val/1000000}M`} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} unit="%" />
                                <Tooltip 
                                    formatter={(value, name) => [name === 'roi' ? `${value}%` : formatCurrency(value), name === 'roi' ? 'ROI' : (name === 'investment' ? 'Investment' : 'Margin')]}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend />
                                <Bar yAxisId="left" dataKey="investment" name="Investment" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                                <Bar yAxisId="left" dataKey="margin" name="Margin" fill="#10B981" radius={[4, 4, 0, 0]} barSize={30} />
                                <Line yAxisId="right" type="monotone" dataKey="roi" name="ROI %" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
