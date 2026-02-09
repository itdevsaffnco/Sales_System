import React, { useState } from 'react';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import DateRangePicker from './DateRangePicker';
import IndonesiaMap from './IndonesiaMap';

export default function BDDistributorCoverage() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 11, 30),
        end: new Date(2026, 0, 28)
    });

    const [selectedDistributor, setSelectedDistributor] = useState('All Distributors');
    const [outletFilter, setOutletFilter] = useState('All'); // 'All', 'Old', 'New'
    const distributors = ['All Distributors', 'Distributor A', 'Distributor B', 'Distributor C', 'Distributor D', 'Distributor E'];

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

    const formatNumber = (value) => {
        return new Intl.NumberFormat('id-ID').format(value);
    };

    // Mock Data
    const metrics = {
        registered_outlet: 1250,
        active_outlet: 850,
        store_active_percent: 68,
        outlet_drop: 45,
        new_open_outlet: 120,
        ao_ro_ratio: 0.68
    };

    const coverageTrend = [
        { month: 'Aug', ro: 1100, ao: 720 },
        { month: 'Sep', ro: 1150, ao: 780 },
        { month: 'Oct', ro: 1180, ao: 800 },
        { month: 'Nov', ro: 1200, ao: 820 },
        { month: 'Dec', ro: 1220, ao: 840 },
        { month: 'Jan', ro: 1250, ao: 850 },
    ];

    const distributorLocations = [
        { name: 'Medan', value: 'Distributor A', lat: 3.5952, lng: 98.6722, status: 'Old' },
        { name: 'Jakarta', value: 'Distributor B', lat: -6.2088, lng: 106.8456, status: 'New' },
        { name: 'Surabaya', value: 'Distributor C', lat: -7.2575, lng: 112.7521, status: 'Old' },
        { name: 'Balikpapan', value: 'Distributor D', lat: -1.2379, lng: 116.8529, status: 'Old' },
        { name: 'Makassar', value: 'Distributor E', lat: -5.1477, lng: 119.4327, status: 'New' },
        { name: 'Bandung', value: 'Distributor F', lat: -6.9175, lng: 107.6191, status: 'New' },
        { name: 'Semarang', value: 'Distributor G', lat: -6.9667, lng: 110.4167, status: 'Old' },
        { name: 'Denpasar', value: 'Distributor H', lat: -8.6705, lng: 115.2126, status: 'New' }
    ];

    const filteredLocations = distributorLocations.filter(loc => {
        if (outletFilter === 'All') return true;
        return loc.status === outletFilter;
    });

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
                        <h2 className="text-2xl font-bold text-gray-800">Distributor Coverage</h2>
                        <p className="text-sm text-gray-500 mt-1">Outlet Performance & Expansion Analysis</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Distributor Filter */}
                        <div className="relative">
                            <select 
                                value={selectedDistributor}
                                onChange={(e) => setSelectedDistributor(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer text-sm font-medium h-full"
                            >
                                {distributors.map((dist) => (
                                    <option key={dist} value={dist}>{dist}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                </svg>
                            </div>
                        </div>

                        {/* Outlet Filter */}
                        <div className="relative">
                            <select 
                                value={outletFilter}
                                onChange={(e) => setOutletFilter(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer text-sm font-medium h-full"
                            >
                                <option value="All">All Outlets</option>
                                <option value="Old">Old Outlet</option>
                                <option value="New">New Outlet</option>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <MetricCard 
                        title="Active Outlets (AO)" 
                        value={formatNumber(metrics.active_outlet)} 
                        subValue={`${metrics.store_active_percent}%`}
                        subLabel="Active Ratio"
                        color="text-green-600"
                    />
                    <MetricCard 
                        title="Registered Outlets (RO)" 
                        value={formatNumber(metrics.registered_outlet)} 
                        subValue="Total Database"
                        color="text-blue-600"
                    />
                    <MetricCard 
                        title="AO vs RO Ratio" 
                        value={metrics.ao_ro_ratio.toFixed(2)} 
                        subValue="Productivity Index"
                        color="text-purple-600"
                    />
                    <MetricCard 
                        title="New Open Outlet (NOO)" 
                        value={formatNumber(metrics.new_open_outlet)} 
                        subValue="Expansion"
                        color="text-blue-500"
                    />
                    <MetricCard 
                        title="Outlet Drop" 
                        value={formatNumber(metrics.outlet_drop)} 
                        subValue="Inactive"
                        color="text-red-500"
                    />
                    <MetricCard 
                        title="% Store Active" 
                        value={`${metrics.store_active_percent}%`} 
                        subValue="Health Score"
                        color={metrics.store_active_percent > 60 ? 'text-green-600' : 'text-orange-500'}
                    />
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Distributor Coverage Map</h3>
                    <div className="w-full h-96">
                        <IndonesiaMap locations={filteredLocations} />
                    </div>
                </div>

                {/* Coverage Trend Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Coverage Trend (AO vs RO)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={coverageTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRo" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorAo" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Area type="monotone" dataKey="ro" name="Registered Outlet" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRo)" strokeWidth={2} />
                                <Area type="monotone" dataKey="ao" name="Active Outlet" stroke="#10B981" fillOpacity={1} fill="url(#colorAo)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
