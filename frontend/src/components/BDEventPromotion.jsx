import React, { useState } from 'react';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function BDEventPromotion() {
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

    const [selectedEventId, setSelectedEventId] = useState('all');

    // Mock Data
    const eventsData = [
        {
            id: 'evt-001',
            name: 'New Year Sale',
            date: '1 Jan 2026',
            metrics: { activity_rate: 85, promotional_value: 15000000 },
            trend: [
                { date: '28 Dec', rate: 60, value: 200000 },
                { date: '29 Dec', rate: 70, value: 500000 },
                { date: '30 Dec', rate: 80, value: 1200000 },
                { date: '31 Dec', rate: 95, value: 4500000 },
                { date: '1 Jan', rate: 90, value: 8600000 },
            ]
        },
        {
            id: 'evt-002',
            name: 'Chinese New Year Promo',
            date: '15 Jan 2026',
            metrics: { activity_rate: 92, promotional_value: 28000000 },
            trend: [
                { date: '10 Jan', rate: 65, value: 1500000 },
                { date: '12 Jan', rate: 75, value: 3500000 },
                { date: '14 Jan', rate: 88, value: 8200000 },
                { date: '15 Jan', rate: 98, value: 14800000 },
            ]
        },
        {
            id: 'evt-003',
            name: 'Payday Flash Sale',
            date: '25 Jan 2026',
            metrics: { activity_rate: 78, promotional_value: 12000000 },
            trend: [
                { date: '23 Jan', rate: 60, value: 1200000 },
                { date: '24 Jan', rate: 72, value: 3500000 },
                { date: '25 Jan', rate: 85, value: 7300000 },
            ]
        }
    ];

    const currentData = selectedEventId === 'all' 
        ? {
            metrics: {
                activity_rate: Math.round(eventsData.reduce((acc, curr) => acc + curr.metrics.activity_rate, 0) / eventsData.length),
                promotional_value: eventsData.reduce((acc, curr) => acc + curr.metrics.promotional_value, 0)
            },
            trend: eventsData[0].trend // Simplified for 'all' view, or could be aggregated
          }
        : eventsData.find(e => e.id === selectedEventId);

    const MetricCard = ({ title, value, subValue, subLabel, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            {subValue && (
                <p className={`text-xs mt-2 font-medium ${color || 'text-gray-500'}`}>
                    {subValue} <span className="text-gray-400 font-normal ml-1">{subLabel}</span>
                </p>
            )}
        </div>
    );

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Event Promotion & Activity</h2>
                        <p className="text-sm text-gray-500 mt-1">Activity Rate & Promotional Value Analysis</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Event Selector */}
                        <div className="relative">
                            <select 
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer text-sm font-medium h-full"
                            >
                                <option value="all">All Events Overview</option>
                                {eventsData.map(evt => (
                                    <option key={evt.id} value={evt.id}>{evt.name} ({evt.date})</option>
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

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <MetricCard 
                        title="Activity Rate" 
                        value={`${currentData.metrics.activity_rate}%`} 
                        subValue="Engagement Level"
                        color="text-blue-600"
                    />
                    <MetricCard 
                        title="Promotional Value (Total)" 
                        value={formatCurrency(currentData.metrics.promotional_value)} 
                        subValue="Total Spend"
                        color="text-red-500"
                    />
                </div>

                {/* Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Promotional Value Trend {selectedEventId !== 'all' ? `- ${currentData.name}` : ''}</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={currentData.trend || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(val) => `${val/1000}k`} />
                                <Tooltip 
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#EF4444" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Events List Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="text-lg font-bold text-gray-800">Events Breakdown</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Activity Rate</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Promotional Value</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {eventsData.map((evt) => (
                                    <tr key={evt.id} className={`hover:bg-gray-50 transition-colors ${selectedEventId === evt.id ? 'bg-blue-50' : ''}`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{evt.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evt.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{evt.metrics.activity_rate}%</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">{formatCurrency(evt.metrics.promotional_value)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            <button 
                                                onClick={() => setSelectedEventId(evt.id)}
                                                className="text-blue-600 hover:text-blue-900 font-medium text-xs uppercase tracking-wide"
                                            >
                                                View Details
                                            </button>
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