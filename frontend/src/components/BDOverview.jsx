import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function BDOverview() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 11, 30),
        end: new Date(2026, 0, 28)
    });
    const [selectedChannel, setSelectedChannel] = useState('All Channels');

    const channelOptions = ['All Channels', 'E-Commerce', 'Offline Distributor', 'Offline (Pop Up & Event)'];

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

    // Filtered Data Logic
    const { financials, monthlyTrendData, channelContributionData } = useMemo(() => {
        let multiplier = 1;
        
        switch(selectedChannel) {
            case 'E-Commerce': multiplier = 0.5; break;
            case 'Offline Distributor': multiplier = 0.3; break;
            case 'Offline (Pop Up & Event)': multiplier = 0.2; break;
            default: multiplier = 1;
        }

        const financials = {
            total_gmv: 900000000 * multiplier,
            net_sales: 795000000 * multiplier,
            total_margin: 360000000 * multiplier,
            total_discount: 90000000 * multiplier,
            total_voucher: 15000000 * multiplier,
            target_gmv: 1000000000 * multiplier,
        };

        const monthlyTrendData = [
            { month: 'Aug', gmv: 730 * multiplier, target: 700 * multiplier, growth: 5.2 },
            { month: 'Sep', gmv: 790 * multiplier, target: 750 * multiplier, growth: 8.2 },
            { month: 'Oct', gmv: 820 * multiplier, target: 800 * multiplier, growth: 3.8 },
            { month: 'Nov', gmv: 880 * multiplier, target: 850 * multiplier, growth: 7.3 },
            { month: 'Dec', gmv: 1020 * multiplier, target: 950 * multiplier, growth: 15.9 },
            { month: 'Jan', gmv: 970 * multiplier, target: 980 * multiplier, growth: -4.9 },
        ];

        let channelContributionData = [];
        if (selectedChannel === 'All Channels') {
             channelContributionData = [
                { name: 'Ecommerce', value: 450000000, color: '#3B82F6' },
                { name: 'Offline Distributor', value: 300000000, color: '#10B981' },
                { name: 'Pop-up / Event', value: 150000000, color: '#F59E0B' },
            ];
        } else {
             // If a specific channel is selected, maybe show breakdown by category or region (Mock)
             const baseVal = 900000000 * multiplier;
             channelContributionData = [
                { name: 'Fragrance', value: baseVal * 0.45, color: '#EC4899' },
                { name: 'Body Care', value: baseVal * 0.35, color: '#8B5CF6' },
                { name: 'Bundles', value: baseVal * 0.20, color: '#F59E0B' },
            ];
        }

        return { financials, monthlyTrendData, channelContributionData };
    }, [selectedChannel]);

    const MetricCard = ({ title, value, subValue, subLabel, color, icon }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                {subValue && (
                    <p className={`text-xs mt-2 font-medium ${color || 'text-gray-500'}`}>
                        {subValue} <span className="text-gray-400 font-normal ml-1">{subLabel}</span>
                    </p>
                )}
            </div>
            {icon && <div className={`p-3 rounded-lg ${icon.bg} ${icon.text}`}>{icon.svg}</div>}
        </div>
    );

    const FinancialCard = ({ label, value, subValue, color }) => (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-lg font-bold text-gray-800 mt-1">{value}</p>
            </div>
            <div className={`text-right ${color}`}>
                <p className="text-xs font-medium">{subValue}</p>
            </div>
        </div>
    );

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">General Overview</h2>
                        <p className="text-sm text-gray-500 mt-1">Holistic view of Sales Performance, Financials & Trends</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                         {/* Channel Filter */}
                         <div className="relative w-full sm:w-auto">
                            <select
                                value={selectedChannel}
                                onChange={(e) => setSelectedChannel(e.target.value)}
                                className="w-full sm:w-auto appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium text-gray-700 cursor-pointer"
                            >
                                {channelOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Date Picker */}
                        <div className="relative w-full sm:w-auto">
                            <div 
                                className="flex items-center justify-between sm:justify-start bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm cursor-pointer hover:bg-gray-50"
                                onClick={() => setShowDatePicker(!showDatePicker)}
                            >
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">{formatDateRange()}</span>
                                </div>
                            </div>
                            {showDatePicker && (
                                <div className="absolute right-0 z-10 mt-2">
                                    <DateRangePicker 
                                        onClose={() => setShowDatePicker(false)} 
                                        onApply={handleDateApply} 
                                        align="right"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 1. Sales Performance & Target (Top Row) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard 
                        title="Sales GMV" 
                        value={formatCurrency(financials.total_gmv)} 
                        subValue={`${((financials.total_gmv / financials.target_gmv) * 100).toFixed(1)}%`}
                        subLabel="of Target"
                        color="text-blue-600"
                        icon={{
                            bg: 'bg-blue-50', text: 'text-blue-600',
                            svg: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        }}
                    />
                    <MetricCard 
                        title="Sales Gap" 
                        value={formatCurrency(financials.target_gmv - financials.total_gmv)}
                        subValue="Remaining to Target"
                        subLabel=""
                        color="text-orange-500"
                        icon={{
                            bg: 'bg-orange-50', text: 'text-orange-500',
                            svg: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        }}
                    />
                    <MetricCard 
                        title="Net Sales" 
                        value={formatCurrency(financials.net_sales)}
                        subValue="After Disc. & Voucher"
                        color="text-green-600"
                        icon={{
                            bg: 'bg-green-50', text: 'text-green-600',
                            svg: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        }}
                    />
                    <MetricCard 
                        title="Total Transactions" 
                        value="12,450"
                        subValue="+8.5%"
                        subLabel="vs Last Month"
                        color="text-purple-600"
                        icon={{
                            bg: 'bg-purple-50', text: 'text-purple-600',
                            svg: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* 2. Financials Breakdown (Left Column) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Financials Breakdown</h3>
                        <div className="space-y-4">
                            <FinancialCard 
                                label="Total Margin" 
                                value={formatCurrency(financials.total_margin)} 
                                subValue={`${((financials.total_margin / financials.net_sales) * 100).toFixed(1)}%`}
                                color="text-green-600"
                            />
                            <FinancialCard 
                                label="Total Discount" 
                                value={formatCurrency(financials.total_discount)} 
                                subValue={`${((financials.total_discount / financials.total_gmv) * 100).toFixed(1)}%`}
                                color="text-red-500"
                            />
                            <FinancialCard 
                                label="Total Voucher" 
                                value={formatCurrency(financials.total_voucher)} 
                                subValue={`${((financials.total_voucher / financials.total_gmv) * 100).toFixed(1)}%`}
                                color="text-red-500"
                            />
                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Net Sales Ratio</span>
                                    <span className="text-gray-800 font-bold">{((financials.net_sales / financials.total_gmv) * 100).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(financials.net_sales / financials.total_gmv) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Trend Analysis (Middle Column - Spans 2) */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Trend Analysis (GMV vs Target)</h3>
                            <div className="flex items-center space-x-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    +15.9% YoY
                                </span>
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(value) => `${value/1000}M`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        formatter={(value) => formatCurrency(value * 1000000)}
                                    />
                                    <Legend verticalAlign="top" height={36} iconType="circle" />
                                    <Area type="monotone" dataKey="gmv" name="Actual GMV" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorGmv)" />
                                    <Area type="monotone" dataKey="target" name="Target" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     {/* 4. Channel Contribution */}
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Channel Contribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={channelContributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {channelContributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}