import React, { useState } from 'react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function OfficialStorePromotion() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 11, 30), // 30 Dec 2025
        end: new Date(2026, 0, 28)     // 28 Jan 2026
    });
    const [selectedStore, setSelectedStore] = useState('All Stores');

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

    const formatNumber = (value) => {
        return new Intl.NumberFormat('id-ID').format(value);
    };

    const formatPercent = (value) => {
        return `${value.toFixed(2)}%`;
    };

    // Mock Data
    const stores = ['All Stores', 'Grand Indonesia', 'Plaza Indonesia', 'Senayan City', 'Pondok Indah Mall', 'Kota Kasablanka', 'Central Park', 'Gandaria City'];

    // Aggregated Metrics Mock
    const metrics = {
        traffic: { value: 125430, growth_mom: 8.5, growth_yoy: 15.2 },
        cvr: { value: 12.5, growth_mom: 1.2, growth_yoy: 3.5 }, // Conversion Rate %
        promo_total: { value: 24, growth_mom: 4, growth_yoy: 8 }, // Total Promotions run
        activity_rate: { value: 35.8, growth_mom: 5.2, growth_yoy: 7.1 } // % of items on promo
    };

    // Chart Data Mock (Daily Traffic & CVR)
    const chartData = Array.from({ length: 14 }, (_, i) => ({
        date: format(new Date(2026, 0, 15 + i), 'd MMM'),
        traffic: Math.floor(Math.random() * 5000) + 8000,
        cvr: (Math.random() * 5 + 10).toFixed(1),
        activity: (Math.random() * 10 + 30).toFixed(1)
    }));

    // Promotion Performance Table Mock
    const promoData = [
        { id: 1, name: 'New Year Sale', type: 'Discount', store: 'All Stores', start_date: '2026-01-01', end_date: '2026-01-07', traffic: 45000, orders: 5400, cvr: 12.0, revenue: 850000000 },
        { id: 2, name: 'Payday Special', type: 'Bundle', store: 'Grand Indonesia', start_date: '2026-01-25', end_date: '2026-01-28', traffic: 12000, orders: 1800, cvr: 15.0, revenue: 320000000 },
        { id: 3, name: 'Weekend Flash Sale', type: 'Flash Sale', store: 'Kota Kasablanka', start_date: '2026-01-10', end_date: '2026-01-11', traffic: 8500, orders: 1100, cvr: 12.9, revenue: 150000000 },
        { id: 4, name: 'Member Exclusive', type: 'Voucher', store: 'Plaza Indonesia', start_date: '2026-01-15', end_date: '2026-01-31', traffic: 15000, orders: 2500, cvr: 16.6, revenue: 450000000 },
        { id: 5, name: 'Clearance', type: 'Discount', store: 'Central Park', start_date: '2026-01-01', end_date: '2026-01-31', traffic: 22000, orders: 2200, cvr: 10.0, revenue: 280000000 },
    ];

    const GrowthIndicator = ({ label, value }) => (
        <div className="flex items-center text-xs mt-1">
            <span className="text-gray-500 mr-1">{label}:</span>
            <span className={`font-medium ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {value >= 0 ? '+' : ''}{value}%
            </span>
        </div>
    );

    return (
        <div className="flex-1 bg-gray-50 p-8 overflow-y-auto h-full pb-64">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Official Store Promotion</h1>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Store Filter */}
                    <div className="relative">
                        <select
                            value={selectedStore}
                            onChange={(e) => setSelectedStore(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                        >
                            {stores.map((store) => (
                                <option key={store} value={store}>{store}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </div>
                    </div>

                    {/* Date Picker (Calendar Filter) */}
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

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Traffic */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Traffic (Visitors)</h3>
                    <div className="flex items-baseline mb-4">
                        <span className="text-2xl font-bold text-gray-900">{formatNumber(metrics.traffic.value)}</span>
                    </div>
                    <div className="space-y-1">
                        <GrowthIndicator label="MoM" value={metrics.traffic.growth_mom} />
                        <GrowthIndicator label="YoY" value={metrics.traffic.growth_yoy} />
                    </div>
                </div>

                {/* Conversion Rate */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Conversion Rate (CVR)</h3>
                    <div className="flex items-baseline mb-4">
                        <span className="text-2xl font-bold text-gray-900">{formatPercent(metrics.cvr.value)}</span>
                    </div>
                    <div className="space-y-1">
                        <GrowthIndicator label="MoM" value={metrics.cvr.growth_mom} />
                        <GrowthIndicator label="YoY" value={metrics.cvr.growth_yoy} />
                    </div>
                </div>

                {/* Promotion Total */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Promotion Total</h3>
                    <div className="flex items-baseline mb-4">
                        <span className="text-2xl font-bold text-gray-900">{metrics.promo_total.value}</span>
                        <span className="ml-2 text-sm text-gray-500">Events</span>
                    </div>
                    <div className="space-y-1">
                        <GrowthIndicator label="MoM" value={metrics.promo_total.growth_mom} />
                        <GrowthIndicator label="YoY" value={metrics.promo_total.growth_yoy} />
                    </div>
                </div>

                {/* Activity Rate */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Activity Rate</h3>
                    <div className="flex items-baseline mb-4">
                        <span className="text-2xl font-bold text-gray-900">{formatPercent(metrics.activity_rate.value)}</span>
                        <span className="ml-2 text-sm text-gray-500">Items on Promo</span>
                    </div>
                    <div className="space-y-1">
                        <GrowthIndicator label="MoM" value={metrics.activity_rate.growth_mom} />
                        <GrowthIndicator label="YoY" value={metrics.activity_rate.growth_yoy} />
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Traffic vs Conversion Trend</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" unit="%" />
                            <Tooltip />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="traffic" name="Traffic" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            <Line yAxisId="right" type="monotone" dataKey="cvr" name="CVR %" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Promotion Details Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">Active Promotions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Promotion Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Store</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Period</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Traffic</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Orders</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">CVR</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {promoData.map((promo) => (
                                <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{promo.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                            {promo.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{promo.store}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(new Date(promo.start_date), 'd MMM')} - {format(new Date(promo.end_date), 'd MMM')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatNumber(promo.traffic)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatNumber(promo.orders)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatPercent(promo.cvr)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}