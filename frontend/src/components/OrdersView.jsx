import React, { useState } from 'react';
import { format } from 'date-fns';
import DateRangePicker from './DateRangePicker';

import shopeeIcon from '../assets/channel/shopee.svg';
import tiktokIcon from '../assets/channel/tiktok.svg';
import lazadaIcon from '../assets/channel/lazada.svg';
import blibliIcon from '../assets/channel/blibli.svg';
import zaloraIcon from '../assets/channel/zalora.svg';
import websiteIcon from '../assets/channel/website.svg';

export default function OrdersView() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 11, 30), // 30 Dec 2025
        end: new Date(2026, 0, 28)     // 28 Jan 2026
    });

    const [activeFilters, setActiveFilters] = useState([]);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [filterSearch, setFilterSearch] = useState('');
    
    // Shop Filter State
    const [activeFilterDropdown, setActiveFilterDropdown] = useState(null);
    const [shopSearch, setShopSearch] = useState('');

    const shopOptions = [
        { id: 'saff_shopee', name: 'Saff & Co MY', icon: shopeeIcon },
        { id: 'saff_tiktok', name: 'SAFF & Co. MY', icon: tiktokIcon },
        { id: 'saff_lazada', name: 'Saff & Co Lazada', icon: lazadaIcon },
        { id: 'saff_blibli', name: 'Saff & Co Blibli', icon: blibliIcon },
        { id: 'saff_zalora', name: 'Saff & Co Zalora', icon: zaloraIcon },
        { id: 'saff_website', name: 'Saff & Co Website', icon: websiteIcon },
    ];

    const availableFilters = [
        { 
            id: 'shop', 
            label: 'Shop', 
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            )
        },
        { 
            id: 'product', 
            label: 'Product', 
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ) 
        },
        { 
            id: 'status', 
            label: 'Status', 
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            )
        },
    ];

    const getFilteredOptions = () => {
        return availableFilters.filter(f => 
            !activeFilters.find(af => af.id === f.id) &&
            f.label.toLowerCase().includes(filterSearch.toLowerCase())
        );
    };

    const handleAddFilter = (filter) => {
        setActiveFilters([...activeFilters, { ...filter, value: 'None' }]);
        setIsFilterMenuOpen(false);
        setFilterSearch('');
    };

    const removeFilter = (filterId) => {
        setActiveFilters(activeFilters.filter(f => f.id !== filterId));
        if (activeFilterDropdown === filterId) {
            setActiveFilterDropdown(null);
        }
    };

    const toggleShopSelection = (shopId) => {
        const currentFilter = activeFilters.find(f => f.id === 'shop');
        if (!currentFilter) return;
        
        const currentSelected = currentFilter.selectedValues || [];
        const newSelected = currentSelected.includes(shopId)
            ? currentSelected.filter(id => id !== shopId)
            : [...currentSelected, shopId];
            
        const newValue = newSelected.length === 0 ? 'None' : `${newSelected.length} Selected`;
        
        setActiveFilters(activeFilters.map(f => 
            f.id === 'shop' 
                ? { ...f, value: newValue, selectedValues: newSelected } 
                : f
        ));
    };

    const clearShopSelection = () => {
         setActiveFilters(activeFilters.map(f => 
            f.id === 'shop' 
                ? { ...f, value: 'None', selectedValues: [] } 
                : f
        ));
    };

    const getFilteredShops = () => {
        return shopOptions.filter(shop => 
            shop.name.toLowerCase().includes(shopSearch.toLowerCase())
        );
    };

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

    return (
        <div className="flex-1 bg-gray-50 p-8 overflow-y-auto h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                    <div className="flex items-center mt-4 flex-wrap gap-2">
                        <div className="flex items-center text-base font-medium text-gray-900 mr-2">
                            <svg className="w-5 h-5 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                            Filters:
                        </div>

                        {activeFilters.map(filter => (
                            <div key={filter.id} className="relative">
                                <div className={`flex items-center bg-white border ${activeFilterDropdown === filter.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'} rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors`}>
                                    <span className="mr-2 text-gray-500">{filter.icon}</span>
                                    {filter.label}: {filter.value}
                                    <div className="ml-2 flex items-center space-x-1 pl-2 border-l border-gray-200">
                                         <svg 
                                            onClick={() => setActiveFilterDropdown(activeFilterDropdown === filter.id ? null : filter.id)}
                                            className={`w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600 transform transition-transform ${activeFilterDropdown === filter.id ? 'rotate-180' : ''}`} 
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                         <button onClick={() => removeFilter(filter.id)} className="text-gray-400 hover:text-red-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                         </button>
                                    </div>
                                </div>
                                
                                {/* Shop Dropdown */}
                                {activeFilterDropdown === 'shop' && filter.id === 'shop' && (
                                    <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-30">
                                        <div className="p-2 border-b border-gray-100">
                                            <div className="relative">
                                                <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                                <input 
                                                    type="text" 
                                                    placeholder="Search..." 
                                                    className="w-full pl-9 pr-3 py-1.5 text-sm border-none focus:ring-0 focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
                                                    value={shopSearch}
                                                    onChange={(e) => setShopSearch(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <div className="py-1 max-h-60 overflow-y-auto">
                                            {getFilteredShops().map(shop => {
                                                const isSelected = (filter.selectedValues || []).includes(shop.id);
                                                return (
                                                    <div 
                                                        key={shop.id}
                                                        onClick={() => toggleShopSelection(shop.id)}
                                                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                                    >
                                                        <span className="truncate">{shop.name}</span>
                                                        <div className="flex items-center">
                                                            <img src={shop.icon} alt="" className="w-5 h-5 object-contain mr-2" />
                                                            {isSelected && (
                                                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {getFilteredShops().length === 0 && (
                                                <div className="px-4 py-3 text-sm text-gray-500 text-center">No shops found</div>
                                            )}
                                        </div>
                                        <div className="p-2 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                                            <span className="text-xs text-gray-500 font-medium">
                                                {(filter.selectedValues || []).length} of {shopOptions.length} selected
                                            </span>
                                            <button 
                                                onClick={clearShopSelection}
                                                className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="relative">
                            <button 
                                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                                className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 transition-colors flex items-center"
                            >
                                Add Filter <span className="ml-1 text-lg leading-none">+</span>
                            </button>

                            {isFilterMenuOpen && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-20">
                                    <div className="p-2 border-b border-gray-100">
                                        <div className="relative">
                                            <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                            <input 
                                                type="text" 
                                                placeholder="Filter by..." 
                                                className="w-full pl-9 pr-3 py-1.5 text-sm border-none focus:ring-0 focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
                                                value={filterSearch}
                                                onChange={(e) => setFilterSearch(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <div className="py-1 max-h-60 overflow-y-auto">
                                        {getFilteredOptions().map(option => (
                                            <button 
                                                key={option.id}
                                                onClick={() => handleAddFilter(option)}
                                                className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors"
                                            >
                                                <span className="mr-3 text-gray-500">{option.icon}</span>
                                                {option.label}
                                            </button>
                                        ))}
                                        {getFilteredOptions().length === 0 && (
                                            <div className="px-4 py-3 text-sm text-gray-500 text-center">No filters found</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
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
                        />
                    )}
                </div>
            </div>

            {/* Overall Stats */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard 
                    title="Gross Revenue" 
                    value="RP. 514,000,000" 
                    icons={[shopeeIcon, tiktokIcon, lazadaIcon, blibliIcon, zaloraIcon, websiteIcon]} 
                />
                <StatCard 
                    title="Total GMV" 
                    value="RP. 414,000,000" 
                    icons={[shopeeIcon, tiktokIcon, lazadaIcon, blibliIcon, zaloraIcon, websiteIcon]} 
                />
                <StatCard 
                    title="Number of Paid Orders" 
                    value="212" 
                    icons={[shopeeIcon, tiktokIcon, lazadaIcon, blibliIcon, zaloraIcon, websiteIcon]} 
                />
                <StatCard 
                    title="Average Order Value" 
                    value="RP. 290,000,000" 
                    icons={[shopeeIcon, tiktokIcon, lazadaIcon, blibliIcon, zaloraIcon, websiteIcon]} 
                />
                <StatCard 
                    title="Average Items Per Order" 
                    value="2.2" 
                    icons={[shopeeIcon, tiktokIcon, lazadaIcon, blibliIcon, zaloraIcon, websiteIcon]} 
                />
                <StatCard 
                    title="Total Items" 
                    value="330" 
                    icons={[shopeeIcon, tiktokIcon, lazadaIcon, blibliIcon, zaloraIcon, websiteIcon]} 
                />
            </div>

            {/* Search */}
            <div className="mb-6 flex justify-end">
                 <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search Order ID"
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                    />
                    {/* Search icon placeholder, strictly usually on left or right, standard is left but design might imply right or simple input */}
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
                            {/* Empty state for now */}
                            <tr>
                                <td colSpan="11" className="px-6 py-12 text-center text-sm text-gray-500">
                                    No orders data available
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icons = [] }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="flex space-x-2 mb-3">
                {/* Platform Icons */}
                <div className="flex space-x-1">
                    {icons.map((icon, index) => (
                        <img 
                            key={index} 
                            src={icon} 
                            alt="Channel" 
                            className="w-5 h-5 object-contain transform hover:scale-150 transition-transform duration-200" 
                        />
                    ))}
                </div>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-3xl font-medium text-gray-900">{value}</p>
        </div>
    );
}
