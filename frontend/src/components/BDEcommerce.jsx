import React, { useState } from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function BDEcommerce() {
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
    const kpis = {
        gmv_mtd: 450000000,
        target_gmv: 500000000,
        total_orders: 3200,
        aov: 140625,
        unique_buyers: 2800,
    };

    const trafficData = [
        { source: 'Ads', visitors: 45000, conversion: 2.1 },
        { source: 'Short Video', visitors: 30000, conversion: 1.8 },
        { source: 'Live', visitors: 15000, conversion: 3.5 },
        { source: 'Affiliate', visitors: 12000, conversion: 2.9 },
        { source: 'Organic', visitors: 25000, conversion: 1.5 },
    ];

    const platformPerformance = [
        { platform: 'Shopee', gmv: 250000000, target: 280000000 },
        { platform: 'Tiktok', gmv: 150000000, target: 150000000 },
        { platform: 'Tokopedia', gmv: 50000000, target: 70000000 },
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
                        <h2 className="text-2xl font-bold text-gray-800">E-Commerce Performance</h2>
                        <p className="text-sm text-gray-500 mt-1">Online sales channels and marketing analysis</p>
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
                        subValue="Active Customers"
                        color="text-purple-600"
                    />
                    <MetricCard 
                        title="Sales Gap" 
                        value={formatCurrency(kpis.target_gmv - kpis.gmv_mtd)}
                        subValue="Remaining to Target"
                        color="text-red-500"
                    />
                </div>

                {/* Performance Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Platform Performance */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Target vs Achievement by Platform</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={platformPerformance} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" tickFormatter={(value) => `${value / 1000000}M`} />
                                    <YAxis dataKey="platform" type="category" width={80} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                    <Bar dataKey="gmv" name="Actual GMV" fill="#3B82F6" />
                                    <Bar dataKey="target" name="Target" fill="#E5E7EB" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Traffic & Conversion */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Traffic Source & Conversion Rate</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trafficData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="source" />
                                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" unit="%" />
                                    <Tooltip />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="visitors" name="Visitors" fill="#8884d8" />
                                    <Bar yAxisId="right" dataKey="conversion" name="Conversion Rate (%)" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
