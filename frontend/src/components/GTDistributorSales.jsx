import React, { useState } from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function GTDistributorSales() {
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
        { account: 'GT Distributor A', sales: 45000000, target: 50000000, achievement: 90.0, growth: 5.5, area: 'Jakarta' },
        { account: 'GT Distributor B', sales: 35000000, target: 40000000, achievement: 87.5, growth: -1.2, area: 'Bandung' },
        { account: 'GT Distributor C', sales: 30000000, target: 30000000, achievement: 100.0, growth: 8.5, area: 'Surabaya' },
        { account: 'GT Distributor D', sales: 25000000, target: 20000000, achievement: 125.0, growth: 12.2, area: 'Medan' },
        { account: 'GT Distributor E', sales: 15000000, target: 20000000, achievement: 75.0, growth: -3.0, area: 'Semarang' },
    ];

    const topProducts = [
        { name: 'Product A', value: 25000000, contribution: 15 },
        { name: 'Product B', value: 20000000, contribution: 12 },
        { name: 'Product C', value: 18000000, contribution: 10 },
        { name: 'Product D', value: 15000000, contribution: 9 },
        { name: 'Product E', value: 12000000, contribution: 7 },
    ];

    const topStores = [
        { name: 'Store Alpha', distributor: 'GT Distributor A', value: 5000000 },
        { name: 'Store Beta', distributor: 'GT Distributor B', value: 4200000 },
        { name: 'Store Gamma', distributor: 'GT Distributor A', value: 3800000 },
        { name: 'Store Delta', distributor: 'GT Distributor C', value: 3500000 },
        { name: 'Store Epsilon', distributor: 'GT Distributor D', value: 3100000 },
    ];

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Sales Performance</h2>
                        <p className="text-sm text-gray-500 mt-1">Detailed sales analysis per distributor</p>
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

                {/* Sales vs Target Chart */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-100 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales vs Target per Distributor</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={accountPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="account" tickFormatter={(val) => val.replace('GT Distributor ', 'Dist ')} />
                                <YAxis />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="sales" name="Sales" fill="#10B981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="target" name="Target" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Account Performance Table */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-100 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Performance Detail</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ach %</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Growth %</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {accountPerformance.map((account, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{account.account}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.area}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(account.sales)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(account.target)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${account.achievement >= 100 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {account.achievement.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${account.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {account.growth > 0 ? '+' : ''}{account.growth}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Products */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Products (SKU)</h3>
                        <div className="space-y-4">
                            {topProducts.map((product, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">{product.name}</span>
                                            <span className="text-sm text-gray-500">{formatCurrency(product.value)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(product.value / 30000000) * 100}%` }}></div>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">Contribution: {product.contribution}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Stores */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Stores</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Store</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Distributor</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Sales</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {topStores.map((store, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{store.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{store.distributor}</td>
                                            <td className="px-4 py-3 text-sm text-right text-gray-500">{formatCurrency(store.value)}</td>
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
