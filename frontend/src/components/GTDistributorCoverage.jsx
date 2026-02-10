import React, { useState } from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function GTDistributorCoverage() {
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

    const formatNumber = (value) => {
        return new Intl.NumberFormat('id-ID').format(value);
    };

    // Mock Data
    const coverageMetrics = {
        active_outlets: 85,
        registered_outlets: 120,
        new_open_outlets: 8,
        outlet_drop: 3,
        total_sku_listing: 45
    };

    const coverageByDistributor = [
        { name: 'GT Distributor A', ao: 25, ro: 30, noo: 2, sku: 45 },
        { name: 'GT Distributor B', ao: 20, ro: 35, noo: 1, sku: 40 },
        { name: 'GT Distributor C', ao: 18, ro: 20, noo: 3, sku: 42 },
        { name: 'GT Distributor D', ao: 15, ro: 20, noo: 1, sku: 38 },
        { name: 'GT Distributor E', ao: 7, ro: 15, noo: 1, sku: 35 },
    ];

    const aoVsRoData = [
        { name: 'Active (AO)', value: coverageMetrics.active_outlets },
        { name: 'Inactive (RO-AO)', value: coverageMetrics.registered_outlets - coverageMetrics.active_outlets },
    ];

    const COLORS = ['#10B981', '#E5E7EB'];

    const MetricCard = ({ title, value, subValue, subLabel, color }) => (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
            {subValue && (
                <p className={`text-xs mt-1 ${color || 'text-gray-500'}`}>
                    {subValue} <span className="text-gray-400">{subLabel}</span>
                </p>
            )}
        </div>
    );

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Coverage & SKU</h2>
                        <p className="text-sm text-gray-500 mt-1">Outlet coverage and SKU listing status</p>
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

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard 
                        title="Active Outlets (AO)" 
                        value={formatNumber(coverageMetrics.active_outlets)}
                        subValue={`${((coverageMetrics.active_outlets / coverageMetrics.registered_outlets) * 100).toFixed(0)}%`}
                        subLabel="of Registered"
                        color="text-purple-600"
                    />
                    <MetricCard 
                        title="Registered Outlets (RO)" 
                        value={formatNumber(coverageMetrics.registered_outlets)}
                        subValue="Total Database"
                        color="text-gray-600"
                    />
                    <MetricCard 
                        title="New Open Outlets (NOO)" 
                        value={formatNumber(coverageMetrics.new_open_outlets)}
                        subValue="This Period"
                        color="text-orange-500"
                    />
                     <MetricCard 
                        title="Total SKU Listing" 
                        value={formatNumber(coverageMetrics.total_sku_listing)}
                        subValue="Items"
                        color="text-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* AO vs RO Chart */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Coverage Status</h3>
                        <div className="h-64 flex justify-center items-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={aoVsRoData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {aoVsRoData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-sm text-gray-500">Active vs Inactive Outlets</p>
                        </div>
                    </div>

                    {/* Coverage by Distributor */}
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Outlet Status by Distributor</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={coverageByDistributor} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tickFormatter={(val) => val.replace('GT Distributor ', 'Dist ')} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="ao" name="Active (AO)" fill="#10B981" />
                                    <Bar dataKey="ro" name="Registered (RO)" fill="#9CA3AF" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Detailed Table */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Coverage & SKU Detail</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distributor</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Active Outlets</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Registered Outlets</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Active %</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">NOO</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">SKU Count</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {coverageByDistributor.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{item.ao}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{item.ro}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${(item.ao / item.ro) > 0.7 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {((item.ao / item.ro) * 100).toFixed(0)}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{item.noo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{item.sku}</td>
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
