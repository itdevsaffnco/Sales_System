import { Link, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

export default function Sidebar() {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const items = useMemo(() => {
        return [
            { type: 'link', label: 'General Dashboard', to: '/dashboard' },
            {
                type: 'group',
                label: 'Online Sales',
                children: [
                    'SHOPEE',
                    'TOKOPEDIA',
                    'TIKTOK SELLER',
                    'LAZADA',
                    'BLIBLI',
                    'ZALORA',
                    'Website',
                    'Whatsapp (Local)',
                    'Whatsapp (Overseas)',
                ].map((channel) => ({ type: 'channel', label: channel, channel })),
            },
            {
                type: 'group',
                label: 'Offline Sales',
                children: [
                    {
                        type: 'group',
                        label: 'Officilian Store',
                        children: [
                            'By The Sea',
                            'Central Park',
                            'Sun Plaza',
                            'Beachwalk Bali',
                            '23 Paskal',
                            'Pakuwon Surabaya',
                            'Pakuwon Bekasi',
                            'PIM 3',
                            'Summarecon Serpong',
                            'Pentacity Mall Balikpapan',
                            'Plaza Indonesia',
                        ].map((channel) => ({ type: 'channel', label: channel, channel })),
                    },
                    {
                        type: 'group',
                        label: 'Event & Pop Up',
                        children: ['POP UP BATAM', 'POP UP SENCY', 'EVENT JXB', 'POP UP KOKAS'].map((channel) => ({
                            type: 'channel',
                            label: channel,
                            channel,
                        })),
                    },
                    {
                        type: 'group',
                        label: 'GT Reseller',
                        children: [{ type: 'channel', label: 'Reseller under Principal', channel: 'Reseller under Principal' }],
                    },
                    {
                        type: 'group',
                        label: 'GT - Area Sumatra',
                        children: ['Sumatra Utara', 'Nanggroe Aceh Darussalam', 'Sumatra Barat', 'Sumatra Selatan', 'Lampung'].map(
                            (channel) => ({ type: 'channel', label: channel, channel }),
                        ),
                    },
                    {
                        type: 'group',
                        label: 'GT - Riau, Kep. Riau & Batam',
                        children: ['Riau', 'Kepulauan Riau', 'Batam', 'Tanjung Pinang'].map((channel) => ({
                            type: 'channel',
                            label: channel,
                            channel,
                        })),
                    },
                    {
                        type: 'group',
                        label: 'GT - Kalimantan',
                        children: ['Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara'].map(
                            (channel) => ({ type: 'channel', label: channel, channel }),
                        ),
                    },
                    {
                        type: 'group',
                        label: 'GT - BALI, NTB, NTT',
                        children: ['Bali', 'NTB', 'NTT'].map((channel) => ({ type: 'channel', label: channel, channel })),
                    },
                    {
                        type: 'group',
                        label: 'GT - SULAWESI',
                        children: ['Sulawesi Utara', 'Gorontalo', 'Sulawesi Tenggara', 'Sulawesi Selatan', 'Sulawesi Barat'].map(
                            (channel) => ({ type: 'channel', label: channel, channel }),
                        ),
                    },
                    {
                        type: 'group',
                        label: 'GT - JAWA',
                        children: ['Jawa Barat', 'Jawa Tengah', 'Daerah Istimewa Yogyakarta', 'Jawa Timur', 'Outer Jakarta (BoDeTaBek)'].map(
                            (channel) => ({ type: 'channel', label: channel, channel }),
                        ),
                    },
                    {
                        type: 'group',
                        label: 'GT - PAPUA',
                        children: ['Sorong', 'Ternate'].map((channel) => ({ type: 'channel', label: channel, channel })),
                    },
                    {
                        type: 'group',
                        label: 'MT',
                        children: [{ type: 'channel', label: 'OH SOME', channel: 'OH SOME' }],
                    },
                    {
                        type: 'group',
                        label: 'BD',
                        children: ['SHOPEE', 'TIKTOK'].map((channel) => ({ type: 'channel', label: channel, channel })),
                    },
                ],
            },
        ];
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const channelTo = (channel) => `/sales?channel=${encodeURIComponent(channel)}`;

    const renderItems = (list) => {
        return (
            <div className="space-y-1">
                {list.map((item) => {
                    if (item.type === 'link') {
                        return (
                            <Link
                                key={item.label}
                                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                                to={item.to}
                            >
                                {item.label}
                            </Link>
                        );
                    }

                    if (item.type === 'channel') {
                        return (
                            <Link
                                key={item.label}
                                className="block px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
                                to={channelTo(item.channel)}
                            >
                                {item.label}
                            </Link>
                        );
                    }

                    return (
                        <details key={item.label} className="group">
                            <summary className="cursor-pointer select-none px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 flex items-center justify-between">
                                <span>{item.label}</span>
                                <span className="text-gray-400 group-open:rotate-90 transition-transform">›</span>
                            </summary>
                            <div className="mt-1 ml-2">{renderItems(item.children)}</div>
                        </details>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex flex-col w-64 h-screen px-4 py-8 bg-white border-r">
            <h2 className="text-3xl font-semibold text-center text-blue-800">Sales App</h2>
            <div className="flex flex-col justify-between flex-1 mt-6">
                <nav>
                    {role ? renderItems(items) : null}
                </nav>
                <button onClick={handleLogout} className="flex items-center px-4 py-2 text-gray-600 transition-colors duration-200 transform rounded-md hover:bg-gray-200 hover:text-gray-700">
                    Logout
                </button>
            </div>
        </div>
    );
}
