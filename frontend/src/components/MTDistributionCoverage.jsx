import React, { useState } from 'react';
import { format } from 'date-fns';
import DateRangePicker from './DateRangePicker';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

// Fix for Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MTDistributionCoverage = () => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 11, 30), // 30 Dec 2025
        end: new Date(2026, 0, 28)     // 28 Jan 2026
    });
    const [selectedChannel, setSelectedChannel] = useState('All Channels');
    const [selectedOutletStatus, setSelectedOutletStatus] = useState('All Status');

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
    const coverageData = [
        { name: 'Active Stores', value: 850, color: '#10B981' },
        { name: 'Inactive Stores', value: 150, color: '#EF4444' },
    ];

    const coverageByAccount = [
        { account: 'Alfamex', active: 300, total: 320, new: 20 },
        { account: 'Indomart', active: 280, total: 300, new: 15 },
        { account: 'Hypermart', active: 150, total: 180, new: 5 },
        { account: 'SuperIndo', active: 120, total: 200, new: 10 },
    ];

    const channels = ['All Channels', ...coverageByAccount.map(d => d.account)];
    const outletStatuses = ['All Status', 'New Outlet', 'Existing Outlet'];

    const storeLocations = [
        { id: 1, name: 'Alfamex Jakarta Central', lat: -6.2088, lng: 106.8456, type: 'Active', channel: 'Alfamex', status: 'Existing Outlet' },
        { id: 2, name: 'Indomart Surabaya East', lat: -7.2575, lng: 112.7521, type: 'Active', channel: 'Indomart', status: 'Existing Outlet' },
        { id: 3, name: 'Hypermart Bandung Indah', lat: -6.9175, lng: 107.6191, type: 'Inactive', channel: 'Hypermart', status: 'Existing Outlet' },
        { id: 4, name: 'SuperIndo Medan Kota', lat: 3.5952, lng: 98.6722, type: 'Active', channel: 'SuperIndo', status: 'New Outlet' },
        { id: 5, name: 'Alfamex Denpasar', lat: -8.4095, lng: 115.1889, type: 'Active', channel: 'Alfamex', status: 'Existing Outlet' },
        { id: 6, name: 'Indomart Makassar', lat: -5.1477, lng: 119.4327, type: 'Active', channel: 'Indomart', status: 'New Outlet' },
        { id: 7, name: 'Hypermart Semarang', lat: -6.9667, lng: 110.4167, type: 'Inactive', channel: 'Hypermart', status: 'Existing Outlet' },
        { id: 8, name: 'SuperIndo Yogyakarta', lat: -7.7956, lng: 110.3695, type: 'Active', channel: 'SuperIndo', status: 'Existing Outlet' },
        { id: 9, name: 'Indomart Balikpapan', lat: -1.2379, lng: 116.8529, type: 'Active', channel: 'Indomart', status: 'Existing Outlet' },
        { id: 10, name: 'Alfamex Palembang', lat: -2.9761, lng: 104.7754, type: 'Active', channel: 'Alfamex', status: 'New Outlet' },
    ];

    // Filter Logic
    const filteredStoreLocations = storeLocations.filter(store => {
        const matchChannel = selectedChannel === 'All Channels' || store.channel === selectedChannel;
        const matchStatus = selectedOutletStatus === 'All Status' || store.status === selectedOutletStatus;
        return matchChannel && matchStatus;
    });

    const filteredCoverageByAccount = coverageByAccount
        .filter(d => selectedChannel === 'All Channels' || d.account === selectedChannel)
        .map(d => {
            if (selectedOutletStatus === 'All Status') return d;
            if (selectedOutletStatus === 'New Outlet') {
                return { ...d, active: d.new, total: d.total }; // Show only new active outlets
            }
            if (selectedOutletStatus === 'Existing Outlet') {
                return { ...d, active: d.active - d.new, total: d.total }; // Show only existing active outlets
            }
            return d;
        });

    // Recalculate Pie Data based on filtered accounts
    const totalActive = filteredCoverageByAccount.reduce((acc, curr) => acc + curr.active, 0);
    const totalPotential = filteredCoverageByAccount.reduce((acc, curr) => acc + curr.total, 0);
    const totalInactive = totalPotential - totalActive;

    // Additional Mock Metrics
    const noo = selectedChannel === 'All Channels' ? 120 : Math.round(120 / (channels.length - 1));
    const outletDrop = selectedChannel === 'All Channels' ? 45 : Math.round(45 / (channels.length - 1));
    const aoVsRoRatio = totalPotential > 0 ? (totalActive / totalPotential).toFixed(2) : 0;
    const activeRatio = totalPotential > 0 ? ((totalActive / totalPotential) * 100).toFixed(0) : 0;

    const filteredCoverageData = [
        { name: 'Active Stores', value: totalActive, color: '#10B981' },
        { name: 'Inactive Stores', value: totalInactive, color: '#EF4444' },
    ];

    const StatCard = ({ title, value, subLabel, subLabelColor = "text-gray-500" }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md">
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
            </div>
            <p className={`text-sm mt-4 font-medium ${subLabelColor}`}>{subLabel}</p>
        </div>
    );

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
      
        return (
          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        );
    };

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 pb-24">
            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">MT Distribution Coverage</h2>
                        <p className="text-sm text-gray-500 mt-1">Outlet Distribution & Availability</p>
                    </div>
                    
                    <div className="flex gap-4">
                        {/* Channel Filter */}
                        <div className="relative">
                            <select
                                value={selectedChannel}
                                onChange={(e) => setSelectedChannel(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                            >
                                {channels.map((channel) => (
                                    <option key={channel} value={channel}>{channel}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>

                        {/* Outlet Status Filter */}
                        <div className="relative">
                            <select
                                value={selectedOutletStatus}
                                onChange={(e) => setSelectedOutletStatus(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                            >
                                {outletStatuses.map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>

                        {/* Date Range Picker */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{formatDateRange()}</span>
                            </button>
                            {showDatePicker && (
                                <div className="absolute right-0 mt-2 z-50">
                                    <DateRangePicker
                                        startDate={dateRange.start}
                                        endDate={dateRange.end}
                                        onApply={handleDateApply}
                                        onCancel={() => setShowDatePicker(false)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatCard 
                        title="Active Outlets (AO)" 
                        value={totalActive.toLocaleString()} 
                        subLabel={`${activeRatio}% Active Ratio`}
                        subLabelColor="text-green-600"
                    />
                    <StatCard 
                        title="Registered Outlets (RO)" 
                        value={totalPotential.toLocaleString()} 
                        subLabel="Total Database"
                        subLabelColor="text-blue-600"
                    />
                    <StatCard 
                        title="AO vs RO Ratio" 
                        value={aoVsRoRatio} 
                        subLabel="Productivity Index"
                        subLabelColor="text-purple-600"
                    />
                    <StatCard 
                        title="New Open Outlet (NOO)" 
                        value={noo} 
                        subLabel="Expansion"
                        subLabelColor="text-blue-600"
                    />
                    <StatCard 
                        title="Outlet Drop" 
                        value={outletDrop} 
                        subLabel="Inactive"
                        subLabelColor="text-red-600"
                    />
                    <StatCard 
                        title="% Store Active" 
                        value={`${activeRatio}%`} 
                        subLabel="Health Score"
                        subLabelColor="text-green-600"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Overall Coverage */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Overall Store Coverage</h3>
                        <div className="h-80 flex justify-center items-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={filteredCoverageData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomLabel}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {filteredCoverageData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-gray-500">Total Registered Stores: <span className="font-bold text-gray-800">{totalPotential.toLocaleString()}</span></p>
                        </div>
                    </div>

                    {/* Coverage by Account */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Coverage by Account</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={filteredCoverageByAccount}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="account" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Legend />
                                    <Bar dataKey="active" name="Active" stackId="a" fill="#10B981" />
                                    <Bar dataKey="total" name="Total Potential" stackId="a" fill="#E5E7EB" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Distribution Map */}
                <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Outlet Distribution Map</h3>
                    <div className="h-96 w-full rounded-xl overflow-hidden z-0">
                         <MapContainer center={[-2.5489, 118.0149]} zoom={5} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {filteredStoreLocations.map(store => (
                                <Marker key={store.id} position={[store.lat, store.lng]}>
                                    <Popup>
                                        <div className="p-1">
                                            <h4 className="font-bold text-sm">{store.name}</h4>
                                            <p className="text-xs text-gray-500 mb-1">{store.channel}</p>
                                            <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${store.type === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {store.type}
                                            </span>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MTDistributionCoverage;
