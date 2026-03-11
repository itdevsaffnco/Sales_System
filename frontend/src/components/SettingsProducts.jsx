import { useState } from 'react';
import Sidebar from './Sidebar';

export default function SettingsProducts() {
    const [isSidebarOpen] = useState(true);
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center py-6 px-8 bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Product Settings</h1>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    <div className="container mx-auto px-8 py-8">
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 max-w-2xl">
                            <div className="text-sm text-gray-600">Coming soon.</div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
