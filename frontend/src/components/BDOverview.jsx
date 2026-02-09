import React, { useState } from 'react';
import { format } from 'date-fns';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function BDOverview() {
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
    const channelContributionData = [
        { name: 'Ecommerce', value: 450000000, color: '#3B82F6' },
        { name: 'Offline Distributor', value: 300000000, color: '#10B981' },
        { name: 'Pop-up / Event', value: 150000000, color: '#F59E0B' },
    ];

    const monthlyTrendData = [
        { month: 'Aug', gmv: 730, target: 700, growth: 5.2 },
        { month: 'Sep', gmv: 790, target: 750, growth: 8.2 },
        { month: 'Oct', gmv: 820, target: 800, growth: 3.8 },
        { month: 'Nov', gmv: 880, target: 850, growth: 7.3 },
        { month: 'Dec', gmv: 1020, target: 950, growth: 15.9 },
        { month: 'Jan', gmv: 970, target: 980, growth: -4.9 },
    ]; // Values in Millions

    const financials = {
        total_gmv: 900000000,
        net_sales: 795000000,
        total_margin: 360000000,
        total_discount: 90000000,
        total_voucher: 15000000,
        target_gmv: 1000000000,
    };

    const topProducts = [
        { name: 'Saff & Co. SOTB', qty: 1250, value: 248750000 },
        { name: 'Saff & Co. COCO', qty: 980, value: 185220000 },
        { name: 'Saff & Co. LOUI', qty: 850, value: 160650000 },
        { name: 'Saff & Co. OMNIA', qty: 720, value: 136080000 },
        { name: 'Saff & Co. TROUPE', qty: 650, value: 122850000 },
    ];

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
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">General Overview</h2>
                        <p className="text-sm text-gray-500 mt-1">Holistic view of Sales Performance, Financials & Trends</p>
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

                    {/* 3. Trend Analysis (Middle & Right Column) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Trend Analysis (GMV vs Target)</h3>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
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
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} tickFormatter={(value) => `${value}M`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        formatter={(value, name) => [`${value} Million`, name === 'gmv' ? 'Actual GMV' : 'Target']}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Area type="monotone" dataKey="gmv" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorGmv)" name="Actual GMV" />
                                    <Area type="monotone" dataKey="target" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Target" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     {/* 4. Channel Contribution (Left) */}
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Channel Contribution</h3>
                        <div className="h-64 relative">
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
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
                                <p className="text-xs text-gray-500">Total GMV</p>
                                <p className="text-sm font-bold text-gray-800">900M</p>
                            </div>
                        </div>
                    </div>

                    {/* 5. Product Performance (Right - Col Span 2) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Top Products by Sales</h3>
                            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Name</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty Sold</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Sales</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contribution</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {topProducts.map((product, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 text-sm text-gray-800 font-medium">{product.name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600 text-right">{formatNumber(product.qty)}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800 font-bold text-right">{formatCurrency(product.value)}</td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className="text-xs text-gray-500">{((product.value / financials.total_gmv) * 100).toFixed(1)}%</span>
                                                    <div className="w-16 bg-gray-100 rounded-full h-1.5">
                                                        <div 
                                                            className="bg-blue-500 h-1.5 rounded-full" 
                                                            style={{ width: `${(product.value / financials.total_gmv) * 100 * 3}%` }} // Multiplied for visual visibility
                                                        ></div>
                                                    </div>
                                                </div>
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
