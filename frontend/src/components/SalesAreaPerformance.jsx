import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell, ComposedChart
} from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function SalesAreaPerformance() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 0, 1),
        end: new Date(2025, 11, 31)
    });

    const handleDateApply = (start, end) => {
        if (start && end) setDateRange({ start, end });
        setShowDatePicker(false);
    };

    const formatDateRange = () => {
        if (!dateRange.start || !dateRange.end) return 'Select Date Range';
        return `${format(dateRange.start, 'd MMM yyyy')} - ${format(dateRange.end, 'd MMM yyyy')}`;
    };

    // Mock Data
    const activeOutletsData = [
        { name: 'Active', value: 85, color: '#10B981' },
        { name: 'Inactive', value: 15, color: '#EF4444' },
    ];

    const roVsAoData = [
        { month: 'Jan', ao: 1200, ro: 850, noo: 50 },
        { month: 'Feb', ao: 1250, ro: 900, noo: 60 },
        { month: 'Mar', ao: 1280, ro: 920, noo: 45 },
    ];

    const MetricCard = ({ title, value, subValue, color }) => (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
            {subValue && <p className={`text-xs mt-1 ${color}`}>{subValue}</p>}
        </div>
    );

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Sales Area Performance</h2>
                        <p className="text-sm text-gray-500 mt-1">Coverage, outlets, and visit productivity</p>
                    </div>
                    <div className="relative">
                        <button 
                            className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50"
                            onClick={() => setShowDatePicker(!showDatePicker)}
                        >
                            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">{formatDateRange()}</span>
                        </button>
                        {showDatePicker && (
                            <DateRangePicker 
                                onClose={() => setShowDatePicker(false)} 
                                onApply={handleDateApply} 
                                align="right"
                            />
                        )}
                    </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard title="Total Active Outlets" value="1,062" subValue="85% of Total Registered" color="text-green-500" />
                    <MetricCard title="New Outlets (NOO)" value="45" subValue="Last Month" color="text-blue-500" />
                    <MetricCard title="Visit Productivity" value="8.5" subValue="Visits per Day" color="text-purple-500" />
                    <MetricCard title="Order Frequency" value="2.4" subValue="Orders per Month" color="text-indigo-500" />
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Outlets (%)</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={activeOutletsData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {activeOutletsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">RO vs AO & NOO</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={roVsAoData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="ao" name="Active Outlets" barSize={20} fill="#413ea0" />
                                    <Line type="monotone" dataKey="ro" name="Repeat Orders" stroke="#ff7300" />
                                    <Line type="monotone" dataKey="noo" name="New Outlets" stroke="#10B981" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
