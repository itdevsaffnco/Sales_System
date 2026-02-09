import React, { useState } from 'react';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function OfficialStoreOverview() {
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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    const formatNumber = (value) => {
        return new Intl.NumberFormat('id-ID').format(value);
    };

    const formatPercent = (value) => {
        return `${value.toFixed(1)}%`;
    };

    // Mock Data for Store Performance
    const allStoreData = [
        { id: 1, name: 'Grand Indonesia', sales: 185000000, qty: 2500, target: 200000000, ach: 92.5, gap: 15000000, growth_mom: 5.4, growth_yoy: 12.1, contribution: 21.7 },
        { id: 2, name: 'Plaza Indonesia', sales: 165000000, qty: 2200, target: 180000000, ach: 91.6, gap: 15000000, growth_mom: 4.2, growth_yoy: 10.5, contribution: 19.4 },
        { id: 3, name: 'Senayan City', sales: 145000000, qty: 1900, target: 160000000, ach: 90.6, gap: 15000000, growth_mom: 3.8, growth_yoy: 9.2, contribution: 17.0 },
        { id: 4, name: 'Pondok Indah Mall', sales: 125000000, qty: 1600, target: 150000000, ach: 83.3, gap: 25000000, growth_mom: -2.1, growth_yoy: 5.4, contribution: 14.7 },
        { id: 5, name: 'Kota Kasablanka', sales: 110000000, qty: 1400, target: 140000000, ach: 78.5, gap: 30000000, growth_mom: -1.5, growth_yoy: 4.1, contribution: 12.9 },
        { id: 6, name: 'Central Park', sales: 85000000, qty: 1100, target: 120000000, ach: 70.8, gap: 35000000, growth_mom: -5.4, growth_yoy: 2.1, contribution: 10.0 },
        { id: 7, name: 'Gandaria City', sales: 35000000, qty: 1800, target: 50000000, ach: 70.0, gap: 15000000, growth_mom: 1.2, growth_yoy: 3.5, contribution: 4.1 },
    ];

    const stores = ['All Stores', ...allStoreData.map(s => s.name)];

    // Filter Logic
    const filteredStoreData = selectedStore === 'All Stores' 
        ? allStoreData 
        : allStoreData.filter(s => s.name === selectedStore);

    // Calculate aggregated metrics based on filtered data
    const totalSales = filteredStoreData.reduce((acc, curr) => acc + curr.sales, 0);
    const totalQty = filteredStoreData.reduce((acc, curr) => acc + curr.qty, 0);
    const totalTarget = filteredStoreData.reduce((acc, curr) => acc + curr.target, 0);
    const totalGap = totalTarget - totalSales;
    const totalAch = totalTarget > 0 ? (totalSales / totalTarget) * 100 : 0;
    const atvValue = totalQty > 0 ? totalSales / totalQty : 0; // Simple ATV calculation

    const metrics = {
        sales_value: { value: totalSales, growth_mom: 12.5, growth_yoy: 8.4 },
        qty: { value: totalQty, growth_mom: 5.2, growth_yoy: 3.1 },
        target: { value: totalTarget },
        gap_sales: { value: totalGap },
        achievement: { value: totalAch },
        atv: { value: atvValue, growth_mom: 6.9, growth_yoy: 5.1 } // Added ATV
    };

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
                <h1 className="text-3xl font-bold text-gray-900">Official Store Overview</h1>
                
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

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {/* Sales Value */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Total Sales Value</h3>
                    <div className="flex items-baseline mb-4">
                        <span className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.sales_value.value)}</span>
                    </div>
                    <div className="space-y-1">
                        <GrowthIndicator label="MoM" value={metrics.sales_value.growth_mom} />
                        <GrowthIndicator label="YoY" value={metrics.sales_value.growth_yoy} />
                    </div>
                </div>

                {/* Achievement vs Target */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Achievement vs Target</h3>
                    <div className="flex items-baseline mb-4">
                        <span className={`text-2xl font-bold ${metrics.achievement.value >= 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {metrics.achievement.value.toFixed(1)}%
                        </span>
                        <span className="ml-2 text-sm text-gray-500">of {formatCurrency(metrics.target.value)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className={`h-2.5 rounded-full ${metrics.achievement.value >= 100 ? 'bg-green-600' : 'bg-yellow-500'}`} 
                            style={{ width: `${Math.min(metrics.achievement.value, 100)}%` }}
                        ></div>
                    </div>
                </div>

                {/* Gap Sales */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Gap Sales</h3>
                    <div className="flex items-baseline mb-4">
                        <span className="text-2xl font-bold text-red-600">-{formatCurrency(metrics.gap_sales.value)}</span>
                    </div>
                    <div className="text-xs text-gray-500">Remaining to hit target</div>
                </div>

                 {/* Quantity */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Total Quantity</h3>
                    <div className="flex items-baseline mb-4">
                        <span className="text-2xl font-bold text-gray-900">{formatNumber(metrics.qty.value)}</span>
                    </div>
                    <div className="space-y-1">
                        <GrowthIndicator label="MoM" value={metrics.qty.growth_mom} />
                        <GrowthIndicator label="YoY" value={metrics.qty.growth_yoy} />
                    </div>
                </div>

                {/* ATV (Average Transaction Value) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">ATV</h3>
                    <div className="flex items-baseline mb-4">
                        <span className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.atv.value)}</span>
                    </div>
                    <div className="space-y-1">
                        <GrowthIndicator label="MoM" value={metrics.atv.growth_mom} />
                        <GrowthIndicator label="YoY" value={metrics.atv.growth_yoy} />
                    </div>
                </div>
            </div>

            {/* Store Performance Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">Store Performance Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Store Name</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Sales Value</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Contribution</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Qty</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Target</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ach %</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Gap</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Growth (MoM/YoY)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStoreData.map((store) => (
                                <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {store.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                        {formatCurrency(store.sales)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                        {formatPercent(store.contribution)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                        {formatNumber(store.qty)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                        {formatCurrency(store.target)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${store.ach >= 90 ? 'bg-green-100 text-green-800' : store.ach >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                            {formatPercent(store.ach)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">
                                        -{formatCurrency(store.gap)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                        <div className="flex flex-col items-end">
                                            <span className={store.growth_mom >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                {store.growth_mom >= 0 ? '+' : ''}{store.growth_mom}% (MoM)
                                            </span>
                                            <span className={`text-xs ${store.growth_yoy >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {store.growth_yoy >= 0 ? '+' : ''}{store.growth_yoy}% (YoY)
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top Store Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Top Store Contribution</h3>
                    <div className="space-y-4">
                        {filteredStoreData.slice(0, 5).map((store, index) => (
                             <div key={store.id} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="w-6 text-sm font-bold text-gray-400">#{index + 1}</span>
                                    <span className="text-sm font-medium text-gray-900 ml-2">{store.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-900 font-semibold">{formatCurrency(store.sales)}</span>
                                    <span className="text-xs text-gray-500 w-12 text-right">{store.contribution}%</span>
                                </div>
                             </div>
                        ))}
                    </div>
                 </div>
                 
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-center">
                    <p className="text-gray-400 text-sm">Select a store to view detailed SKU analysis</p>
                 </div>
            </div>
        </div>
    );
}