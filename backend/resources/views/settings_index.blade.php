@component('components.layouts.dashboard', ['title' => 'Settings'])
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a href="{{ route('settings.account') }}" class="rounded-lg border border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-sm">
            <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15l-3.5-3.5m7 0L12 15M6 21h12a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1-4a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                </div>
                <div>
                    <div class="font-semibold">Account Settings</div>
                    <div class="text-sm text-slate-600">Change password</div>
                </div>
            </div>
        </a>
        <a href="{{ route('settings.users') }}" class="rounded-lg border border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-sm">
            <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9a3 3 0 11-6 0 3 3 0 016 0zM6 9a3 3 0 11-6 0 3 3 0 016 0zM12 14c-4.418 0-8 2.239-8 5v3h16v-3c0-2.761-3.582-5-8-5z"/></svg>
                </div>
                <div>
                    <div class="font-semibold">User Management</div>
                    <div class="text-sm text-slate-600">Create account</div>
                </div>
            </div>
        </a>
        <a href="{{ route('settings.products') }}" class="rounded-lg border border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-sm">
            <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h14l4 10H7z"/></svg>
                </div>
                <div>
                    <div class="font-semibold">Product Settings</div>
                    <div class="text-sm text-slate-600">Manage SKUs</div>
                </div>
            </div>
        </a>
        <a href="{{ route('settings.channels') }}" class="rounded-lg border border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-sm">
            <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h18M3 12h18M3 19h18"/></svg>
                </div>
                <div>
                    <div class="font-semibold">Channel Settings</div>
                    <div class="text-sm text-slate-600">Add or delete channels</div>
                </div>
            </div>
        </a>
        <a href="{{ route('settings.pricing') }}" class="rounded-lg border border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-sm">
            <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-md bg-yellow-50 text-yellow-600 flex items-center justify-center">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-4.42 0-8 2.24-8 5v3h16v-3c0-2.76-3.58-5-8-5zM12 8V5"/></svg>
                </div>
                <div>
                    <div class="font-semibold">Pricing</div>
                    <div class="text-sm text-slate-600">Edit price per SKU</div>
                </div>
            </div>
        </a>
        <a href="{{ route('settings.attributes') }}" class="rounded-lg border border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-sm">
            <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                </div>
                <div>
                    <div class="font-semibold">General Attributes</div>
                    <div class="text-sm text-slate-600">Categories, Statuses, Channels</div>
                </div>
            </div>
        </a>
    </div>
@endcomponent
