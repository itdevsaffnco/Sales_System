import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../api/axios';

export default function SalesForm() {
    const [searchParams] = useSearchParams();
    const channelFromUrl = searchParams.get('channel') || '';
    const onlinePlatforms = [
        'SHOPEE',
        'TOKOPEDIA',
        'TIKTOK SELLER',
        'LAZADA',
        'BLIBLI',
        'ZALORA',
        'Website',
        'Whatsapp (Local)',
        'Whatsapp (Overseas)',
    ];
    const inferredType = channelFromUrl ? (onlinePlatforms.includes(channelFromUrl) ? 'online' : 'offline') : '';
    const [formData, setFormData] = useState({
        entry_type: '',
        date_period: '',
        platform: '',
        channel: '',
        account: '',
        sku_name: '',
        sku_code: '',
        channel_distribution: '',
        pricing_rsp_new: '',
        pricing_rsp_old: '',
        qty: '',
        margin: '',
        brand_disc: '',
        brand_voucher: '',
        revenue: '',
        channel_remarks: '',
        sales_date: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!channelFromUrl) return;

        setFormData((prev) => {
            const next = { ...prev };
            next.entry_type = inferredType;
            if (inferredType === 'online') {
                next.platform = channelFromUrl;
                next.channel = '';
                next.channel_distribution = channelFromUrl;
            } else {
                next.channel = channelFromUrl;
                next.platform = '';
                next.channel_distribution = channelFromUrl;
            }
            return next;
        });
    }, [channelFromUrl, inferredType]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            Object.keys(payload).forEach((key) => {
                if (payload[key] === '') payload[key] = null;
            });
            await api.post('/sales-entries', payload);
            setMessage('Sales entry created successfully!');
            setFormData({
                entry_type: inferredType || '',
                date_period: '',
                platform: inferredType === 'online' ? channelFromUrl : '',
                channel: inferredType === 'offline' ? channelFromUrl : '',
                account: '',
                sku_name: '',
                sku_code: '',
                channel_distribution: channelFromUrl || '',
                pricing_rsp_new: '',
                pricing_rsp_old: '',
                qty: '',
                margin: '',
                brand_disc: '',
                brand_voucher: '',
                revenue: '',
                channel_remarks: '',
                sales_date: ''
            });
        } catch (error) {
            console.error(error);
            setMessage('Error creating sales entry');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center py-4 px-6 bg-white border-b-4 border-indigo-600">
                    <h1 className="text-2xl font-semibold text-gray-800">Sales Entry</h1>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-6 py-8">
                        <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                                        <select
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="entry_type"
                                            value={formData.entry_type}
                                            onChange={handleChange}
                                            required
                                            disabled={Boolean(channelFromUrl)}
                                        >
                                            <option value="">Select type</option>
                                            <option value="online">Online</option>
                                            <option value="offline">Offline</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Date Period</label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="date_period"
                                            type="text"
                                            placeholder="e.g. 2026-01 or 2026-01-01 to 2026-01-31"
                                            value={formData.date_period}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {formData.entry_type === 'online' && (
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Platform</label>
                                            <input
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                name="platform"
                                                type="text"
                                                value={formData.platform}
                                                onChange={handleChange}
                                                required
                                                readOnly={Boolean(channelFromUrl)}
                                            />
                                        </div>
                                    )}

                                    {formData.entry_type === 'offline' && (
                                        <>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">Channel</label>
                                                <input
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    name="channel"
                                                    type="text"
                                                    value={formData.channel}
                                                    onChange={handleChange}
                                                    required
                                                    readOnly={Boolean(channelFromUrl)}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">Account</label>
                                                <input
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    name="account"
                                                    type="text"
                                                    value={formData.account}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">SKU Name</label>
                                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="sku_name" type="text" value={formData.sku_name} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">SKU Code</label>
                                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="sku_code" type="text" value={formData.sku_code} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">RSP</label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="pricing_rsp_new"
                                            type="number"
                                            value={formData.pricing_rsp_new}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">QTY</label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="qty"
                                            type="number"
                                            value={formData.qty}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {formData.entry_type === 'offline' && (
                                        <>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">Old RSP</label>
                                                <input
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    name="pricing_rsp_old"
                                                    type="number"
                                                    value={formData.pricing_rsp_old}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">Margin</label>
                                                <input
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    name="margin"
                                                    type="number"
                                                    value={formData.margin}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Brand Disc</label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="brand_disc"
                                            type="number"
                                            value={formData.brand_disc}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Brand Voucher</label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="brand_voucher"
                                            type="number"
                                            value={formData.brand_voucher}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Revenue</label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="revenue"
                                            type="number"
                                            value={formData.revenue}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Remarks</label>
                                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="channel_remarks" value={formData.channel_remarks} onChange={handleChange}></textarea>
                                </div>
                                {message && <p className={`mb-4 ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
                                <div className="flex items-center justify-between">
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                        Submit Entry
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
