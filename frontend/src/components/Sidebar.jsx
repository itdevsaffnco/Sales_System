import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/channel/website.svg';

const MenuItem = ({ item, depth = 0, expandedGroups, toggleGroup, isActive }) => {
    if (item.type === 'header') {
        return (
            <div className="px-6 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {item.label}
            </div>
        );
    }

    if (item.type === 'link') {
        return (
            <Link
                to={item.to}
                className={`flex items-center px-6 py-2.5 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.to) 
                        ? 'text-gray-900 bg-gray-100 border-r-4 border-gray-900' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={{ paddingLeft: `${depth * 1.5 + 1.5}rem` }}
            >
                {item.icon && <span className="mr-3">{item.icon}</span>}
                {item.label}
            </Link>
        );
    }

    if (item.type === 'submenu' || item.type === 'group') {
        const isExpanded = expandedGroups[item.id || item.label];
        return (
            <div className="mb-1">
                <button
                    onClick={() => toggleGroup(item.id || item.label)}
                    className={`flex items-center justify-between w-full px-6 py-2.5 text-sm font-medium transition-colors duration-200 ${
                        isExpanded ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    style={{ paddingLeft: depth === 0 ? '1.5rem' : `${depth * 1.5 + 1.5}rem` }}
                >
                    <div className="flex items-center">
                        {item.icon && <span className="mr-3">{item.icon}</span>}
                        <span>{item.label}</span>
                    </div>
                    <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'transform rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                {isExpanded && (
                    <div className="bg-gray-50/50">
                        {item.children.map((child, index) => (
                            <MenuItem 
                                key={index} 
                                item={child} 
                                depth={depth + 1} 
                                expandedGroups={expandedGroups}
                                toggleGroup={toggleGroup}
                                isActive={isActive}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (item.type === 'channel') {
        return (
            <Link
                to={`/sales?channel=${encodeURIComponent(item.channel)}`}
                className={`flex items-center px-6 py-2 text-sm transition-colors duration-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100`}
                style={{ paddingLeft: `${depth * 1.5 + 1.5}rem` }}
            >
                {item.label}
            </Link>
        );
    }

    return null;
};

const menuItems = [
    {
        type: 'group',
        label: 'Online Sales',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        children: [
                { 
                    type: 'link', 
                    label: 'Overview', 
                    to: '/sales?type=quickview',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    )
                },
                {
                    type: 'group',
                    label: 'Monitoring Platform',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    ),
                    children: [
                        { 
                            type: 'link', 
                            label: 'Orders', 
                            to: '/sales?type=orders',
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            )
                        },
                        { 
                            type: 'link', 
                            label: 'Product Performance', 
                            to: '/sales?type=performance',
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            )
                        },
                        { 
                            type: 'link', 
                            label: 'Ads', 
                            to: '/sales?type=ads',
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                            )
                        },
                        {
                            type: 'submenu',
                            label: 'Live Streaming',
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            ),
                            children: [
                                { type: 'link', label: 'Shopee', to: '/sales?type=livestreaming&channel=Shopee' },
                                { type: 'link', label: 'Tiktok', to: '/sales?type=livestreaming&channel=Tiktok' }
                            ]
                        },
                        {
                            type: 'submenu',
                            label: 'Affiliate',
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            ),
                            children: [
                                { type: 'link', label: 'Shopee', to: '/sales?type=affiliate&channel=Shopee' },
                                { type: 'link', label: 'Tiktok', to: '/sales?type=affiliate&channel=Tiktok' }
                            ]
                        },
                        { 
                            type: 'link', 
                            label: 'CRM', 
                            to: '/sales?type=crm',
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )
                        },
                    ]
                },
                {
                    type: 'group',
                    label: 'Store Health',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    ),
                    children: [
                        { 
                            type: 'link', 
                            label: 'Inventory Health', 
                            to: '/sales?type=inventory',
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            )
                        },
                        { 
                            type: 'link', 
                            label: 'Operations Health', 
                            to: '/sales?type=operations',
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            )
                        },
                    ]
                },
            ]
        },
        { 
            type: 'group', 
            label: 'BD', 
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            children: [
                { 
                    type: 'link', 
                    label: 'Overview', 
                    to: '/sales?type=bd-overview',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                    )
                },
                { 
                    type: 'group', 
                    label: 'E-Commerce', 
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    ),
                    children: [
                        { 
                            type: 'submenu', 
                            label: 'Malaysia', 
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ),
                            children: [
                                {
                                    type: 'submenu',
                                    label: 'Live Stream',
                                    id: 'bd-livestream',
                                    icon: (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    ),
                                    children: [
                                        { type: 'link', label: 'Tiktok', to: '/sales?type=bd-livestreaming-my&channel=Tiktok' },
                                        { type: 'link', label: 'Shopee', to: '/sales?type=bd-livestreaming-my&channel=Shopee' }
                                    ]
                                },
                                {
                                    type: 'submenu',
                                    label: 'Affiliate',
                                    id: 'bd-affiliate',
                                    icon: (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                    ),
                                    children: [
                                        { type: 'link', label: 'Tiktok', to: '/sales?type=bd-affiliate-my&channel=Tiktok' },
                                        { type: 'link', label: 'Shopee', to: '/sales?type=bd-affiliate-my&channel=Shopee' }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                { 
                    type: 'group', 
                    label: 'Offline Distributor',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
                        </svg>
                    ),
                    children: [
                        { 
                            type: 'link', 
                            label: 'Sales Performance', 
                            to: '/sales?type=bd-distributor-sales',
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            )
                        },
                        { 
                            type: 'link', 
                            label: 'Account & SKU Performance', 
                            to: '/sales?type=bd-distributor-account',
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            )
                        },
                        { 
                            type: 'link', 
                            label: 'Distributor Coverage', 
                            to: '/sales?type=bd-distributor-coverage',
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-1.447-.894L15 7m0 13V7" />
                                </svg>
                            )
                        },
                        { 
                            type: 'link', 
                            label: 'Cost & Investment', 
                            to: '/sales?type=bd-distributor-cost',
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )
                        },
                    ]
                },
                { 
                    type: 'group', 
                    label: 'Offline (Pop up & Event)', 
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    ),
                    children: [
                        { 
                            type: 'link', 
                            label: 'Sales Performance', 
                            to: '/sales?type=bd-event-sales',
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            )
                        },
                        { 
                            type: 'link', 
                            label: 'Product Performance', 
                            to: '/sales?type=bd-event-product',
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            )
                        },
                        { 
                            type: 'link', 
                            label: 'Promotion & Activity', 
                            to: '/sales?type=bd-event-promotion',
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                            )
                        },
                        { 
                            type: 'link', 
                            label: 'Cost vs Sales', 
                            to: '/sales?type=bd-event-cost',
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )
                        },
                    ]
                },
            ]
        },
        {
            type: 'group',
            label: 'Offline Sales',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            children: [
                {
                    type: 'link',
                    label: 'Overview',
                    to: '/sales?type=offline-quick-overview',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    )
                },
                {
                    type: 'group',
                    label: 'Official Store',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    ),
                    children: [
                        { type: 'link', label: 'Overview', to: '/sales?type=offline-store-overview' },
                        { type: 'link', label: 'Promotion', to: '/sales?type=offline-store-promotion' },
                        { type: 'link', label: 'Stock', to: '/sales?type=offline-store-stock' },
                        { type: 'link', label: 'Cost vs Sales', to: '/sales?type=offline-store-cost' },
                    ]
                },
                {
                    type: 'link',
                    label: 'MT',
                    to: '/sales?type=offline-mt',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    )
                },
                {
                    type: 'group',
                    label: 'GT',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    ),
                    children: [
                        { type: 'channel', label: 'Reseller', channel: 'Reseller under Principal' },
                        {
                            type: 'group',
                            label: 'Area Sumatra',
                            children: ['Sumatra Utara', 'Nanggroe Aceh Darussalam', 'Sumatra Barat', 'Sumatra Selatan', 'Lampung'].map(
                                (channel) => ({ type: 'channel', label: channel, channel }),
                            ),
                        }
                    ]
                },
                {
                    type: 'link',
                    label: 'Area Sales & Regional Performance',
                    to: '/sales?type=offline-area-sales',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-1.447-.894L15 7m0 13V7" />
                        </svg>
                    )
                }
            ]
        },
    ];

export default function Sidebar({ isOpen }) {
    const location = useLocation();
    const [expandedGroups, setExpandedGroups] = useState({
        'Online Sales': true,
        'Monitoring Platform': true,
        'Store Health': true,
        'Live Streaming': false,
        'Affiliate': false,
        'Offline Sales': false,
        'BD': false,
        'bd-livestream': false,
        'bd-affiliate': false
    });

    const toggleGroup = (label) => {
        setExpandedGroups(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    const isActive = (path) => {
        if (!path) return false;
        if (path.includes('?')) {
            const [pathname, search] = path.split('?');
            return location.pathname === pathname && location.search === `?${search}`;
        }
        return location.pathname === path;
    };

    return (
        <div className={`flex flex-col ${isOpen ? 'w-64' : 'w-0'} transition-all duration-300 h-screen bg-gray-50 border-r border-gray-200 overflow-hidden`}>
            <div className="flex items-center justify-start h-16 border-b border-gray-200 bg-white shrink-0">
                <div className="flex items-center space-x-3 px-6">
                    <img src={logo} alt="SAFF & Co" className="h-8 w-auto" />
                    <span className="text-xl font-bold text-gray-800 tracking-tight">SAFF & Co</span>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
                <nav>
                    {menuItems.map((item, index) => (
                        <MenuItem 
                            key={index} 
                            item={item} 
                            expandedGroups={expandedGroups}
                            toggleGroup={toggleGroup}
                            isActive={isActive}
                        />
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-gray-200 shrink-0">
                 <Link to="/login" onClick={() => {
                     localStorage.removeItem('token');
                     localStorage.removeItem('role');
                 }} className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </Link>
            </div>
        </div>
    );
}