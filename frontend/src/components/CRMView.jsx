import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Line, Legend, LineChart, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import DateRangePicker from './DateRangePicker';

export default function CRMView() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState('All Channels');
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 11, 30), // 30 Dec 2025
        end: new Date(2026, 0, 28)     // 28 Jan 2026
    });

    const channels = ['All Channels', 'Shopee', 'Tiktok', 'Tokopedia', 'Offline', 'Website', 'WhatsApp'];

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

    // Mock Data
    const stats = {
        newCustomer: 1250,
        repeatCustomer: 850
    };

    const topLocations = [
        { province: 'DKI Jakarta', qty: 450 },
        { province: 'West Java', qty: 320 },
        { province: 'East Java', qty: 210 },
        { province: 'Banten', qty: 180 },
        { province: 'Central Java', qty: 150 },
    ];

    const chartData = [
        { name: 'Jan', new: 400, repeat: 240 },
        { name: 'Feb', new: 300, repeat: 139 },
        { name: 'Mar', new: 200, repeat: 980 },
        { name: 'Apr', new: 278, repeat: 390 },
        { name: 'May', new: 189, repeat: 480 },
        { name: 'Jun', new: 239, repeat: 380 },
        { name: 'Jul', new: 349, repeat: 430 },
    ];

    const channelGrowthData = [
        { name: 'Jan', Shopee: 150, Tiktok: 120, Tokopedia: 80, Offline: 40, Website: 20, WhatsApp: 15 },
        { name: 'Feb', Shopee: 180, Tiktok: 140, Tokopedia: 85, Offline: 45, Website: 25, WhatsApp: 18 },
        { name: 'Mar', Shopee: 220, Tiktok: 190, Tokopedia: 90, Offline: 50, Website: 30, WhatsApp: 22 },
        { name: 'Apr', Shopee: 250, Tiktok: 240, Tokopedia: 95, Offline: 55, Website: 35, WhatsApp: 25 },
        { name: 'May', Shopee: 290, Tiktok: 280, Tokopedia: 100, Offline: 60, Website: 40, WhatsApp: 29 },
        { name: 'Jun', Shopee: 320, Tiktok: 310, Tokopedia: 110, Offline: 65, Website: 45, WhatsApp: 32 },
        { name: 'Jul', Shopee: 380, Tiktok: 350, Tokopedia: 120, Offline: 70, Website: 50, WhatsApp: 38 },
    ];
    
    const buildChannelSeries = (data, channel) => {
        return data.map(d => {
            const total = d[channel] ?? 0;
            const newVal = Math.round(total * 0.6);
            const repeatVal = total - newVal;
            return { name: d.name, new: newVal, repeat: repeatVal };
        });
    };
    
    const aggregateAllChannelsSeries = (data) => {
        return data.map(d => {
            const total = channels
                .filter(c => c !== 'All Channels')
                .reduce((sum, c) => sum + (d[c] ?? 0), 0);
            const newVal = Math.round(total * 0.6);
            const repeatVal = total - newVal;
            return { name: d.name, new: newVal, repeat: repeatVal };
        });
    };
    
    const buildPerChannelSeries = (data) => {
        const totals = {};
        channels.filter(c => c !== 'All Channels').forEach(c => totals[c] = 0);
        data.forEach(d => {
            Object.keys(totals).forEach(c => {
                totals[c] += d[c] ?? 0;
            });
        });
        return Object.keys(totals).map(c => {
            const total = totals[c];
            const newVal = Math.round(total * 0.6);
            const repeatVal = total - newVal;
            return { name: c, new: newVal, repeat: repeatVal };
        });
    };

    const customerCompositionData = [
        { name: 'Shopee', value: 35, color: '#EE4D2D' },
        { name: 'Tiktok', value: 25, color: '#000000' },
        { name: 'Tokopedia', value: 20, color: '#42B549' },
        { name: 'Offline', value: 10, color: '#4F46E5' },
        { name: 'Website', value: 5, color: '#EC4899' },
        { name: 'WhatsApp', value: 5, color: '#25D366' },
    ];

    return (
        <div className="flex-1 bg-gray-50 p-8 overflow-y-auto h-full pb-64">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">CRM</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total New Customer */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between h-40">
                    <h3 className="text-lg font-bold text-blue-900">Total New Customer</h3>
                    <p className="text-4xl font-bold text-gray-900">{stats.newCustomer}</p>
                </div>

                {/* Total Repeat Customer */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between h-40">
                    <h3 className="text-lg font-bold text-blue-900">Total Repeat Customer</h3>
                    <p className="text-4xl font-bold text-gray-900">{stats.repeatCustomer}</p>
                    <p className="text-sm text-gray-500 mt-1">Customers with &gt; 1 purchase</p>
                </div>

                {/* Top Location Customer */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 row-span-2 overflow-hidden flex flex-col">
                    <h3 className="text-lg font-bold text-blue-900 mb-4">Top Location Customer</h3>
                    <div className="flex-1 overflow-y-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-2 text-sm font-semibold text-gray-600">Province</th>
                                    <th className="text-right py-2 text-sm font-semibold text-gray-600">Qty Sold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topLocations.map((loc, idx) => (
                                    <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                        <td className="py-3 text-sm text-gray-800">{loc.province}</td>
                                        <td className="py-3 text-sm text-gray-800 text-right">{loc.qty}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Graphic Chart (Spans 2 columns) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 col-span-1 md:col-span-2 h-80">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Growth (New vs Repeat)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                    cursor={{fill: 'transparent'}}
                                />
                                <Legend />
                                <Bar dataKey="new" name="New Customer" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="repeat" name="Repeat Customer" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                                <Line type="monotone" dataKey="new" stroke="#818CF8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="repeat" stroke="#34D399" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 col-span-1 md:col-span-2 h-80">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Growth (Per Channel)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={buildPerChannelSeries(channelGrowthData)}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                    cursor={{fill: 'transparent'}}
                                />
                                <Legend />
                                <Bar dataKey="new" name="New Customer" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="repeat" name="Repeat Customer" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                                <Line type="monotone" dataKey="new" stroke="#818CF8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="repeat" stroke="#34D399" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Customer Composition (Pie Chart) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 col-span-1 h-80">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Composition</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={customerCompositionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {customerCompositionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Date Picker and Search */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    {/* Channel Filter */}
                    <div className="relative">
                        <select 
                            value={selectedChannel}
                            onChange={(e) => setSelectedChannel(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer text-sm font-medium"
                        >
                            {channels.map((channel) => (
                                <option key={channel} value={channel}>{channel}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </div>
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
                </div>

                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="Search Order ID"
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-sm"
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
