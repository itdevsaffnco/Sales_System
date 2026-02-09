import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import DateRangePicker from './DateRangePicker';

export default function LiveStreamingView() {
    const [searchParams] = useSearchParams();
    const channel = searchParams.get('channel') || 'Shopee';
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 11, 30), // 30 Dec 2025
        end: new Date(2026, 0, 28)     // 28 Jan 2026
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

    // Mock Data for Charts
    const chartData = [
        { name: 'Jan 1', gmv: 4000, visitors: 2400 },
        { name: 'Jan 5', gmv: 3000, visitors: 1398 },
        { name: 'Jan 10', gmv: 2000, visitors: 9800 },
        { name: 'Jan 15', gmv: 2780, visitors: 3908 },
        { name: 'Jan 20', gmv: 1890, visitors: 4800 },
        { name: 'Jan 25', gmv: 2390, visitors: 3800 },
        { name: 'Jan 28', gmv: 3490, visitors: 4300 },
    ];

    // Mock Data for Top Selling Items
    const topItems = [
        { name: 'Saff & Co. Extrait de Parfum - S.O.T.B', sales: 120, image: 'https://via.placeholder.com/40' },
        { name: 'Saff & Co. Extrait de Parfum - COCO', sales: 98, image: 'https://via.placeholder.com/40' },
        { name: 'Saff & Co. Extrait de Parfum - LOUI', sales: 85, image: 'https://via.placeholder.com/40' },
        { name: 'Saff & Co. Extrait de Parfum - CHNO', sales: 72, image: 'https://via.placeholder.com/40' },
        { name: 'Saff & Co. Extrait de Parfum - OMNIA', sales: 65, image: 'https://via.placeholder.com/40' },
    ];

    return (
        <div className="flex-1 bg-gray-50 p-8 overflow-y-auto h-full pb-64">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Live Streaming {channel}</h1>
            
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
                {/* Left Column: Charts */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* GMV Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">GMV</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                        itemStyle={{color: '#4F46E5'}}
                                    />
                                    <Area type="monotone" dataKey="gmv" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorGmv)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Total Visitor Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Total Visitor</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorVisitor" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                        itemStyle={{color: '#10B981'}}
                                    />
                                    <Area type="monotone" dataKey="visitors" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitor)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Column: Top Selling Items */}
                <div className="w-full lg:w-80 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Top Selling Items</h3>
                    <div className="space-y-4">
                        {topItems.map((item, index) => (
                            <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                    {/* Placeholder for product image */}
                                    <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.sales} sold</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Date Picker and Search */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
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
                            align="left"
                        />
                    )}
                </div>

                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="Search Order ID"
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                         <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {[
                                    'Order ID', 'Paid At', 'Channel', 'Product Name', 'Status', 
                                    'Order Value', 'Currency', 'Item Qty', 'Payment Method', 
                                    'Create At', 'Updated At'
                                ].map((header) => (
                                    <th key={header} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td colSpan="11" className="px-6 py-10 text-center text-gray-500 text-sm">
                                    No data available for the selected period
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
