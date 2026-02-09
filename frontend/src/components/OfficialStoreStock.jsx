import React, { useState } from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function OfficialStoreStock() {
    const [selectedStore, setSelectedStore] = useState('All Stores');
    const [searchQuery, setSearchQuery] = useState('');

    const formatNumber = (value) => {
        return new Intl.NumberFormat('id-ID').format(value);
    };

    const formatPercent = (value) => {
        return `${value.toFixed(1)}%`;
    };

    // Mock Data
    const stores = ['All Stores', 'Grand Indonesia', 'Plaza Indonesia', 'Senayan City', 'Pondok Indah Mall', 'Kota Kasablanka', 'Central Park', 'Gandaria City'];

    const metrics = {
        total_stock: { value: 125000, status: 'Normal' },
        oos_items: { value: 12, status: 'Warning' }, // Items with 0 stock
        stock_coverage: { value: 4.2, status: 'Good' }, // Weeks of Supply
        overstock_items: { value: 45, status: 'Warning' } // Items with too much stock
    };

    const stockData = [
        { id: 1, name: 'Grand Indonesia', stock: 25000, oos: 2, coverage: 3.5, limit_status: 'Good' },
        { id: 2, name: 'Plaza Indonesia', stock: 22000, oos: 1, coverage: 4.0, limit_status: 'Good' },
        { id: 3, name: 'Senayan City', stock: 19000, oos: 3, coverage: 2.8, limit_status: 'Low' },
        { id: 4, name: 'Pondok Indah Mall', stock: 16000, oos: 0, coverage: 5.2, limit_status: 'Overstock' },
        { id: 5, name: 'Kota Kasablanka', stock: 14000, oos: 4, coverage: 2.5, limit_status: 'Low' },
        { id: 6, name: 'Central Park', stock: 11000, oos: 1, coverage: 4.5, limit_status: 'Good' },
        { id: 7, name: 'Gandaria City', stock: 18000, oos: 1, coverage: 6.0, limit_status: 'Overstock' },
    ];

    const skuStockData = [
        { code: 'SKU001', name: 'Perfume A 50ml', stock: 1200, store: 'Grand Indonesia', status: 'Good', coverage: 4.5 },
        { code: 'SKU002', name: 'Perfume B 100ml', stock: 0, store: 'Kota Kasablanka', status: 'OOS', coverage: 0 },
        { code: 'SKU003', name: 'Body Mist C', stock: 50, store: 'Senayan City', status: 'Low', coverage: 0.8 },
        { code: 'SKU004', name: 'Gift Set D', stock: 800, store: 'Pondok Indah Mall', status: 'Overstock', coverage: 12.0 },
        { code: 'SKU005', name: 'Perfume E 30ml', stock: 450, store: 'Plaza Indonesia', status: 'Good', coverage: 3.2 },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Good': return 'bg-green-100 text-green-800';
            case 'Warning': return 'bg-yellow-100 text-yellow-800';
            case 'OOS': return 'bg-red-100 text-red-800';
            case 'Low': return 'bg-orange-100 text-orange-800';
            case 'Overstock': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredStockData = skuStockData.filter(item => {
        const storeMatch = selectedStore === 'All Stores' || item.store === selectedStore;
        const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.code.toLowerCase().includes(searchQuery.toLowerCase());
        return storeMatch && searchMatch;
    });

    return (
        <div className="flex-1 bg-gray-50 p-8 overflow-y-auto h-full pb-64">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Official Store Stock</h1>
                
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
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Stock */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Total Stock</h3>
                    <div className="flex items-baseline mb-4">
                        <span className="text-2xl font-bold text-gray-900">{formatNumber(metrics.total_stock.value)}</span>
                        <span className="ml-2 text-sm text-gray-500">Units</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                </div>

                {/* OOS Items */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Out of Stock (OOS)</h3>
                    <div className="flex items-baseline mb-4">
                        <span className="text-2xl font-bold text-red-600">{metrics.oos_items.value}</span>
                        <span className="ml-2 text-sm text-gray-500">SKUs</span>
                    </div>
                    <div className="text-xs text-red-500 font-medium">Immediate action required</div>
                </div>

                {/* Stock Coverage */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Stock Coverage</h3>
                    <div className="flex items-baseline mb-4">
                        <span className="text-2xl font-bold text-gray-900">{metrics.stock_coverage.value}</span>
                        <span className="ml-2 text-sm text-gray-500">Weeks</span>
                    </div>
                    <div className="text-xs text-green-600 font-medium">Healthy level (Target: 4-6 weeks)</div>
                </div>

                {/* Overstock Warning */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Overstock Risk</h3>
                    <div className="flex items-baseline mb-4">
                        <span className="text-2xl font-bold text-blue-600">{metrics.overstock_items.value}</span>
                        <span className="ml-2 text-sm text-gray-500">SKUs</span>
                    </div>
                    <div className="text-xs text-gray-500">Coverage &gt; 8 weeks</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Stock per Store Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Stock Level per Store</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stockData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12}} />
                                <Tooltip formatter={(value) => formatNumber(value)} />
                                <Bar dataKey="stock" fill="#4F46E5" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* OOS Breakdown */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Stock Health Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                                <span className="text-sm font-medium text-gray-700">Out of Stock</span>
                            </div>
                            <span className="font-bold text-red-600">12 SKUs</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-orange-500 mr-3"></div>
                                <span className="text-sm font-medium text-gray-700">Low Stock</span>
                            </div>
                            <span className="font-bold text-orange-600">24 SKUs</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                                <span className="text-sm font-medium text-gray-700">Healthy</span>
                            </div>
                            <span className="font-bold text-green-600">145 SKUs</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                                <span className="text-sm font-medium text-gray-700">Overstock</span>
                            </div>
                            <span className="font-bold text-blue-600">45 SKUs</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SKU Detail Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">SKU Stock Details</h3>
                    <div className="text-sm text-gray-500 italic">Showing top critical items</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">SKU Code</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Store</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Current Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Coverage (Weeks)</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStockData.map((sku, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{sku.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sku.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sku.store}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-bold">{formatNumber(sku.stock)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{sku.coverage}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(sku.status)}`}>
                                            {sku.status}
                                        </span>
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