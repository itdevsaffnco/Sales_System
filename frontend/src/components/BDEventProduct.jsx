import React, { useState } from 'react';
import { format } from 'date-fns';
import DateRangePicker from './DateRangePicker';

export default function BDEventProduct() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 11, 30),
        end: new Date(2026, 0, 28)
    });
    
    // Filters
    const [selectedEvent, setSelectedEvent] = useState('All Events');
    const [sortConfig, setSortConfig] = useState({ key: 'value', direction: 'desc' });

    const handleDateApply = (start, end) => {
        if (start && end) {
            setDateRange({ start, end });
        }
        setShowDatePicker(false);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
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
    const products = [
        { name: 'Product A', quantity: 1200, value: 45000000, contribution: 25 },
        { name: 'Product B', quantity: 950, value: 32000000, contribution: 18 },
        { name: 'Product C', quantity: 800, value: 28000000, contribution: 15 },
        { name: 'Product D', quantity: 600, value: 21000000, contribution: 12 },
        { name: 'Product E', quantity: 450, value: 15000000, contribution: 8 },
        { name: 'Product F', quantity: 300, value: 10000000, contribution: 6 },
        { name: 'Product G', quantity: 250, value: 8000000, contribution: 5 },
        { name: 'Product H', quantity: 200, value: 6500000, contribution: 4 },
        { name: 'Product I', quantity: 150, value: 5000000, contribution: 3 },
        { name: 'Product J', quantity: 100, value: 3500000, contribution: 2 },
        { name: 'Product K', quantity: 80, value: 2500000, contribution: 1.5 },
        { name: 'Product L', quantity: 50, value: 1500000, contribution: 0.5 },
    ];

    const sortedProducts = [...products].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
            return (
                <svg className="w-4 h-4 text-gray-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }
        return sortConfig.direction === 'asc' ? (
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Event Product Performance</h2>
                        <p className="text-sm text-gray-500 mt-1">Product Analysis by Value, Quantity & Contribution</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Event Filter */}
                        <div className="relative">
                            <select 
                                value={selectedEvent}
                                onChange={(e) => setSelectedEvent(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer text-sm font-medium h-full"
                            >
                                <option value="All Events">All Events</option>
                                <option value="Pop Up A">Pop Up A</option>
                                <option value="Pop Up B">Pop Up B</option>
                            </select>
                        </div>

                        {/* Metric Filter Removed */}
                        
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

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">Product Performance Details</h3>
                        <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{products.length} Products</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100 transition-colors"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Product Name</span>
                                            <SortIcon columnKey="name" />
                                        </div>
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100 transition-colors"
                                        onClick={() => handleSort('quantity')}
                                    >
                                        <div className="flex items-center justify-end space-x-1">
                                            <span>Quantity</span>
                                            <SortIcon columnKey="quantity" />
                                        </div>
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100 transition-colors"
                                        onClick={() => handleSort('value')}
                                    >
                                        <div className="flex items-center justify-end space-x-1">
                                            <span>Value (IDR)</span>
                                            <SortIcon columnKey="value" />
                                        </div>
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100 transition-colors"
                                        onClick={() => handleSort('contribution')}
                                    >
                                        <div className="flex items-center justify-end space-x-1">
                                            <span>Contribution</span>
                                            <SortIcon columnKey="contribution" />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedProducts.map((product, index) => (
                                    <tr key={index} className="hover:bg-blue-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                            {new Intl.NumberFormat('id-ID').format(product.quantity)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">
                                            {formatCurrency(product.value)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <span className="font-medium text-gray-900">{product.contribution}%</span>
                                                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-blue-500 rounded-full" 
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