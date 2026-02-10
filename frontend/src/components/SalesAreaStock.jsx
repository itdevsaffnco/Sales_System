import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import DateRangePicker from './DateRangePicker';

export default function SalesAreaStock() {
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
    const stockOnHandData = [
        { area: 'Jabodetabek', mt: 5000, gt: 8000, online: 2000 },
        { area: 'West Java', mt: 3000, gt: 6000, online: 1500 },
        { area: 'Central Java', mt: 2500, gt: 4000, online: 1000 },
        { area: 'East Java', mt: 4000, gt: 5500, online: 1800 },
    ];

    const agingStockData = [
        { area: 'Jabodetabek', fresh: 80, aging: 15, obsolete: 5 },
        { area: 'West Java', fresh: 75, aging: 20, obsolete: 5 },
        { area: 'East Java', fresh: 85, aging: 10, obsolete: 5 },
    ];

    const transferStockData = [
        { id: 1, date: '2026-02-01', from: 'Warehouse A', to: 'Store B', item: 'Serum X', qty: 50, status: 'Completed' },
        { id: 2, date: '2026-02-03', from: 'Warehouse A', to: 'Store C', item: 'Toner Y', qty: 30, status: 'Pending' },
        { id: 3, date: '2026-02-05', from: 'Warehouse B', to: 'Store A', item: 'Cream Z', qty: 40, status: 'In Transit' },
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
                        <h2 className="text-2xl font-bold text-gray-800">Sales Area Stock & Inventory</h2>
                        <p className="text-sm text-gray-500 mt-1">Stock levels, aging, and transfers</p>
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
                    <MetricCard title="Stock Value" value="IDR 12.5B" subValue="Across all channels" color="text-green-500" />
                    <MetricCard title="OOS Rate" value="4.2%" subValue="-1.5% vs Last Month" color="text-red-500" />
                    <MetricCard title="Aging Stock (>3M)" value="15%" subValue="Needs attention" color="text-yellow-500" />
                    <MetricCard title="Pending Transfers" value="12" subValue="Items in transit" color="text-blue-500" />
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock on Hand per Channel</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stockOnHandData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" />
                                    <YAxis dataKey="area" type="category" width={100} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="mt" name="Modern Trade" stackId="a" fill="#3B82F6" />
                                    <Bar dataKey="gt" name="General Trade" stackId="a" fill="#10B981" />
                                    <Bar dataKey="online" name="Online" stackId="a" fill="#F59E0B" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Return & Aging Stock</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={agingStockData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="area" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="fresh" name="Fresh Stock (<3M)" stackId="a" fill="#10B981" />
                                    <Bar dataKey="aging" name="Aging (3-6M)" stackId="a" fill="#F59E0B" />
                                    <Bar dataKey="obsolete" name="Obsolete (>6M)" stackId="a" fill="#EF4444" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Transfer Stock Table */}
                <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">Transfer Stock & Open Tester (Consignment)</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                    <th className="px-6 py-3 font-medium">Date</th>
                                    <th className="px-6 py-3 font-medium">From</th>
                                    <th className="px-6 py-3 font-medium">To</th>
                                    <th className="px-6 py-3 font-medium">Item</th>
                                    <th className="px-6 py-3 font-medium text-right">Qty</th>
                                    <th className="px-6 py-3 font-medium text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {transferStockData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-700">{item.date}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{item.from}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{item.to}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{item.item}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 text-right">{item.qty}</td>
                                        <td className="px-6 py-4 text-sm text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {item.status}
                                            </span>
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
