import React, { useState } from 'react';
import { format } from 'date-fns';
import DateRangePicker from './DateRangePicker';

export default function AdsView() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(2025, 11, 30), // 30 Dec 2025
        end: new Date(2026, 0, 28)     // 28 Jan 2026
    });
    const [selectedChannel, setSelectedChannel] = useState('All Channels');

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

    const channels = ['All Channels', 'Shopee', 'Tiktok', 'Tokopedia', 'Lazada', 'Blibli', 'Zalora', 'Website', 'Whatsapp'];

    // Mock Data based on the image structure
    const adsData = [
        {
            source: 'Tiktok Ads',
            campaigns: [
                { name: 'enron_tk_traffic_tofu_alwaysOn_v4', spend: 19400000, clicks: 964300, conversions: 0, impressions: 9400000 },
                { name: 'deutscheBank_tk_traffic_retention_january_v2', spend: 17700000, clicks: 644400, conversions: 0, impressions: 7800000 },
                { name: 'weWork_tk_leadGeneration_mofu_spring_v2', spend: 10500000, clicks: 573500, conversions: 0, impressions: 5300000 },
                { name: 'deutscheBank_tk_sales_mofu_may_v4', spend: 7400000, clicks: 588400, conversions: 1, impressions: 4300000 },
                { name: 'valeant_tk_engagement_tofu_thanksgiving_v4', spend: 6100000, clicks: 385000, conversions: 0, impressions: 3400000 },
            ]
        },
        {
            source: 'Meta Ads',
            campaigns: [
                { name: 'aig_fb_reach_bofu_january_v1', spend: 237700, clicks: 27600, conversions: 0, impressions: 3000000 },
                { name: 'aig_fb_increaseLocalAwareness_tofu_february_v4', spend: 163500, clicks: 18500, conversions: 0, impressions: 1900000 },
                { name: 'uber_fb_increaseLocalAwareness_mofu_2024_v1', spend: 94600, clicks: 10700, conversions: 0, impressions: 1200000 },
                { name: 'volkswagen_fb_brandAwareness_bofu_september_v5', spend: 51400, clicks: 5700, conversions: 0, impressions: 596000 },
            ]
        },
        {
            source: 'Linkedin Ads',
            campaigns: [
                { name: 'uber_li_videoViews_bofu_winter_v3', spend: 111000, clicks: 3800, conversions: 2900, impressions: 327000 },
                { name: 'weWork_li_offSiteConversions_retention_july_v1', spend: 9300, clicks: 3900, conversions: 2500, impressions: 384000 },
            ]
        }
    ];

    const formatCurrency = (value) => {
        if (value >= 1000000000) return (value / 1000000000).toFixed(1) + 'B';
        if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
        if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
        return value.toString();
    };

    const formatNumber = (value) => {
        if (value >= 1000000000) return (value / 1000000000).toFixed(1) + 'B';
        if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
        if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
        return value.toString();
    };

    // Helper to calculate max values for bars
    const getMaxValues = () => {
        let maxSpend = 0, maxClicks = 0, maxConversions = 0, maxImpressions = 0;
        adsData.forEach(group => {
            group.campaigns.forEach(c => {
                if (c.spend > maxSpend) maxSpend = c.spend;
                if (c.clicks > maxClicks) maxClicks = c.clicks;
                if (c.conversions > maxConversions) maxConversions = c.conversions;
                if (c.impressions > maxImpressions) maxImpressions = c.impressions;
            });
        });
        return { maxSpend, maxClicks, maxConversions, maxImpressions };
    };

    const { maxSpend, maxClicks, maxConversions, maxImpressions } = getMaxValues();

    const Bar = ({ value, max, color }) => {
        const width = max > 0 ? (value / max) * 100 : 0;
        return (
            <div className="flex items-center gap-2 w-32">
                <span className="text-xs font-medium w-8 text-right shrink-0">{formatNumber(value)}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full ${color}`} 
                        style={{ width: `${width}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    // Calculate totals per group and grand total
    const getGroupTotals = (campaigns) => {
        return campaigns.reduce((acc, curr) => ({
            spend: acc.spend + curr.spend,
            clicks: acc.clicks + curr.clicks,
            conversions: acc.conversions + curr.conversions,
            impressions: acc.impressions + curr.impressions
        }), { spend: 0, clicks: 0, conversions: 0, impressions: 0 });
    };

    const grandTotal = adsData.reduce((acc, group) => {
        const groupTotal = getGroupTotals(group.campaigns);
        return {
            spend: acc.spend + groupTotal.spend,
            clicks: acc.clicks + groupTotal.clicks,
            conversions: acc.conversions + groupTotal.conversions,
            impressions: acc.impressions + groupTotal.impressions
        };
    }, { spend: 0, clicks: 0, conversions: 0, impressions: 0 });

    return (
        <div className="flex-1 bg-gray-50 p-8 overflow-y-auto h-full pb-64">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Ads Performance</h1>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Channel Filter */}
                    <div className="relative">
                        <select 
                            value={selectedChannel}
                            onChange={(e) => setSelectedChannel(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
                        >
                            {channels.map(channel => (
                                <option key={channel} value={channel}>{channel}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>

                    {/* Date Picker */}
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
                                align="right"
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-purple-50">
                    <h2 className="text-lg font-bold text-purple-900">Channel performance</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-48">Blended Data source name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-64">Blended Campaign Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Blended Ad Spend</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Blended Clicks</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Blended Conversions</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Blended Post impressions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {adsData.map((group, groupIndex) => {
                                const groupTotal = getGroupTotals(group.campaigns);
                                return (
                                    <React.Fragment key={groupIndex}>
                                        {group.campaigns.map((campaign, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                {idx === 0 && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 align-top" rowSpan={group.campaigns.length + 1}>
                                                        {group.source}
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 text-sm text-gray-600 break-words max-w-xs">
                                                    {campaign.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Bar value={campaign.spend} max={maxSpend} color="bg-pink-400" />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Bar value={campaign.clicks} max={maxClicks} color="bg-indigo-900" />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Bar value={campaign.conversions} max={maxConversions} color="bg-pink-600" />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Bar value={campaign.impressions} max={maxImpressions} color="bg-purple-500" />
                                                </td>
                                            </tr>
                                        ))}
                                        {/* Group Total */}
                                        <tr className="bg-gray-50 font-medium">
                                            <td className="px-6 py-4 text-sm text-gray-900">Total</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatCurrency(groupTotal.spend)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatNumber(groupTotal.clicks)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatNumber(groupTotal.conversions)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatNumber(groupTotal.impressions)}</td>
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                            
                            {/* Grand Total */}
                            <tr className="bg-purple-50 font-bold border-t-2 border-purple-200">
                                <td className="px-6 py-4 text-sm text-gray-900" colSpan={2}>Grand total</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatCurrency(grandTotal.spend)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatNumber(grandTotal.clicks)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatNumber(grandTotal.conversions)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatNumber(grandTotal.impressions)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
