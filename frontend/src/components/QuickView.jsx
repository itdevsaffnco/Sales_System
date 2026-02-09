import React, { useState } from 'react';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function QuickView() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 11, 30), // 30 Dec 2025
        end: new Date(2026, 0, 28)     // 28 Jan 2026
    });
    const [selectedChannel, setSelectedChannel] = useState('All Channels');
    const [productSortBy, setProductSortBy] = useState('item_sold'); // 'item_sold' or 'gmv'

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

    const channels = ['All Channels', 'Shopee', 'Tiktok', 'Tokopedia', 'Lazada', 'Blibli', 'Zalora', 'Website', 'Whatsapp'];

    // Mock Data for Monthly Trends (Last 12 Months)
    const monthlyData = [
        { month: 'Feb', visitors: 32000, gmv: 85000000, orders: 550 },
        { month: 'Mar', visitors: 34000, gmv: 92000000, orders: 620 },
        { month: 'Apr', visitors: 31000, gmv: 88000000, orders: 580 },
        { month: 'May', visitors: 38000, gmv: 105000000, orders: 710 },
        { month: 'Jun', visitors: 42000, gmv: 118000000, orders: 790 },
        { month: 'Jul', visitors: 40000, gmv: 112000000, orders: 750 },
        { month: 'Aug', visitors: 44000, gmv: 125000000, orders: 820 },
        { month: 'Sep', visitors: 46000, gmv: 130000000, orders: 880 },
        { month: 'Oct', visitors: 43000, gmv: 122000000, orders: 810 },
        { month: 'Nov', visitors: 48000, gmv: 138000000, orders: 920 },
        { month: 'Dec', visitors: 52000, gmv: 145000000, orders: 980 },
        { month: 'Jan', visitors: 45200, gmv: 125000000, orders: 850 },
    ];

    // Mock Data Metrics
    const metrics = {
        visitors: { value: 45200, growth_dod: 5.2, growth_mom: 12.5, growth_yoy: 8.4 },
        gmv: { value: 125000000, growth_dod: -2.1, growth_mom: 15.3, growth_yoy: 20.1 },
        orders: { value: 850, growth_dod: 1.5, growth_mom: 10.2, growth_yoy: 5.5 },
        aov: { value: 147058 }, // Calculated from GMV / Orders
        conversion_rate: { value: 1.88 }, // Calculated from Orders / Visitors * 100
        total_discount: { value: 15000000 }
    };

    const topProducts = [
        { rank: 1, name: 'Saff & Co. Extrait de Parfum - SOTB', sold: 120, gmv: 36000000, image: 'https://via.placeholder.com/40' },
        { rank: 2, name: 'Saff & Co. Extrait de Parfum - COCO', sold: 95, gmv: 28500000, image: 'https://via.placeholder.com/40' },
        { rank: 3, name: 'Saff & Co. Extrait de Parfum - LOUI', sold: 80, gmv: 24000000, image: 'https://via.placeholder.com/40' },
        { rank: 4, name: 'Saff & Co. Extrait de Parfum - OMNIA', sold: 65, gmv: 19500000, image: 'https://via.placeholder.com/40' },
        { rank: 5, name: 'Saff & Co. Extrait de Parfum - TROUPE', sold: 50, gmv: 15000000, image: 'https://via.placeholder.com/40' },
    ];

    const sortedProducts = [...topProducts].sort((a, b) => {
        if (productSortBy === 'item_sold') return b.sold - a.sold;
        return b.gmv - a.gmv;
    });

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    const formatNumber = (value) => {
        return new Intl.NumberFormat('id-ID').format(value);
    };

    const GrowthIndicator = ({ label, value }) => (
        <div className="flex items-center text-xs mt-1">
            <span className="text-gray-500 mr-1">{label}:</span>
            <span className={`font-medium ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {value >= 0 ? '+' : ''}{value}%
            </span>
        </div>
    );

    const MiniChart = ({ dataKey, color, tooltipLabel }) => (
        <div className="h-24 mt-4 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.1}/>
                            <stop offset="95%" stopColor={color} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', fontSize: '12px', padding: '4px 8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
                        itemStyle={{ color: '#374151' }}
                        cursor={{ stroke: color, strokeWidth: 1 }}
                        formatter={(value) => [dataKey === 'gmv' ? formatCurrency(value) : formatNumber(value), tooltipLabel]}
                    />
                    <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#9CA3AF' }} 
                        interval={2}
                    />
                    <Area 
                        type="monotone" 
                        dataKey={dataKey} 
                        stroke={color} 
                        fillOpacity={1} 
                        fill={`url(#color${dataKey})`} 
                        strokeWidth={2} 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );

    return (
        <div className="flex-1 bg-gray-50 p-8 overflow-y-auto h-full pb-64">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Quickview</h1>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Channel Filter */}
                    <div className="relative">
                        <select 
                            value={selectedChannel}
                            onChange={(e) => setSelectedChannel(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
                        >
                            {channels.map(channel => (
                                <option key={channel} value={channel}>{channel}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>

                    {/* Date Picker */}
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
                            <DateRangePicker 
                                onClose={() => setShowDatePicker(false)} 
                                onApply={handleDateApply} 
                                align="right"
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Visitors / Page Views */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Visitors / Page Views</h3>
                    <div className="flex items-baseline mb-4">
                        <span className="text-3xl font-bold text-gray-900">{formatNumber(metrics.visitors.value)}</span>
                    </div>
                    <div className="space-y-1">
                        <GrowthIndicator label="DoD" value={metrics.visitors.growth_dod} />
                        <GrowthIndicator label="MoM" value={metrics.visitors.growth_mom} />
                        <GrowthIndicator label="YoY" value={metrics.visitors.growth_yoy} />
                    </div>
                    <MiniChart dataKey="visitors" color="#3B82F6" tooltipLabel="Visitors" />
                </div>

                {/* GMV */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">GMV</h3>
                    <div className="flex items-baseline mb-4">
                        <span className="text-3xl font-bold text-gray-900">{formatCurrency(metrics.gmv.value)}</span>
                    </div>
                    <div className="space-y-1">
                        <GrowthIndicator label="DoD" value={metrics.gmv.growth_dod} />
                        <GrowthIndicator label="MoM" value={metrics.gmv.growth_mom} />
                        <GrowthIndicator label="YoY" value={metrics.gmv.growth_yoy} />
                    </div>
                    <MiniChart dataKey="gmv" color="#10B981" tooltipLabel="GMV" />
                </div>

                {/* Orders */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Order</h3>
                    <div className="flex items-baseline mb-4">
                        <span className="text-3xl font-bold text-gray-900">{formatNumber(metrics.orders.value)}</span>
                    </div>
                    <div className="space-y-1">
                        <GrowthIndicator label="DoD" value={metrics.orders.growth_dod} />
                        <GrowthIndicator label="MoM" value={metrics.orders.growth_mom} />
                        <GrowthIndicator label="YoY" value={metrics.orders.growth_yoy} />
                    </div>
                    <MiniChart dataKey="orders" color="#F59E0B" tooltipLabel="Orders" />
                </div>

                {/* Average Order Value */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Average Order Value</h3>
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-gray-900">{formatCurrency(metrics.aov.value)}</span>
                        </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">GMV / Order</div>
                </div>

                {/* Conversion Rate */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Conversion Rate</h3>
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-gray-900">{metrics.conversion_rate.value}%</span>
                        </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">Order / Visitors</div>
                </div>

                {/* Total Discount Expenses */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Total Discount Expenses</h3>
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-red-600">-{formatCurrency(metrics.total_discount.value)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Performance Product */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="text-lg font-bold text-gray-900">5 Top Performance Product</h3>
                    
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setProductSortBy('item_sold')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                                productSortBy === 'item_sold' 
                                    ? 'bg-white text-gray-900 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            By Item Sold
                        </button>
                        <button
                            onClick={() => setProductSortBy('gmv')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                                productSortBy === 'gmv' 
                                    ? 'bg-white text-gray-900 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            By GMV Sales
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-16">Rank</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Item Sold</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">GMV Sales</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedProducts.map((product, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                        {formatNumber(product.sold)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                                        {formatCurrency(product.gmv)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
