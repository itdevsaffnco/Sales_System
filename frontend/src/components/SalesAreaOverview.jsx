import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function SalesAreaOverview() {
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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    // Mock Data
    const areaSalesData = [
        { area: 'Jabodetabek', sales: 1250000000, target: 1000000000, achievement: 125 },
        { area: 'West Java', sales: 850000000, target: 900000000, achievement: 94 },
        { area: 'Central Java', sales: 650000000, target: 600000000, achievement: 108 },
        { area: 'East Java', sales: 950000000, target: 900000000, achievement: 105 },
        { area: 'Sumatra', sales: 550000000, target: 600000000, achievement: 91 },
        { area: 'Kalimantan', sales: 350000000, target: 400000000, achievement: 87 },
        { area: 'Sulawesi', sales: 250000000, target: 300000000, achievement: 83 },
    ];

    const growthTrendData = [
        { month: 'Jan', sales: 4200000000 },
        { month: 'Feb', sales: 4350000000 },
        { month: 'Mar', sales: 4100000000 },
        { month: 'Apr', sales: 4500000000 },
        { month: 'May', sales: 4800000000 },
        { month: 'Jun', sales: 4850000000 },
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
                        <h2 className="text-2xl font-bold text-gray-800">Sales Area Overview</h2>
                        <p className="text-sm text-gray-500 mt-1">Regional performance summary</p>
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
                    <MetricCard title="Total Sales" value={formatCurrency(4850000000)} subValue="+12% vs Target" color="text-green-500" />
                    <MetricCard title="Active Outlets" value="85%" subValue="Total 1,250 Stores" color="text-blue-500" />
                    <MetricCard title="OOS Rate" value="4.2%" subValue="-1.5% vs Last Month" color="text-red-500" />
                    <MetricCard title="Visit Productivity" value="8.5" subValue="Visits per Day" color="text-purple-500" />
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales by Area vs Target</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={areaSalesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="area" />
                                    <YAxis tickFormatter={(val) => `${val/1000000000}M`} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                    <Bar dataKey="sales" name="Actual Sales" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="target" name="Target" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Area Growth Trend</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={growthTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis tickFormatter={(val) => `${val/1000000000}M`} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                    <Line type="monotone" dataKey="sales" name="Sales Trend" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
