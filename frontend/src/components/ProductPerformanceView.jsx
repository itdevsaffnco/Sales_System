import React, { useState } from 'react';
import { format } from 'date-fns';
import DateRangePicker from './DateRangePicker';

export default function ProductPerformanceView() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 11, 30), // 30 Dec 2025
        end: new Date(2026, 0, 28)     // 28 Jan 2026
    });
    const [activeMainTab, setActiveMainTab] = useState('Performa Produk');
    const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
    const [searchQuery, setSearchQuery] = useState('');
    const channels = ['All', 'Shopee', 'Tiktok', 'Lazada', 'Blibli', 'Zalora', 'Website'];
    const [activeChannel, setActiveChannel] = useState('All');

    const mainTabs = ['Tinjauan Produk', 'Kunjungan Produk', 'Performa Produk', 'Analisis Produk'];

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

    // Mock Data based on screenshot
    const products = [
        {
            id: '5166139866',
            name: 'SAFF & Co. Extrait de Parfum - TRAVEL SIZE (30ml)',
            image: 'https://placehold.co/60x60?text=Saff',
            views: 2308,
            addToCart: 595,
            readyOrders: 88,
            salesValue: 'Rp6.323,63K',
            status: 'active'
        },
        {
            id: '27753628460',
            name: 'SAFF & Co. Extrait de Parfum - IRAI L...',
            image: 'https://placehold.co/60x60?text=Saff',
            views: 1465,
            addToCart: 368,
            readyOrders: 47,
            salesValue: 'Rp9.083,29K',
            status: 'active'
        },
        {
            id: '20634545364',
            name: 'SAFF & Co. Extrait de Parfum - S.O.T.B',
            image: 'https://placehold.co/60x60?text=Saff',
            views: 1388,
            addToCart: 293,
            readyOrders: 34,
            salesValue: 'Rp7.336,60K',
            status: 'active'
        }
    ];

    const formatNumber = (num) => {
        return num.toLocaleString('id-ID');
    };

    return (
        <div className="flex-1 bg-gray-50 p-8 overflow-y-auto h-full">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-gray-900">Product Performance</h1>
                <div className="relative">
                    <button 
                        className="flex items-center gap-2 bg-white border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDatePicker(!showDatePicker)}
                    >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDateRange()}
                    </button>
                    {showDatePicker && (
                        <div className="absolute top-full right-0 mt-2 z-50">
                            <DateRangePicker onClose={() => setShowDatePicker(false)} onApply={handleDateApply} align="right" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="bg-gray-100 p-1 rounded-lg flex flex-wrap gap-1">
                    {channels.map((ch) => (
                        <button
                            key={ch}
                            onClick={() => setActiveChannel(ch)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeChannel === ch ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
                        >
                            {ch}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="Search Order ID"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Informasi Produk</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Halaman Produk Dilihat 
                                    <span className="inline-block ml-1 text-gray-400">ⓘ</span>
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dimasukkan ke Keranjang 
                                    <br/>(Produk) <span className="inline-block ml-1 text-gray-400">ⓘ</span>
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Produk (Pesanan Siap Dikirim) 
                                    <span className="inline-block ml-1 text-gray-400">ⓘ</span>
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Penjualan (Pesanan Siap Dikirim) 
                                    <span className="inline-block ml-1 text-gray-400">ⓘ</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden border border-gray-200">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{product.name}</p>
                                                <p className="text-xs text-gray-500">ID Produk: {product.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right text-sm text-gray-700">{formatNumber(product.views)}</td>
                                    <td className="px-4 py-4 text-right text-sm text-gray-700">{formatNumber(product.addToCart)}</td>
                                    <td className="px-4 py-4 text-right text-sm text-gray-700">{formatNumber(product.readyOrders)}</td>
                                    <td className="px-4 py-4 text-right text-sm text-gray-700">{product.salesValue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
