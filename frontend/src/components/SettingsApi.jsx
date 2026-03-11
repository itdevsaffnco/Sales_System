import { useState } from 'react';
import Sidebar from './Sidebar';
import api, { setApiBaseURL } from '../api/axios';
import axios from 'axios';

export default function SettingsApi() {
    const [isSidebarOpen] = useState(true);
    const JUBELIO_ENDPOINT = 'https://api2.jubelio.com/login';
    const [apiLink, setApiLink] = useState(JUBELIO_ENDPOINT);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState('');

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center py-6 px-8 bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">API Connection</h1>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    <div className="container mx-auto px-8 py-8">
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 max-w-2xl">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Link API</label>
                                    <input value={apiLink} readOnly className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="admin@sales.local" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="password123" />
                                </div>
                                {error && (
                                    <div className="text-red-700 bg-red-100 border border-red-200 rounded-lg px-3 py-2 text-sm">{error}</div>
                                )}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={async () => {
                                            setError('');
                                            setToken('');
                                            setConnecting(true);
                                            try {
                                                const endpoint = JUBELIO_ENDPOINT;
                                                let res;
                                                if (/^https?:\/\//i.test(endpoint)) {
                                                    await api.post('/external-api/credentials', { provider: 'jubelio', endpoint, email, password });
                                                    res = await api.post('/external-api/login', { provider: 'jubelio', password });
                                                } else {
                                                    const url = endpoint.endsWith('/api') ? endpoint : `${endpoint.replace(/\/+$/, '')}/api`;
                                                    setApiBaseURL(url);
                                                    res = await api.post('/login', { email, password });
                                                }
                                                const t = res.data?.token || res.data?.access_token || res.data?.data?.token || '';
                                                setToken(t);
                                                if (typeof localStorage !== 'undefined') {
                                                    localStorage.setItem('token', t);
                                                    localStorage.setItem('external_token', t);
                                                }
                                            } catch (e) {
                                                setError('Gagal konek. Periksa link API atau kredensial.');
                                            } finally {
                                                setConnecting(false);
                                            }
                                        }}
                                        disabled={connecting}
                                        className={`px-4 py-2 rounded-lg text-white ${connecting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                    >
                                        {connecting ? 'Connecting...' : 'Connect'}
                                    </button>
                                    {token && (
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700">Token</label>
                                            <input readOnly value={token} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-xs bg-gray-50" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
