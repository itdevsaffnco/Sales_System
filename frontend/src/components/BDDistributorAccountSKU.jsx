import React, { useState } from 'react';
import { format } from 'date-fns';
import DateRangePicker from './DateRangePicker';

export default function BDDistributorAccountSKU() {
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

    // Mock Data
    const accountPerformance = [
        { rank: 1, name: 'Distributor A', region: 'West Java', sales: 120000000, growth: 12.5, skus_active: 45 },
        { rank: 2, name: 'Distributor B', region: 'Central Java', sales: 95000000, growth: 8.2, skus_active: 42 },
        { rank: 3, name: 'Distributor C', region: 'East Java', sales: 80000000, growth: -2.5, skus_active: 38 },
        { rank: 4, name: 'Distributor D', region: 'Sumatra', sales: 65000000, growth: 15.4, skus_active: 35 },
        { rank: 5, name: 'Distributor E', region: 'Kalimantan', sales: 50000000, growth: 5.1, skus_active: 30 },
        { rank: 6, name: 'Distributor F', region: 'Sulawesi', sales: 45000000, growth: 3.2, skus_active: 28 },
        { rank: 7, name: 'Distributor G', region: 'Bali', sales: 42000000, growth: 18.5, skus_active: 25 },
        { rank: 8, name: 'Distributor H', region: 'Papua', sales: 38000000, growth: -1.5, skus_active: 20 },
        { rank: 9, name: 'Distributor I', region: 'Nusa Tenggara', sales: 35000000, growth: 4.8, skus_active: 18 },
        { rank: 10, name: 'Distributor J', region: 'Maluku', sales: 30000000, growth: 2.1, skus_active: 15 },
    ];

    const skuPerformance = [
        { rank: 1, name: 'Product A - Large', category: 'Category 1', qty: 5000, value: 75000000, growth: 10.2 },
        { rank: 2, name: 'Product B - Medium', category: 'Category 1', qty: 4200, value: 63000000, growth: 8.5 },
        { rank: 3, name: 'Product C - Small', category: 'Category 2', qty: 3800, value: 57000000, growth: -1.2 },
        { rank: 4, name: 'Product D - Pack', category: 'Category 3', qty: 2500, value: 45000000, growth: 12.8 },
        { rank: 5, name: 'Product E - Bundle', category: 'Category 2', qty: 1800, value: 32000000, growth: 4.5 },
        { rank: 6, name: 'Product F - Trial', category: 'Category 1', qty: 1500, value: 28000000, growth: 6.7 },
        { rank: 7, name: 'Product G - Gift Set', category: 'Category 3', qty: 1200, value: 25000000, growth: 15.2 },
        { rank: 8, name: 'Product H - Refill', category: 'Category 2', qty: 1000, value: 22000000, growth: -3.5 },
        { rank: 9, name: 'Product I - Limited', category: 'Category 1', qty: 800, value: 18000000, growth: 25.4 },
        { rank: 10, name: 'Product J - Sample', category: 'Category 3', qty: 500, value: 12000000, growth: 8.9 },
    ];

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Account & SKU Performance</h2>
                        <p className="text-sm text-gray-500 mt-1">Ranking and Performance Analysis</p>
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Account Rank Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">Account Performance (All Data)</h3>
                        </div>
                        <div className="overflow-x-auto max-h-[600px]">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Value</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {accountPerformance.map((item) => (
                                        <tr key={item.rank} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.rank}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-xs text-gray-500">{item.region}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 font-medium">{formatCurrency(item.sales)}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${item.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {item.growth > 0 ? '+' : ''}{item.growth}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* SKU Rank Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">SKU Performance (All Data)</h3>
                        </div>
                        <div className="overflow-x-auto max-h-[600px]">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Value</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {skuPerformance.map((item) => (
                                        <tr key={item.rank} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.rank}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-xs text-gray-500">{item.category}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 font-medium">{formatCurrency(item.value)}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${item.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {item.growth > 0 ? '+' : ''}{item.growth}%
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
