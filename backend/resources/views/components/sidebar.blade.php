@props(['selectedChannel' => null, 'routeName' => 'dashboard.sales'])

@php
    $sessionUser = request()->session()->get('user');
    $userName = $sessionUser['name'] ?? null;
    $userRole = $sessionUser['role'] ?? null;
    $userInitial = $userName ? mb_strtoupper(mb_substr($userName, 0, 1)) : 'U';
@endphp

<div class="h-full flex flex-col bg-white border-r border-gray-200">
    <div class="p-6 border-b border-gray-100">
        <h1 class="text-2xl font-bold text-blue-800 flex items-center gap-2">
            <img src="{{ asset('images/logo.svg') }}" alt="Logo" class="h-8 w-8">
            Sales App
        </h1>
    </div>

    <nav class="flex-1 overflow-y-auto px-4 py-4 space-y-2 text-sm">
        @if(($userRole ?? '') !== 'sales_staff')
            <a href="{{ route($routeName) }}" class="block px-3 py-2 rounded-md transition-colors {{ !$selectedChannel ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50' }}">
                General Dashboard
            </a>
            <div class="pt-2">
                <a href="{{ route('settings.index') }}" class="block px-3 py-2 rounded-md transition-colors text-gray-600 hover:bg-gray-50">
                    Settings
                </a>
            </div>
        @endif

        <div class="pt-4 pb-2">
            <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">Channels</div>
        </div>

        <details class="group" {{ in_array($selectedChannel, ['SHOPEE', 'TOKOPEDIA', 'TIKTOK SELLER', 'LAZADA', 'BLIBLI', 'ZALORA', 'Website', 'Whatsapp (Local)', 'Whatsapp (Overseas)']) ? 'open' : '' }}>
            <summary class="cursor-pointer select-none px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-between transition-colors">
                <span class="font-medium">Online Sales</span>
                <svg class="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div class="mt-1 ml-3 space-y-1 border-l-2 border-gray-100 pl-3">
                @foreach (['SHOPEE', 'TOKOPEDIA', 'TIKTOK SELLER', 'LAZADA', 'BLIBLI', 'ZALORA', 'Website', 'Whatsapp (Local)', 'Whatsapp (Overseas)'] as $channel)
                    <a href="{{ route($routeName, ['channel' => $channel]) }}" class="block px-3 py-2 rounded-md text-sm transition-colors {{ $selectedChannel === $channel ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50' }}">
                        {{ $channel }}
                    </a>
                @endforeach
            </div>
        </details>

        <details class="group" {{ !in_array($selectedChannel, ['SHOPEE', 'TOKOPEDIA', 'TIKTOK SELLER', 'LAZADA', 'BLIBLI', 'ZALORA', 'Website', 'Whatsapp (Local)', 'Whatsapp (Overseas)']) && $selectedChannel ? 'open' : '' }}>
            <summary class="cursor-pointer select-none px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-between transition-colors">
                <span class="font-medium">Offline Sales</span>
                <svg class="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div class="mt-1 ml-3 space-y-2 border-l-2 border-gray-100 pl-3">
                
                <details class="group/sub">
                    <summary class="cursor-pointer select-none px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 flex items-center justify-between">
                        <span>Official Store</span>
                        <svg class="w-3 h-3 text-gray-400 transition-transform group-open/sub:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <div class="mt-1 ml-3 space-y-1 border-l border-gray-100 pl-3">
                        @foreach (['By The Sea', 'Central Park', 'Sun Plaza', 'Beachwalk Bali', '23 Paskal', 'Pakuwon Surabaya', 'Pakuwon Bekasi', 'PIM 3', 'Summarecon Serpong', 'Pentacity Mall Balikpapan', 'Plaza Indonesia'] as $channel)
                            <a href="{{ route($routeName, ['channel' => $channel]) }}" class="block px-3 py-2 rounded-md text-sm {{ $selectedChannel === $channel ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:text-gray-900' }}">
                                {{ $channel }}
                            </a>
                        @endforeach
                    </div>
                </details>

                <details class="group/sub">
                    <summary class="cursor-pointer select-none px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 flex items-center justify-between">
                        <span>Event & Pop Up</span>
                        <svg class="w-3 h-3 text-gray-400 transition-transform group-open/sub:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <div class="mt-1 ml-3 space-y-1 border-l border-gray-100 pl-3">
                        @foreach (['POP UP BATAM', 'POP UP SENCY', 'EVENT JXB', 'POP UP KOKAS'] as $channel)
                            <a href="{{ route($routeName, ['channel' => $channel]) }}" class="block px-3 py-2 rounded-md text-sm {{ $selectedChannel === $channel ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:text-gray-900' }}">
                                {{ $channel }}
                            </a>
                        @endforeach
                    </div>
                </details>

                <details class="group/sub">
                    <summary class="cursor-pointer select-none px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 flex items-center justify-between">
                        <span>GT Reseller</span>
                        <svg class="w-3 h-3 text-gray-400 transition-transform group-open/sub:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <div class="mt-1 ml-3 space-y-1 border-l border-gray-100 pl-3">
                         <a href="{{ route($routeName, ['channel' => 'Reseller under Principal']) }}" class="block px-3 py-2 rounded-md text-sm {{ $selectedChannel === 'Reseller under Principal' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:text-gray-900' }}">
                            Reseller under Principal
                        </a>
                    </div>
                </details>

                @php
                    $gtGroups = [
                        'GT - Area Sumatra' => ['Sumatra Utara', 'Nanggroe Aceh Darussalam', 'Sumatra Barat', 'Sumatra Selatan', 'Lampung'],
                        'GT - Riau, Kep. Riau & Batam' => ['Riau', 'Kepulauan Riau', 'Batam', 'Tanjung Pinang'],
                        'GT - Kalimantan' => ['Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara'],
                        'GT - BALI, NTB, NTT' => ['Bali', 'NTB', 'NTT'],
                        'GT - SULAWESI' => ['Sulawesi Utara', 'Gorontalo', 'Sulawesi Tenggara', 'Sulawesi Selatan', 'Sulawesi Barat'],
                        'GT - JAWA' => ['Jawa Barat', 'Jawa Tengah', 'Daerah Istimewa Yogyakarta', 'Jawa Timur', 'Outer Jakarta (BoDeTaBek)'],
                        'GT - PAPUA' => ['Sorong', 'Ternate'],
                    ];
                @endphp

                @foreach ($gtGroups as $groupName => $channels)
                    <details class="group/sub">
                        <summary class="cursor-pointer select-none px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 flex items-center justify-between">
                            <span class="truncate">{{ $groupName }}</span>
                            <svg class="w-3 h-3 text-gray-400 transition-transform group-open/sub:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                        </summary>
                        <div class="mt-1 ml-3 space-y-1 border-l border-gray-100 pl-3">
                            @foreach ($channels as $channel)
                                <a href="{{ route($routeName, ['channel' => $channel]) }}" class="block px-3 py-2 rounded-md text-sm {{ $selectedChannel === $channel ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:text-gray-900' }}">
                                    {{ $channel }}
                                </a>
                            @endforeach
                        </div>
                    </details>
                @endforeach

                <details class="group/sub">
                    <summary class="cursor-pointer select-none px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 flex items-center justify-between">
                        <span>MT</span>
                        <svg class="w-3 h-3 text-gray-400 transition-transform group-open/sub:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <div class="mt-1 ml-3 space-y-1 border-l border-gray-100 pl-3">
                        <a href="{{ route($routeName, ['channel' => 'OH SOME']) }}" class="block px-3 py-2 rounded-md text-sm {{ $selectedChannel === 'OH SOME' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:text-gray-900' }}">
                            OH SOME
                        </a>
                    </div>
                </details>

            </div>
        </details>
    </nav>

    <div class="p-4 border-t border-gray-100">
        <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {{ $userInitial }}
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                    {{ $userName ?? 'User' }}
                </p>
                <p class="text-xs text-gray-500 truncate">
                    {{ $userRole ?? 'Staff' }}
                </p>
            </div>
        </div>
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Sign out
            </button>
        </form>
    </div>
</div>
