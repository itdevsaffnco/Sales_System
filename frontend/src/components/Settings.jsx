import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
    const [isSidebarOpen] = useState(true);
    const navigate = useNavigate();

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center py-6 px-8 bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Settings</h1>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    <div className="container mx-auto px-8 py-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <button onClick={() => navigate('/settings/account')} className="text-left rounded-lg border border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15l-3.5-3.5m7 0L12 15M6 21h12a2 2 0 002-2V9a2 2 0 00-2-2H5z"/></svg>
                                    </div>
                                    <div>
                                        <div className="font-semibold">Account Settings</div>
                                        <div className="text-sm text-slate-600">Change password</div>
                                    </div>
                                </div>
                            </button>
                            <button onClick={() => navigate('/settings/api')} className="text-left rounded-lg border border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m-4-4h8M5 7a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5z"/></svg>
                                    </div>
                                    <div>
                                        <div className="font-semibold">API Connection</div>
                                        <div className="text-sm text-slate-600">Configure base URL & login</div>
                                    </div>
                                </div>
                            </button>
                            <button onClick={() => navigate('/settings/users')} className="text-left rounded-lg border border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9a3 3 0 11-6 0 3 3 0 016 0zM6 9a3 3 0 11-6 0 3 3 0 016 0zM12 14c-4.418 0-8 2.239-8 5v3h16v-3c0-2.761-3.582-5-8-5z"/></svg>
                                    </div>
                                    <div>
                                        <div className="font-semibold">User Management</div>
                                        <div className="text-sm text-slate-600">Create account</div>
                                    </div>
                                </div>
                            </button>
                            <button onClick={() => navigate('/settings/products')} className="text-left rounded-lg border border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h14l4 10H7z"/></svg>
                                    </div>
                                    <div>
                                        <div className="font-semibold">Product Settings</div>
                                        <div className="text-sm text-slate-600">Manage SKUs</div>
                                    </div>
                                </div>
                            </button>
                            <button onClick={() => navigate('/settings/channels')} className="text-left rounded-lg border border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h18M3 12h18M3 19h18"/></svg>
                                    </div>
                                    <div>
                                        <div className="font-semibold">Channel Settings</div>
                                        <div className="text-sm text-slate-600">Add or delete channels</div>
                                    </div>
                                </div>
                            </button>
                            <button onClick={() => navigate('/settings/pricing')} className="text-left rounded-lg border border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-md bg-yellow-50 text-yellow-600 flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-4.42 0-8 2.24-8 5v3h16v-3c0-2.76-3.58-5-8-5zM12 8V5"/></svg>
                                    </div>
                                    <div>
                                        <div className="font-semibold">Pricing</div>
                                        <div className="text-sm text-slate-600">Edit price per SKU</div>
                                    </div>
                                </div>
                            </button>
                            <button onClick={() => navigate('/settings/attributes')} className="text-left rounded-lg border border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                                    </div>
                                    <div>
                                        <div className="font-semibold">General Attributes</div>
                                        <div className="text-sm text-slate-600">Categories, Statuses, Channels</div>
                                    </div>
                                </div>
                            </button>
                        </div>

                        <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm p-6 max-w-3xl">
                            <div className="text-sm text-gray-600">
                                Pilih salah satu menu untuk menuju halaman pengaturan.
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
