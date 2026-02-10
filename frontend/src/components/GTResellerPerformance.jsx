import React, { useState } from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function GTResellerPerformance() {
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

    // Mock Data
    const accountPerformance = [
        { account: 'Reseller A', sales: 25000000, qty: 250, achievement: 100.0, growth: 10.5, listing_sku: 15 },
        { account: 'Reseller B', sales: 20000000, qty: 180, achievement: 111.1, growth: 15.2, listing_sku: 12 },
        { account: 'Reseller C', sales: 15000000, qty: 120, achievement: 93.7, growth: 2.5, listing_sku: 10 },
        { account: 'Reseller D', sales: 12000000, qty: 100, achievement: 120.0, growth: 20.0, listing_sku: 8 },
        { account: 'Reseller E', sales: 8000000, qty: 80, achievement: 72.7, growth: -5.0, listing_sku: 10 },
        { account: 'Reseller F', sales: 6000000, qty: 60, achievement: 85.0, growth: 1.2, listing_sku: 8 },
    ];

    const topSkus = [
        { name: 'SKU X - 100ml', value: 35000000 },
        { name: 'SKU Y - 50ml', value: 25000000 },
        { name: 'SKU Z - Pack', value: 15000000 },
        { name: 'SKU A - 200ml', value: 10000000 },
        { name: 'SKU B - Bundle', value: 5000000 },
    ];

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">GT Reseller Performance</h2>
                        <p className="text-sm text-gray-500 mt-1">Sales Value, Top Reseller, and SKU Performance</p>
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Account Performance Table */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Reseller Performance (Sales & Listing)</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reseller</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ach %</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Listing SKU</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {accountPerformance.map((account, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{account.account}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(account.sales)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{account.qty}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${account.achievement >= 100 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {account.achievement.toFixed(1)}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{account.listing_sku}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top SKU Chart */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 SKU Contribution</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={topSkus} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" width={100} style={{ fontSize: '11px' }} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Bar dataKey="value" fill="#6366F1" radius={[0, 4, 4, 0]} name="Sales Value" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
