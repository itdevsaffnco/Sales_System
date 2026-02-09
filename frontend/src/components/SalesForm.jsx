import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import OrdersView from './OrdersView';
import ProductPerformanceView from './ProductPerformanceView';
import LiveStreamingView from './LiveStreamingView';
import AffiliateView from './AffiliateView';
import CRMView from './CRMView';
import InventoryHealthView from './InventoryHealthView';
import OperationsHealthView from './OperationsHealthView';
import AdsView from './AdsView';
import QuickView from './QuickView';
import OfficialStoreOverview from './OfficialStoreOverview';
import OfficialStorePromotion from './OfficialStorePromotion';
import OfficialStoreStock from './OfficialStoreStock';
import OfficialStoreCost from './OfficialStoreCost';
import BDOverview from './BDOverview';
import BDEcommerce from './BDEcommerce';
import BDOfflineDistributor from './BDOfflineDistributor';
import BDDistributorSales from './BDDistributorSales';
import BDDistributorAccountSKU from './BDDistributorAccountSKU';
import BDDistributorCoverage from './BDDistributorCoverage';
import BDDistributorCost from './BDDistributorCost';
import BDOfflineEvent from './BDOfflineEvent';
import BDEventSales from './BDEventSales';
import BDEventProduct from './BDEventProduct';
import BDEventPromotion from './BDEventPromotion';
import BDEventCost from './BDEventCost';
import BDEcommerceMY from './BDEcommerceMY';
import api from '../api/axios';

export default function SalesForm() {
    const [searchParams] = useSearchParams();
    const channelFromUrl = searchParams.get('channel') || '';
    const typeFromUrl = searchParams.get('type');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className={`flex justify-between items-center h-16 px-6 bg-white ${(typeFromUrl === 'orders' || typeFromUrl === 'performance' || typeFromUrl === 'livestreaming' || typeFromUrl === 'affiliate' || typeFromUrl === 'crm' || typeFromUrl === 'inventory' || typeFromUrl === 'operations' || typeFromUrl === 'quickview' || typeFromUrl === 'ads' || typeFromUrl === 'bd-overview' || typeFromUrl === 'bd-ecommerce' || typeFromUrl === 'bd-distributor' || typeFromUrl === 'bd-distributor-sales' || typeFromUrl === 'bd-distributor-account' || typeFromUrl === 'bd-distributor-coverage' || typeFromUrl === 'bd-distributor-cost' || typeFromUrl === 'bd-event' || typeFromUrl === 'bd-event-sales' || typeFromUrl === 'bd-event-product' || typeFromUrl === 'bd-event-promotion' || typeFromUrl === 'bd-event-cost' || typeFromUrl === 'bd-ecommerce-my' || typeFromUrl === 'offline-quick-overview' || typeFromUrl === 'offline-mt' || typeFromUrl === 'offline-area-sales' || typeFromUrl === 'offline-store-overview' || typeFromUrl === 'offline-store-promotion' || typeFromUrl === 'offline-store-stock' || typeFromUrl === 'offline-store-cost') ? 'border-b border-gray-200' : 'border-b-4 border-indigo-600'}`}>
                    <div className="flex items-center">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="mr-4 p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        {typeFromUrl !== 'orders' && typeFromUrl !== 'performance' && typeFromUrl !== 'livestreaming' && typeFromUrl !== 'affiliate' && typeFromUrl !== 'crm' && typeFromUrl !== 'inventory' && typeFromUrl !== 'operations' && typeFromUrl !== 'quickview' && typeFromUrl !== 'ads' && typeFromUrl !== 'bd-overview' && typeFromUrl !== 'bd-ecommerce' && typeFromUrl !== 'bd-distributor' && typeFromUrl !== 'bd-distributor-sales' && typeFromUrl !== 'bd-distributor-account' && typeFromUrl !== 'bd-distributor-coverage' && typeFromUrl !== 'bd-distributor-cost' && typeFromUrl !== 'bd-event' && typeFromUrl !== 'bd-event-sales' && typeFromUrl !== 'bd-event-product' && typeFromUrl !== 'bd-event-promotion' && typeFromUrl !== 'bd-event-cost' && typeFromUrl !== 'bd-ecommerce-my' && typeFromUrl !== 'offline-quick-overview' && typeFromUrl !== 'offline-mt' && typeFromUrl !== 'offline-area-sales' && typeFromUrl !== 'offline-store-overview' && typeFromUrl !== 'offline-store-promotion' && typeFromUrl !== 'offline-store-stock' && typeFromUrl !== 'offline-store-cost' && <h1 className="text-2xl font-semibold text-gray-800">Sales Entry</h1>}
                    </div>
                </header>
                
                {typeFromUrl === 'orders' ? (
                    <OrdersView />
                ) : typeFromUrl === 'performance' ? (
                    <ProductPerformanceView />
                ) : typeFromUrl === 'livestreaming' ? (
                    <LiveStreamingView />
                ) : typeFromUrl === 'affiliate' ? (
                    <AffiliateView />
                ) : typeFromUrl === 'ads' ? (
                    <AdsView />
                ) : typeFromUrl === 'crm' ? (
                    <CRMView />
                ) : typeFromUrl === 'inventory' ? (
                    <InventoryHealthView />
                ) : typeFromUrl === 'operations' ? (
                    <OperationsHealthView />
                ) : typeFromUrl === 'quickview' ? (
                    <QuickView />
                ) : typeFromUrl === 'bd-overview' ? (
                    <BDOverview />
                ) : typeFromUrl === 'bd-ecommerce' ? (
                    <BDEcommerce />
                ) : typeFromUrl === 'bd-distributor' ? (
                    <BDOfflineDistributor />
                ) : typeFromUrl === 'bd-distributor-sales' ? (
                    <BDDistributorSales />
                ) : typeFromUrl === 'bd-distributor-account' ? (
                    <BDDistributorAccountSKU />
                ) : typeFromUrl === 'bd-distributor-coverage' ? (
                    <BDDistributorCoverage />
                ) : typeFromUrl === 'bd-distributor-cost' ? (
                    <BDDistributorCost />
                ) : typeFromUrl === 'bd-event' ? (
                    <BDOfflineEvent />
                ) : typeFromUrl === 'bd-event-sales' ? (
                    <BDEventSales />
                ) : typeFromUrl === 'bd-event-product' ? (
                    <BDEventProduct />
                ) : typeFromUrl === 'bd-event-promotion' ? (
                    <BDEventPromotion />
                ) : typeFromUrl === 'bd-event-cost' ? (
                    <BDEventCost />
                ) : typeFromUrl === 'bd-ecommerce-my' ? (
                    <BDEcommerceMY />
                ) : typeFromUrl === 'bd-livestreaming-my' ? (
                    <LiveStreamingView />
                ) : typeFromUrl === 'bd-affiliate-my' ? (
                    <AffiliateView />
                ) : typeFromUrl === 'offline-quick-overview' ? (
                    <QuickView />
                ) : typeFromUrl === 'offline-mt' ? (
                    <BDOfflineDistributor />
                ) : typeFromUrl === 'offline-area-sales' ? (
                    <BDDistributorCoverage />
                ) : typeFromUrl === 'offline-store-overview' ? (
                    <OfficialStoreOverview />
                ) : typeFromUrl === 'offline-store-promotion' ? (
                    <OfficialStorePromotion />
                ) : typeFromUrl === 'offline-store-stock' ? (
                    <OfficialStoreStock />
                ) : typeFromUrl === 'offline-store-cost' ? (
                    <OfficialStoreCost />
                ) : (
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
                )}
            </div>
        </div>
    );
}
