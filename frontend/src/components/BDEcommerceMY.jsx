import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    Legend, PieChart, Pie, Cell, AreaChart, Area, LabelList
} from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function BDEcommerceMY() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 11, 30),
        end: new Date(2026, 0, 28)
    });
    const [platformFilter, setPlatformFilter] = useState('All');

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
        return new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR', minimumFractionDigits: 0 }).format(value);
    };

    const formatNumber = (value) => {
        return new Intl.NumberFormat('ms-MY').format(value);
    };

    // Mock Data for MY Market
    const kpisAll = {
        gmv_mtd: 850000, // MYR
        target_gmv: 1000000,
        total_orders: 12500,
        aov: 68,
        unique_buyers: 9800,
        sales_gap: 150000,
        growth_mom: 12.5,
        growth_yoy: 25.4
    };

    const kpisShopee = {
        gmv_mtd: 550000,
        target_gmv: 600000,
        total_orders: 8200,
        aov: 67,
        unique_buyers: 6500,
        sales_gap: 50000,
        growth_mom: 10.2,
        growth_yoy: 22.1
    };

    const kpisTiktok = {
        gmv_mtd: 300000,
        target_gmv: 400000,
        total_orders: 4300,
        aov: 70,
        unique_buyers: 3300,
        sales_gap: 100000,
        growth_mom: 15.8,
        growth_yoy: 28.5
    };

    const kpis = platformFilter === 'Shopee' ? kpisShopee : platformFilter === 'Tiktok' ? kpisTiktok : kpisAll;

    // Mock Trend Data for Graphic Cards
    const trendData = [
        { month: 'Aug', value: 100 },
        { month: 'Sep', value: 120 },
        { month: 'Oct', value: 110 },
        { month: 'Nov', value: 140 },
        { month: 'Dec', value: 150 },
        { month: 'Jan', value: 160 },
    ];

    const allChannelPerformance = [
        { name: 'Shopee', value: 550000, target: 600000, orders: 8200, contribution: 64.7 },
        { name: 'Tiktok', value: 300000, target: 400000, orders: 4300, contribution: 35.3 },
    ].map(item => ({
        ...item,
        achievement: ((item.value / item.target) * 100).toFixed(1)
    }));

    const channelPerformance = platformFilter === 'All' 
        ? allChannelPerformance 
        : allChannelPerformance.filter(c => c.name === platformFilter);

    const rawTrafficData = [
        { source: 'Ads', visitors: 150000, conversion: 1.8, contribution: 45 },
        { source: 'Short Video', visitors: 85000, conversion: 2.5, contribution: 25 },
        { source: 'Live', visitors: 45000, conversion: 4.2, contribution: 20 },
        { source: 'Affiliate', visitors: 35000, conversion: 3.1, contribution: 10 },
    ];

    const trafficMultiplier = platformFilter === 'Shopee' ? 0.65 : platformFilter === 'Tiktok' ? 0.35 : 1;
    const trafficData = rawTrafficData.map(d => ({
        ...d,
        visitors: Math.round(d.visitors * trafficMultiplier),
    }));

    const allTopProducts = [
        { name: 'Hijab Instan Premium', platform: 'Shopee', qty: 1200, value: 42000, contribution: 15 },
        { name: 'Gamis Modern Style', platform: 'Tiktok', qty: 850, value: 76500, contribution: 12 },
        { name: 'Tunik Casual', platform: 'Shopee', qty: 900, value: 45000, contribution: 10 },
        { name: 'Mukena Travel', platform: 'Shopee', qty: 600, value: 54000, contribution: 8 },
        { name: 'Pashmina Plisket', platform: 'Tiktok', qty: 1100, value: 33000, contribution: 7 },
    ];

    const topProducts = platformFilter === 'All'
        ? allTopProducts
        : allTopProducts.filter(p => p.platform === platformFilter);

    const COLORS = ['#EE4D2D', '#000000']; // Shopee Orange, Tiktok Black

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

    const TrendCard = ({ title, value, subLabel, color, data, stroke, dataKey = "value" }) => {
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
                        <h2 className="text-2xl font-bold text-gray-800">E-Commerce MY Performance</h2>
                        <p className="text-sm text-gray-500 mt-1">Malaysia Market Overview</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                            {['All', 'Shopee', 'Tiktok'].map(platform => (
                                <button
                                    key={platform}
                                    onClick={() => setPlatformFilter(platform)}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                                        platformFilter === platform 
                                            ? 'bg-gray-100 text-gray-900 shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {platform}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                        <div 
                            className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
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
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <MetricCard 
                        title="GMV MTD" 
                        value={formatCurrency(kpis.gmv_mtd)} 
                        subValue={`${((kpis.gmv_mtd / kpis.target_gmv) * 100).toFixed(1)}%`}
                        subLabel="of Target"
                        color={kpis.gmv_mtd >= kpis.target_gmv ? 'text-green-600' : 'text-yellow-600'}
                    />
                    <MetricCard 
                        title="Total Orders" 
                        value={formatNumber(kpis.total_orders)}
                        subValue={formatCurrency(kpis.aov)}
                        subLabel="AOV"
                        color="text-blue-600"
                    />
                    <MetricCard 
                        title="Unique Buyers" 
                        value={formatNumber(kpis.unique_buyers)}
                        subValue="Filtered by Location"
                        color="text-purple-600"
                    />
                    <MetricCard 
                        title="Sales Gap" 
                        value={formatCurrency(kpis.sales_gap)}
                        subValue="To Reach Target"
                        color="text-red-500"
                    />
                    <TrendCard 
                        title="Growth MoM" 
                        value={`${kpis.growth_mom > 0 ? '+' : ''}${kpis.growth_mom}%`}
                        subLabel="Month on Month"
                        color={kpis.growth_mom > 0 ? 'text-green-600' : 'text-red-500'}
                        data={trendData}
                        stroke={kpis.growth_mom > 0 ? '#10B981' : '#EF4444'}
                    />
                    <TrendCard 
                        title="Growth YoY" 
                        value={`${kpis.growth_yoy > 0 ? '+' : ''}${kpis.growth_yoy}%`}
                        subLabel="Year on Year"
                        color={kpis.growth_yoy > 0 ? 'text-green-600' : 'text-red-500'}
                        data={trendData}
                        stroke={kpis.growth_yoy > 0 ? '#10B981' : '#EF4444'}
                    />
                </div>

                {/* Channel Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Channel Contribution Pie */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Channel Contribution</h3>
                        <div className="h-64 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={channelPerformance}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {channelPerformance.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center mt-[-20px]">
                                    <p className="text-xs text-gray-500">Total GMV</p>
                                    <p className="text-sm font-bold text-gray-800">{formatNumber(kpis.gmv_mtd / 1000)}K</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Target vs Achievement */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Target vs Achievement by Channel</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={channelPerformance} layout="vertical" margin={{ top: 5, right: 60, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                    <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}K`} />
                                    <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        cursor={{ fill: '#F3F4F6' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        formatter={(value) => formatCurrency(value)}
                                    />
                                    <Legend />
                                    <Bar dataKey="value" name="Actual GMV" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20}>
                                        <LabelList 
                                            dataKey="achievement" 
                                            position="right" 
                                            formatter={(value) => `${value}%`}
                                            style={{ fill: '#374151', fontSize: '12px', fontWeight: '600' }}
                                        />
                                    </Bar>
                                    <Bar dataKey="target" name="Target" fill="#E5E7EB" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Traffic & Marketing */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Traffic & Marketing Activity</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trafficData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="source" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} tickFormatter={(value) => `${value/1000}K`} />
                                    <Tooltip 
                                        cursor={{ fill: '#F3F4F6' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="visitors" name="Visitors" fill="#8B5CF6" radius={[4, 4, 0, 0]}>
                                        <LabelList 
                                            dataKey="visitors" 
                                            position="top" 
                                            formatter={(value) => `${(value / 1000).toFixed(1)}K`}
                                            style={{ fill: '#374151', fontSize: '12px', fontWeight: '600' }}
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Conversion Rate per Activity</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trafficData} layout="vertical" margin={{ top: 5, right: 60, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                    <XAxis type="number" unit="%" axisLine={false} tickLine={false} />
                                    <YAxis dataKey="source" type="category" width={80} axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        cursor={{ fill: '#F3F4F6' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        formatter={(value) => `${value}%`}
                                    />
                                    <Bar dataKey="conversion" name="Conversion Rate" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Product Performance Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h3 className="text-lg font-bold text-gray-800">Product Performance</h3>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded-full cursor-pointer hover:bg-gray-200">Filter by Qty</span>
                            <span className="px-3 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded-full cursor-pointer hover:bg-gray-200">Filter by Value</span>
                            <span className="px-3 py-1 bg-blue-50 text-xs font-medium text-blue-600 rounded-full cursor-pointer border border-blue-100">All Platforms</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Name</th>
                                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Platform</th>
                                    <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty Sold</th>
                                    <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sales Value</th>
                                    <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">% Contribution</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {topProducts.map((product, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 text-sm text-gray-800 font-medium">{product.name}</td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                product.platform === 'Shopee' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {product.platform}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600 text-right">{formatNumber(product.qty)}</td>
                                        <td className="py-4 px-6 text-sm text-gray-800 font-bold text-right">{formatCurrency(product.value)}</td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="text-xs text-gray-500">{product.contribution}%</span>
                                                <div className="w-16 bg-gray-100 rounded-full h-1.5">
                                                    <div 
                                                        className="bg-blue-500 h-1.5 rounded-full" 
                                                        style={{ width: `${product.contribution}%` }}
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
    );
}
