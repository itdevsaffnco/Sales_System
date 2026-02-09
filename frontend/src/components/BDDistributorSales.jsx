import React, { useState } from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell, ComposedChart, AreaChart, Area } from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function BDDistributorSales() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 11, 30),
        end: new Date(2026, 0, 28)
    });

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

    const formatNumber = (value) => {
        return new Intl.NumberFormat('id-ID').format(value);
    };

    // Mock Data
    const metrics = {
        sales_value: 450000000,
        sales_qty: 12500,
        contribution_percent: 35, // Contribution to total offline sales
        target_achievement: 95.2,
        growth_mom: 8.5,
        growth_yoy: 15.4
    };

    const growthTrend = [
        { month: 'Aug', sales: 320, target: 300, growth: 5 },
        { month: 'Sep', sales: 340, target: 320, growth: 6.2 },
        { month: 'Oct', sales: 330, target: 330, growth: -2.9 },
        { month: 'Nov', sales: 380, target: 350, growth: 15.1 },
        { month: 'Dec', sales: 420, target: 400, growth: 10.5 },
        { month: 'Jan', sales: 450, target: 470, growth: 7.1 },
    ]; // In Millions

    const salesPerAccount = [
        { account: 'Distributor A', value: 120000000, contribution: 26.6 },
        { account: 'Distributor B', value: 95000000, contribution: 21.1 },
        { account: 'Distributor C', value: 80000000, contribution: 17.7 },
        { account: 'Distributor D', value: 65000000, contribution: 14.4 },
        { account: 'Distributor E', value: 50000000, contribution: 11.1 },
        { account: 'Others', value: 40000000, contribution: 9.1 },
    ];

    const distributorComparison = [
        { month: 'Aug', 'Distributor A': 80, 'Distributor B': 70, 'Distributor C': 60, 'Distributor D': 50, 'Distributor E': 40 },
        { month: 'Sep', 'Distributor A': 85, 'Distributor B': 75, 'Distributor C': 65, 'Distributor D': 55, 'Distributor E': 45 },
        { month: 'Oct', 'Distributor A': 82, 'Distributor B': 72, 'Distributor C': 62, 'Distributor D': 52, 'Distributor E': 42 },
        { month: 'Nov', 'Distributor A': 95, 'Distributor B': 85, 'Distributor C': 70, 'Distributor D': 60, 'Distributor E': 50 },
        { month: 'Dec', 'Distributor A': 110, 'Distributor B': 95, 'Distributor C': 80, 'Distributor D': 65, 'Distributor E': 55 },
        { month: 'Jan', 'Distributor A': 120, 'Distributor B': 95, 'Distributor C': 80, 'Distributor D': 65, 'Distributor E': 50 },
    ];

    const MetricCard = ({ title, value, subValue, subLabel, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            {subValue && (
                <p className={`text-xs mt-2 font-medium ${color || 'text-gray-500'}`}>
                    {subValue} <span className="text-gray-400 font-normal ml-1">{subLabel}</span>
                </p>
            )}
        </div>
    );

    const TrendCard = ({ title, value, subLabel, color, data, dataKey, stroke }) => {
        const isPositive = value.includes('+');
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">
                <div className="p-6 pb-0 relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                            </div>
                        </div>
                        <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
                            {isPositive ? (
                                <svg className={`w-5 h-5 ${isPositive ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            ) : (
                                <svg className={`w-5 h-5 ${isPositive ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                            )}
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{subLabel}</p>
                </div>
                
                <div className="h-24 w-full mt-2">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id={`gradient-${title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={stroke} stopOpacity={0.2}/>
                                    <stop offset="100%" stopColor={stroke} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area 
                                type="monotone" 
                                dataKey={dataKey} 
                                stroke={stroke} 
                                fill={`url(#gradient-${title.replace(/\s/g, '')})`} 
                                strokeWidth={3} 
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Distributor Sales Performance</h2>
                        <p className="text-sm text-gray-500 mt-1">Sales Value, Quantity, Target & Growth Analysis</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <MetricCard 
                            title="Sales Value" 
                            value={formatCurrency(metrics.sales_value)} 
                            subValue={`${metrics.contribution_percent}%`}
                            subLabel="Contribution"
                            color="text-blue-600"
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <MetricCard 
                            title="Sales Quantity" 
                            value={formatNumber(metrics.sales_qty)} 
                            subValue="Units Sold"
                            color="text-purple-600"
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <MetricCard 
                            title="Target Achievement" 
                            value={`${metrics.target_achievement}%`}
                            subValue="vs Target"
                            color={metrics.target_achievement >= 100 ? 'text-green-600' : 'text-orange-500'}
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <TrendCard 
                            title="Growth MoM" 
                            value={metrics.growth_mom > 0 ? `+${metrics.growth_mom}%` : `${metrics.growth_mom}%`}
                            subLabel="Month on Month"
                            color={metrics.growth_mom > 0 ? 'text-green-600' : 'text-red-500'}
                            data={growthTrend}
                            dataKey="growth"
                            stroke={metrics.growth_mom > 0 ? '#10B981' : '#EF4444'}
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <TrendCard 
                            title="Growth YoY" 
                            value={metrics.growth_yoy > 0 ? `+${metrics.growth_yoy}%` : `${metrics.growth_yoy}%`}
                            subLabel="Year on Year"
                            color={metrics.growth_yoy > 0 ? 'text-green-600' : 'text-red-500'}
                            data={growthTrend} // Using same data for visual, normally would be YoY trend
                            dataKey="growth"
                            stroke={metrics.growth_yoy > 0 ? '#10B981' : '#EF4444'}
                        />
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Sales Trend vs Target */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Sales vs Target</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={growthTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(value) => `${value}M`} />
                                    <Tooltip 
                                        formatter={(value) => [`IDR ${value} M`, '']}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="sales" name="Sales Value" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                                    <Line type="monotone" dataKey="target" name="Target" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Sales Value per Account */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Sales Value Contribution per Account</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salesPerAccount} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="account" width={100} axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 12}} />
                                    <Tooltip 
                                        formatter={(value) => formatCurrency(value)}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20}>
                                        {salesPerAccount.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'][index % 6]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Sales Comparison per Distributor */}
                    <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Sales Comparison per Distributor</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={distributorComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(value) => `${value}M`} />
                                    <Tooltip 
                                        formatter={(value) => [`IDR ${value} M`, '']}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Line type="monotone" dataKey="Distributor A" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                                    <Line type="monotone" dataKey="Distributor B" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                                    <Line type="monotone" dataKey="Distributor C" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
                                    <Line type="monotone" dataKey="Distributor D" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
                                    <Line type="monotone" dataKey="Distributor E" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
