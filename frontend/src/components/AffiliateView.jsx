import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import DateRangePicker from './DateRangePicker';

export default function AffiliateView() {
    const [searchParams] = useSearchParams();
    const channel = searchParams.get('channel') || 'Shopee';
    
    // Separate state for Product Table Date Picker
    const [showProductDatePicker, setShowProductDatePicker] = useState(false);
    const [productDateRange, setProductDateRange] = useState({
        start: new Date(2025, 11, 30), // 30 Dec 2025
        end: new Date(2026, 0, 28)     // 28 Jan 2026
    });

    // Separate state for Creator Table Date Picker
    const [showCreatorDatePicker, setShowCreatorDatePicker] = useState(false);
    const [creatorDateRange, setCreatorDateRange] = useState({
        start: new Date(2025, 11, 30), 
        end: new Date(2026, 0, 28)
    });

    const handleProductDateApply = (start, end) => {
        if (start && end) {
            setProductDateRange({ start, end });
        }
        setShowProductDatePicker(false);
    };

    const handleCreatorDateApply = (start, end) => {
        if (start && end) {
            setCreatorDateRange({ start, end });
        }
        setShowCreatorDatePicker(false);
    };

    const formatDateRange = (range) => {
        if (!range.start || !range.end) return 'Select Date Range';
        const days = Math.round((range.end - range.start) / (1000 * 60 * 60 * 24)) + 1;
        return `${format(range.start, 'd MMM yyyy')} - ${format(range.end, 'd MMM yyyy')} (${days} days)`;
    };

    // Mock Data for Top Stats
    const stats = {
        total: "Rp 150.000.000",
        live: "Rp 80.000.000",
        video: "Rp 50.000.000",
        social: "Rp 20.000.000"
    };

    return (
        <div className="flex-1 bg-gray-50 p-8 overflow-y-auto h-full pb-64">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Affiliate {channel}</h1>

            {/* Top Stats Cards with Math Symbols */}
            <div className="flex flex-row items-center justify-between gap-4 mb-12 overflow-x-auto pb-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1 min-w-[200px] h-40 flex flex-col justify-between">
                    <h3 className="text-lg font-bold text-blue-900">Total Sales Affiliate</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                
                <div className="text-2xl text-gray-400 font-bold px-2">=</div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1 min-w-[200px] h-40 flex flex-col justify-between">
                    <h3 className="text-lg font-bold text-blue-900">{channel} Live</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.live}</p>
                </div>

                <div className="text-2xl text-gray-400 font-bold px-2">+</div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1 min-w-[200px] h-40 flex flex-col justify-between">
                    <h3 className="text-lg font-bold text-blue-900">{channel} Video</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.video}</p>
                </div>

                <div className="text-2xl text-gray-400 font-bold px-2">+</div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1 min-w-[200px] h-40 flex flex-col justify-between">
                    <h3 className="text-lg font-bold text-blue-900">Media Social</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.social}</p>
                </div>
            </div>

            {/* Best Product Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Best Product</h2>
                
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative">
                        <div 
                            className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm cursor-pointer hover:bg-gray-50"
                            onClick={() => setShowProductDatePicker(!showProductDatePicker)}
                        >
                            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">{formatDateRange(productDateRange)}</span>
                            <svg className="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        {showProductDatePicker && (
                            <DateRangePicker 
                                onClose={() => setShowProductDatePicker(false)} 
                                onApply={handleProductDateApply} 
                                align="left"
                            />
                        )}
                    </div>

                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search Order ID"
                            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-sm"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Order ID', 'Paid At', 'Channel', 'Product Name', 'Status', 'Order Value', 'Currency', 'Item Qty', 'Payment Method', 'Create At', 'Updated At'].map((header) => (
                                        <th key={header} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td colSpan="11" className="px-6 py-10 text-center text-gray-500 text-sm">
                                        No product data available
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Best Creator Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Best Creator</h2>
                
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative">
                        <div 
                            className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm cursor-pointer hover:bg-gray-50"
                            onClick={() => setShowCreatorDatePicker(!showCreatorDatePicker)}
                        >
                            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">{formatDateRange(creatorDateRange)}</span>
                            <svg className="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        {showCreatorDatePicker && (
                            <DateRangePicker 
                                onClose={() => setShowCreatorDatePicker(false)} 
                                onApply={handleCreatorDateApply} 
                                align="left"
                            />
                        )}
                    </div>

                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search Order ID"
                            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-sm"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Order ID', 'Paid At', 'Channel', 'Product Name', 'Status', 'Order Value', 'Currency', 'Item Qty', 'Payment Method', 'Create At', 'Updated At'].map((header) => (
                                        <th key={header} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td colSpan="11" className="px-6 py-10 text-center text-gray-500 text-sm">
                                        No creator data available
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
