import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { 
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function OfflineSalesOverview() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 0, 1),
        end: new Date(2025, 11, 31)
    });
    const [selectedChannel, setSelectedChannel] = useState('All Channels');

    const channelOptions = ['All Channels', 'Official Store', 'Modern Trade (MT)', 'General Trade (GT)', 'Area Sales'];

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

    // Filtered Data Logic
    const { kpiData, monthlyTrend, chartData, chartTitle, regionPerformance } = useMemo(() => {
        let multiplier = 1;
        // Mock multipliers for simulation
        switch(selectedChannel) {
            case 'Official Store': multiplier = 0.15; break;
            case 'Modern Trade (MT)': multiplier = 0.40; break;
            case 'General Trade (GT)': multiplier = 0.35; break;
            case 'Area Sales': multiplier = 0.10; break;
            default: multiplier = 1;
        }

        const kpiData = {
            totalRevenue: 12500000000 * multiplier,
            targetAchievement: 92.5 + (selectedChannel === 'All Channels' ? 0 : (Math.random() * 10 - 5)),
            activeOutlets: Math.floor(1250 * multiplier),
            growthYoY: 15.4 + (selectedChannel === 'All Channels' ? 0 : (Math.random() * 4 - 2))
        };

        const monthlyTrend = [
            { month: 'Jan', sales: 850 * multiplier, target: 900 * multiplier },
            { month: 'Feb', sales: 920 * multiplier, target: 900 * multiplier },
            { month: 'Mar', sales: 980 * multiplier, target: 950 * multiplier },
            { month: 'Apr', sales: 1050 * multiplier, target: 1000 * multiplier },
            { month: 'May', sales: 1100 * multiplier, target: 1050 * multiplier },
            { month: 'Jun', sales: 1150 * multiplier, target: 1100 * multiplier },
        ]; // In Millions

        let chartData = [];
        let chartTitle = "";

        if (selectedChannel === 'All Channels') {
            chartTitle = "Channel Contribution";
            chartData = [
                { name: 'General Trade (GT)', value: 4375000000, color: '#3B82F6' },
                { name: 'Modern Trade (MT)', value: 5000000000, color: '#10B981' },
                { name: 'Official Store', value: 1875000000, color: '#F59E0B' },
                { name: 'Area Sales', value: 1250000000, color: '#8B5CF6' },
            ];
        } else {
            chartTitle = "Category Contribution";
            // Mock category data
            const baseVal = 12500000000 * multiplier;
            chartData = [
                { name: 'Fragrance', value: baseVal * 0.4, color: '#EC4899' },
                { name: 'Body Care', value: baseVal * 0.3, color: '#8B5CF6' },
                { name: 'Home Living', value: baseVal * 0.2, color: '#10B981' },
                { name: 'Bundles', value: baseVal * 0.1, color: '#F59E0B' },
            ];
        }

        const regionPerformance = [
            { region: 'Jabodetabek', sales: 4500 * multiplier, target: 4000 * multiplier },
            { region: 'West Java', sales: 2800 * multiplier, target: 3000 * multiplier },
            { region: 'Central Java', sales: 2100 * multiplier, target: 2000 * multiplier },
            { region: 'East Java', sales: 2400 * multiplier, target: 2500 * multiplier },
            { region: 'Sumatra', sales: 1800 * multiplier, target: 2000 * multiplier },
        ]; // In Millions

        return { kpiData, monthlyTrend, chartData, chartTitle, regionPerformance };
    }, [selectedChannel]);

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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Offline Sales Overview</h2>
                        <p className="text-sm text-gray-500 mt-1">Consolidated performance across offline channels</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        {/* Channel Filter */}
                        <div className="relative w-full sm:w-auto">
                            <select
                                value={selectedChannel}
                                onChange={(e) => setSelectedChannel(e.target.value)}
                                className="w-full sm:w-auto appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium text-gray-700 cursor-pointer"
                            >
                                {channelOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Date Picker */}
                        <div className="relative w-full sm:w-auto">
                            <button 
                                className="w-full sm:w-auto flex items-center justify-between sm:justify-start bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                onClick={() => setShowDatePicker(!showDatePicker)}
                            >
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">{formatDateRange()}</span>
                                </div>
                            </button>
                            {showDatePicker && (
                                <div className="absolute right-0 z-10 mt-2">
                                    <DateRangePicker 
                                        onClose={() => setShowDatePicker(false)} 
                                        onApply={handleDateApply} 
                                        align="right"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard 
                        title="Total Revenue" 
                        value={formatCurrency(kpiData.totalRevenue)} 
                        subValue="+12.5% vs Last Period" 
                        color="text-green-600" 
                    />
                    <MetricCard 
                        title="Target Achievement" 
                        value={`${kpiData.targetAchievement.toFixed(1)}%`} 
                        subValue="On Track" 
                        color="text-blue-600" 
                    />
                    <MetricCard 
                        title="Active Outlets" 
                        value={kpiData.activeOutlets} 
                        subValue="+50 New Outlets" 
                        color="text-purple-600" 
                    />
                    <MetricCard 
                        title="YoY Growth" 
                        value={`+${kpiData.growthYoY.toFixed(1)}%`} 
                        subValue="Strong Performance" 
                        color="text-green-600" 
                    />
                </div>

                {/* Charts Section 1: Trend & Contribution */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Monthly Sales Trend */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sales Trend (Millions)</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => formatCurrency(value * 1000000)} />
                                    <Legend />
                                    <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} name="Actual Sales" activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="target" stroke="#9CA3AF" strokeDasharray="5 5" strokeWidth={2} name="Target" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Channel/Category Contribution */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{chartTitle}</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Charts Section 2: Regional Performance */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Regional Performance vs Target (Millions)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={regionPerformance} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="region" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatCurrency(value * 1000000)} />
                                <Legend />
                                <Bar dataKey="sales" name="Actual Sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="target" name="Target" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}