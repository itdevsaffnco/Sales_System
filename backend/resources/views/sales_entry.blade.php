<x-layouts.app title="Sales Entry">
    @php
        $channelFromUrl = $channel ?? null;
        $online = $channelFromUrl && in_array($channelFromUrl, $online_channels ?? ['SHOPEE', 'TOKOPEDIA', 'TIKTOK SELLER', 'LAZADA', 'BLIBLI', 'ZALORA', 'Website', 'Whatsapp (Local)', 'Whatsapp (Overseas)'], true);
        
        $entry = $entry ?? null;
        $editing = !is_null($entry);
        
        // Determine type: From URL query 'type', or from existing entry (editing), or from channel URL
        $typeParam = request('type');
        $prefillType = $editing ? $entry->entry_type : ($typeParam ?? ($channelFromUrl ? ($online ? 'online' : 'offline') : null));
        
        // If no type selected and not editing, show selection screen
        $showSelection = !$prefillType && !$editing;
        $showOnlineChannelSelection = !$editing && $prefillType === 'online' && !$channelFromUrl;
        $showOfflineChannelSelection = !$editing && $prefillType === 'offline' && !$channelFromUrl;

        $initialType = old('entry_type', $prefillType ?? '');
        $months = [
            '01' => 'January',
            '02' => 'February',
            '03' => 'March',
            '04' => 'April',
            '05' => 'May',
            '06' => 'June',
            '07' => 'July',
            '08' => 'August',
            '09' => 'September',
            '10' => 'October',
            '11' => 'November',
            '12' => 'December',
        ];

        $now = now();
        $defaultPeriodYear = (int) $now->format('Y');
        $defaultPeriodMonth = $now->format('m');

        $firstOfMonth = $now->copy()->startOfMonth();
        $firstOfMonthIsoDow = (int) $firstOfMonth->isoWeekday();
        $baseMonday = $firstOfMonth->copy()->subDays($firstOfMonthIsoDow - 1);
        $daysDiff = $baseMonday->diffInDays($now);
        $defaultPeriodWeek = intdiv($daysDiff, 7) + 1;
        $defaultPeriodWeek = min(max($defaultPeriodWeek, 1), 6);

        $parsedPeriodYear = null;
        $parsedPeriodMonth = null;
        $parsedPeriodWeek = null;

        if ($editing && !empty($entry->date_period)) {
            if (preg_match('/(\d{4})-(\d{2})\s*-?\s*Week\s*(\d{1,2})/i', $entry->date_period, $matches)) {
                $parsedPeriodYear = (int) $matches[1];
                $parsedPeriodMonth = $matches[2];
                $parsedPeriodWeek = (int) $matches[3];
            } elseif (preg_match('/(\d{4})-(\d{2})/i', $entry->date_period, $matches)) {
                $parsedPeriodYear = (int) $matches[1];
                $parsedPeriodMonth = $matches[2];
            }
        }

        $periodYear = (int) old('period_year', $parsedPeriodYear ?? $defaultPeriodYear);
        $periodMonth = old('period_month', $parsedPeriodMonth ?? $defaultPeriodMonth);
        $periodWeek = (int) old('period_week', $parsedPeriodWeek ?? $defaultPeriodWeek);
        $periodWeek = min(max($periodWeek, 1), 6);
        $computedDatePeriod = sprintf('%d-%s Week %d', $periodYear, $periodMonth, $periodWeek);
        $periodAuto = !$editing || !is_null($parsedPeriodMonth);
        $platformOptions = $online_channels ?? [
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
        $offlineOptions = (isset($offline_channels) && is_array($offline_channels)) ? $offline_channels : [
            'Plaza Indonesia',
            'Mall Taman Anggrek',
            'Pop Up Event',
            'General Trade',
        ];
        
        // Helper to get value
        $getValue = function($field) use ($editing, $entry, $channelFromUrl) {
            $val = old($field);
            if ($val !== null) return $val;
            if ($editing) return $entry->$field;
            // Handle special cases for new entry with URL params
            if ($field === 'platform' && $channelFromUrl && in_array($channelFromUrl, ['SHOPEE', 'TOKOPEDIA', 'TIKTOK SELLER', 'LAZADA', 'BLIBLI', 'ZALORA', 'Website', 'Whatsapp (Local)', 'Whatsapp (Overseas)'])) return $channelFromUrl;
            if ($field === 'channel' && $channelFromUrl && !in_array($channelFromUrl, ['SHOPEE', 'TOKOPEDIA', 'TIKTOK SELLER', 'LAZADA', 'BLIBLI', 'ZALORA', 'Website', 'Whatsapp (Local)', 'Whatsapp (Overseas)'])) return $channelFromUrl;
            return null;
        };
    @endphp

    <div class="mx-auto max-w-3xl">
        @if($showSelection)
            <div class="flex flex-col items-center justify-center min-h-[50vh] gap-8">
                <h2 class="text-3xl font-bold text-slate-900">Select Entry Type</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                    <a href="{{ route('sales.entry', ['type' => 'online']) }}" 
                       class="group relative flex flex-col items-center justify-center p-8 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200">
                        <div class="h-16 w-16 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-slate-900">Online Form</h3>
                        <p class="mt-2 text-center text-sm text-slate-500">Input sales data from marketplaces and digital channels</p>
                    </a>

                    <a href="{{ route('sales.entry', ['type' => 'offline']) }}" 
                       class="group relative flex flex-col items-center justify-center p-8 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200">
                        <div class="h-16 w-16 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-slate-900">Offline Form</h3>
                        <p class="mt-2 text-center text-sm text-slate-500">Input sales data from physical stores and events</p>
                    </a>
                </div>
            </div>
        @elseif($showOfflineChannelSelection)
            <div class="min-h-[60vh] py-10">
                <div class="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h2 class="text-3xl font-semibold text-slate-900">List Offline Channel</h2>
                        <p class="mt-1 text-sm text-slate-500">
                            Pilih channel offline yang ingin diinput, lalu lanjut ke form sales entry.
                        </p>
                    </div>
                    <a href="{{ route('sales.entry') }}" class="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
                        </svg>
                        Kembali ke pilih tipe
                    </a>
                </div>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    @foreach($offlineOptions as $name)
                        <a
                            href="{{ route('sales.entry', ['type' => 'offline', 'channel' => $name]) }}"
                            class="group flex flex-col justify-between rounded-xl border border-slate-200 bg-blue-50/40 px-4 py-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
                        >
                            <div class="flex items-center gap-3">
                                <div class="flex h-10 w-10 items-center justify-center rounded-md bg-white text-sm font-semibold text-blue-500 shadow-sm">
                                    {{ mb_substr($name, 0, 2) }}
                                </div>
                                <div>
                                    <div class="text-sm font-semibold text-slate-900">
                                        {{ $name }}
                                    </div>
                                    <div class="text-xs text-slate-500">
                                        Offline channel
                                    </div>
                                </div>
                            </div>
                            <div class="mt-4 flex items-center justify-between text-xs text-slate-500">
                                <span>Pilih channel ini</span>
                                <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-blue-500 shadow-sm group-hover:bg-blue-500 group-hover:text-white">
                                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </span>
                            </div>
                        </a>
                    @endforeach
                </div>
            </div>
        @elseif($showOnlineChannelSelection)
            <div class="min-h-[60vh] py-10">
                <div class="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h2 class="text-3xl font-semibold text-slate-900">List Online Channel</h2>
                        <p class="mt-1 text-sm text-slate-500">
                            Pilih channel online yang ingin diinput, lalu lanjut ke form sales entry.
                        </p>
                    </div>
                    <a href="{{ route('sales.entry') }}" class="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
                        </svg>
                        Kembali ke pilih tipe
                    </a>
                </div>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    @foreach($platformOptions as $name)
                        <a
                            href="{{ route('sales.entry', ['type' => 'online', 'channel' => $name]) }}"
                            class="group flex flex-col justify-between rounded-xl border border-slate-200 bg-rose-50/40 px-4 py-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50 hover:shadow-md"
                        >
                            <div class="flex items-center gap-3">
                                <div class="flex h-10 w-10 items-center justify-center rounded-md bg-white text-sm font-semibold text-rose-500 shadow-sm">
                                    {{ mb_substr($name, 0, 2) }}
                                </div>
                                <div>
                                    <div class="text-sm font-semibold text-slate-900">
                                        {{ $name }}
                                    </div>
                                    <div class="text-xs text-slate-500">
                                        Online channel
                                    </div>
                                </div>
                            </div>
                            <div class="mt-4 flex items-center justify-between text-xs text-slate-500">
                                <span>Pilih channel ini</span>
                                <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-rose-500 shadow-sm group-hover:bg-rose-500 group-hover:text-white">
                                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </span>
                            </div>
                        </a>
                    @endforeach
                </div>
            </div>
        @else
            <div class="relative overflow-hidden rounded-lg bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600 p-[1px] shadow-sm">
                <div class="rounded-lg bg-white/95 px-6 py-6 backdrop-blur sm:px-8">
                    <div class="flex items-start justify-between gap-4">
                        <div class="min-w-0">
                            <div class="flex items-center gap-2 mb-1">
                                @if(!$editing)
                                    <a href="{{ route('sales.entry') }}" class="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
                                        Back
                                    </a>
                                @endif
                            </div>
                            <h2 class="text-2xl font-semibold tracking-tight text-slate-900">
                                {{ $editing ? 'Edit Sales Entry' : ($initialType === 'online' ? 'Online Sales Form' : 'Offline Sales Form') }}
                            </h2>
                            <p class="mt-1 text-sm text-slate-500">
                                {{ $editing ? 'Update existing sales data' : 'Input details for new transaction' }}
                            </p>
                        </div>
                        <div class="hidden h-10 shrink-0 items-center justify-center rounded-md bg-indigo-50 px-3 text-indigo-700 text-xs font-semibold uppercase sm:flex">
                            {{ $initialType === 'online' ? 'Online' : 'Offline' }}
                        </div>
                    </div>

                    <div class="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
                        <form
                            method="POST"
                            action="{{ $editing ? route('sales.entry.update', $entry->id) : route('sales.entry', ['type' => $initialType]) }}"
                            class="p-5 sm:p-6"
                            x-data="{ type: '{{ $initialType }}' }"
                        >
                            @csrf
                            @if($editing)
                                @method('PUT')
                            @endif
                            
                            <!-- Hidden input for type -->
                            <input type="hidden" name="entry_type" value="{{ $initialType }}">

                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label class="block text-sm font-medium text-slate-700">Period</label>
                                    <input type="hidden" name="period_year" id="period_year" value="{{ $periodYear }}" />
                                    <input
                                        id="date_period"
                                        type="hidden"
                                        name="date_period"
                                        value="{{ old('date_period', $editing ? ($getValue('date_period') ?? $computedDatePeriod) : $computedDatePeriod) }}"
                                        data-auto="{{ $periodAuto ? '1' : '0' }}"
                                    />
                                    <div class="mt-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div>
                                            <select
                                                id="period_month"
                                                name="period_month"
                                                class="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                                required
                                            >
                                                @foreach($months as $value => $label)
                                                    <option value="{{ $value }}" {{ (string) $periodMonth === (string) $value ? 'selected' : '' }}>{{ $label }}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                        <div>
                                            <select
                                                id="period_week"
                                                name="period_week"
                                                class="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                                required
                                            >
                                            @for($w = 1; $w <= 6; $w++)
                                                <option value="{{ $w }}" {{ (int) $periodWeek === $w ? 'selected' : '' }}>Week {{ $w }}</option>
                                            @endfor
                                            </select>
                                            <div id="week_date_range" class="mt-1 text-xs text-slate-500"></div>
                                        </div>
                                    </div>
                                </div>

                                @if($initialType === 'online')
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700">Platform</label>
                                        @php
                                            $platformLocked = (bool) ($channelFromUrl && !$editing);
                                            $platformValue = $getValue('platform');
                                        @endphp

                                        @if($platformLocked)
                                            <input type="hidden" name="platform" value="{{ $platformValue }}" />
                                            <select
                                                name="platform_display"
                                                class="mt-1 w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                                disabled
                                                required
                                            >
                                                @foreach($platformOptions as $opt)
                                                    <option value="{{ $opt }}" {{ (string) $platformValue === (string) $opt ? 'selected' : '' }}>{{ $opt }}</option>
                                                @endforeach
                                            </select>
                                        @else
                                            <select
                                                name="platform"
                                                class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                                required
                                            >
                                                <option value="" disabled {{ empty($platformValue) ? 'selected' : '' }}>Select platform</option>
                                                @foreach($platformOptions as $opt)
                                                    <option value="{{ $opt }}" {{ (string) $platformValue === (string) $opt ? 'selected' : '' }}>{{ $opt }}</option>
                                                @endforeach
                                            </select>
                                        @endif
                                    </div>
                                @endif

                                @if($initialType === 'offline')
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700">Platform</label>
                                        @php
                                            $offlineLocked = (bool) ($channelFromUrl && !$editing);
                                            $channelValue = $getValue('channel');
                                        @endphp
                                        @if($offlineLocked)
                                            <input type="hidden" name="channel" value="{{ $channelValue }}" />
                                            <select
                                                name="channel_display"
                                                class="mt-1 w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                                disabled
                                                required
                                            >
                                                @foreach($offlineOptions as $opt)
                                                    <option value="{{ $opt }}" {{ (string) $channelValue === (string) $opt ? 'selected' : '' }}>{{ $opt }}</option>
                                                @endforeach
                                            </select>
                                        @else
                                            <select
                                                name="channel"
                                                class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                                required
                                            >
                                                <option value="" disabled {{ empty($channelValue) ? 'selected' : '' }}>Select offline platform</option>
                                                @foreach($offlineOptions as $opt)
                                                    <option value="{{ $opt }}" {{ (string) $channelValue === (string) $opt ? 'selected' : '' }}>{{ $opt }}</option>
                                                @endforeach
                                            </select>
                                        @endif
                                    </div>
                                @endif
                            </div>

                            <div class="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700">SKU Code</label>
                                        <input
                                            name="sku_code"
                                            type="text"
                                            value="{{ $getValue('sku_code') }}"
                                            class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                            required
                                            placeholder="e.g. SKU-123"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700">SKU Name</label>
                                        <input
                                            name="sku_name"
                                            type="text"
                                            value="{{ $getValue('sku_name') }}"
                                            class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                            required
                                            placeholder="e.g. T-Shirt Black"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label class="block text-sm font-medium text-slate-700">RSP</label>
                                    <div class="relative mt-1">
                                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm text-slate-500">Rp</div>
                                        <input
                                            name="pricing_rsp_new"
                                            type="number"
                                            min="0"
                                            step="1"
                                            value="{{ $getValue('pricing_rsp_new') }}"
                                            class="w-full rounded-md border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                            required
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-slate-700">Qty</label>
                                    <input
                                        name="qty"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value="{{ $getValue('qty') }}"
                                        class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                        required
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-700">Brand Disc</label>
                                    <input
                                        name="brand_disc"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value="{{ $getValue('brand_disc') }}"
                                        class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-slate-700">Brand Voucher</label>
                                    <input
                                        name="brand_voucher"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value="{{ $getValue('brand_voucher') }}"
                                        class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-slate-700">Member</label>
                                    <input
                                        name="member_discount"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value="{{ $getValue('member_discount') }}"
                                        class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-slate-700">Margin</label>
                                    <input
                                        name="margin"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value="{{ $getValue('margin') }}"
                                        class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div class="mt-6">
                                <button
                                    type="submit"
                                    class="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-blue-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                >
                                    {{ $editing ? 'Update Sales Entry' : 'Submit Sales Entry' }}
                                </button>
                                @if($editing)
                                    <a href="{{ route('sales.entry') }}" class="mt-3 block text-center text-sm font-medium text-slate-600 hover:text-slate-900">Cancel</a>
                                @endif
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        @endif

        @if(isset($recent_entries) && $recent_entries->count() > 0)
            <div class="mt-8">
                <div class="mb-4 px-2">
                    <h3 class="text-lg font-semibold text-slate-900">Recent Entries</h3>
                </div>
                <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-slate-200">
                            <thead class="bg-slate-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Account</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Channel</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Qty</th>
                                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-slate-200">
                                @foreach($recent_entries as $entry)
                                    <tr class="hover:bg-slate-50">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {{ \Carbon\Carbon::parse($entry->sales_date)->format('d M Y') }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                            {{ optional($entry->user)->name ?? 'Sales Staff' }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                            {{ $entry->channel_distribution }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            <div class="font-medium text-slate-900">{{ $entry->sku_code }}</div>
                                            <div class="text-xs">{{ $entry->sku_name }}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right">
                                            {{ $entry->qty }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right">
                                            Rp {{ number_format($entry->pricing_rsp_new, 0, ',', '.') }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div class="flex items-center justify-end gap-2">
                                                <a href="{{ route('sales.entry.edit', $entry->id) }}" class="text-indigo-600 hover:text-indigo-900">Edit</a>
                                                <form action="{{ route('sales.entry.delete', $entry->id) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this entry?');">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="text-red-600 hover:text-red-900">Delete</button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        @endif
    </div>

    <script>
        (function () {
            var monthEl = document.getElementById('period_month');
            var weekEl = document.getElementById('period_week');
            var yearEl = document.getElementById('period_year');
            var datePeriodEl = document.getElementById('date_period');

            if (!monthEl || !weekEl || !yearEl || !datePeriodEl) return;

            function updateDatePeriod() {
                var year = String(yearEl.value || '').trim();
                var month = String(monthEl.value || '').trim();
                var week = String(weekEl.value || '').trim();
                if (!year || !month || !week) return;
                datePeriodEl.value = year + '-' + month + ' Week ' + week;
            }

            function pad2(n) {
                return n < 10 ? ('0' + n) : String(n);
            }

            function formatDate(d) {
                return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
            }

            function shiftToMonday(d) {
                var date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                var dow = date.getDay();
                var mondayIndex = (dow + 6) % 7;
                date.setDate(date.getDate() - mondayIndex);
                return date;
            }

            function shiftToSunday(d) {
                var date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                var dow = date.getDay();
                var mondayIndex = (dow + 6) % 7;
                var daysUntilSunday = 6 - mondayIndex;
                date.setDate(date.getDate() + daysUntilSunday);
                return date;
            }

            function weeksForMonth(year, month1Based) {
                var firstOfMonth = new Date(year, month1Based - 1, 1);
                var lastOfMonth = new Date(year, month1Based, 0);
                var startWeek1 = shiftToMonday(firstOfMonth);
                var endLastWeek = shiftToSunday(lastOfMonth);
                var msPerDay = 24 * 60 * 60 * 1000;
                var days = Math.round((endLastWeek - startWeek1) / msPerDay) + 1;
                return Math.max(1, Math.round(days / 7));
            }

            function updateWeekRangeAndClamp() {
                var year = parseInt(String(yearEl.value || '').trim(), 10);
                var month1Based = parseInt(String(monthEl.value || '').trim(), 10);
                var week = parseInt(String(weekEl.value || '').trim(), 10);
                if (!year || !month1Based || !week) return;

                var maxWeek = weeksForMonth(year, month1Based);
                Array.prototype.forEach.call(weekEl.options, function (opt) {
                    var w = parseInt(opt.value, 10);
                    opt.disabled = !!w && w > maxWeek;
                    opt.hidden = !!w && w > maxWeek;
                });
                if (week > maxWeek) {
                    week = maxWeek;
                    weekEl.value = String(week);
                }

                var startWeek1 = shiftToMonday(new Date(year, month1Based - 1, 1));
                var startDate = new Date(startWeek1.getFullYear(), startWeek1.getMonth(), startWeek1.getDate() + (week - 1) * 7);
                var endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6);
                weekDateRangeEl.textContent = formatDate(startDate) + ' - ' + formatDate(endDate);
            }

            var weekDateRangeEl = document.getElementById('week_date_range');

            function onPeriodChange() {
                updateWeekRangeAndClamp();
                datePeriodEl.setAttribute('data-auto', '1');
                updateDatePeriod();
            }

            monthEl.addEventListener('change', onPeriodChange);
            weekEl.addEventListener('change', onPeriodChange);
            onPeriodChange();
        })();

        (function () {
            var skuCodeInput = document.querySelector('input[name="sku_code"]');
            var skuNameInput = document.querySelector('input[name="sku_name"]');
            var priceInput = document.querySelector('input[name="pricing_rsp_new"]');
            var lookupUrl = "{{ route('sku.lookup') }}";
            var searchUrl = "{{ route('sku.search') }}";

            function lookupSku(params, source) {
                var query = [];
                if (params.sku_code) {
                    query.push('sku_code=' + encodeURIComponent(params.sku_code));
                }
                if (params.sku_name) {
                    query.push('sku_name=' + encodeURIComponent(params.sku_name));
                }
                if (!query.length) return;

                fetch(lookupUrl + '?' + query.join('&'), {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    },
                    credentials: 'same-origin'
                }).then(function (response) {
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json();
                }).then(function (data) {
                    if (data.sku_code && skuCodeInput && source !== 'code') {
                        skuCodeInput.value = data.sku_code;
                    }
                    if (data.sku_name && skuNameInput && source !== 'name') {
                        skuNameInput.value = data.sku_name;
                    }
                    if (priceInput && typeof data.price !== 'undefined' && (priceInput.value === '' || priceInput.value === '0')) {
                        priceInput.value = data.price;
                    }
                }).catch(function () {});
            }

            if (skuCodeInput) {
                skuCodeInput.addEventListener('blur', function () {
                    var value = skuCodeInput.value.trim();
                    if (value !== '') {
                        lookupSku({ sku_code: value }, 'code');
                    }
                });
            }

            var suggestionContainer;
            var suggestionTimeout;

            function ensureSuggestionContainer() {
                if (!skuNameInput) return null;
                if (suggestionContainer) return suggestionContainer;
                var wrapper = skuNameInput.parentElement;
                if (!wrapper) return null;
                if (wrapper.className.indexOf('relative') === -1) {
                    wrapper.className += ' relative';
                }
                var el = document.createElement('div');
                el.style.display = 'none';
                el.className = 'absolute z-20 mt-1 w-full rounded-md bg-white border border-slate-200 shadow-lg max-h-60 overflow-auto text-sm';
                wrapper.appendChild(el);
                suggestionContainer = el;
                return el;
            }

            function clearSuggestions() {
                if (!suggestionContainer) return;
                suggestionContainer.innerHTML = '';
                suggestionContainer.style.display = 'none';
            }

            function showSuggestions(items) {
                var el = ensureSuggestionContainer();
                if (!el) return;
                el.innerHTML = '';
                if (!items.length) {
                    el.style.display = 'none';
                    return;
                }
                items.forEach(function (item) {
                    var option = document.createElement('button');
                    option.type = 'button';
                    option.className = 'w-full text-left px-3 py-2 hover:bg-slate-50 flex flex-col';
                    var line1 = document.createElement('span');
                    line1.className = 'font-medium text-slate-900';
                    line1.textContent = item.sku_name;
                    var line2 = document.createElement('span');
                    line2.className = 'text-xs text-slate-500';
                    line2.textContent = item.sku_code + (item.price != null ? ' • Rp ' + (item.price || 0).toLocaleString('id-ID') : '');
                    option.appendChild(line1);
                    option.appendChild(line2);
                    option.addEventListener('mousedown', function (e) {
                        e.preventDefault();
                        if (skuNameInput) {
                            skuNameInput.value = item.sku_name;
                        }
                        if (skuCodeInput) {
                            skuCodeInput.value = item.sku_code;
                        }
                        if (priceInput && item.price != null) {
                            priceInput.value = item.price;
                        }
                        clearSuggestions();
                    });
                    el.appendChild(option);
                });
                el.style.display = 'block';
            }

            function searchSkuByName(query) {
                if (!query || query.length < 2) {
                    clearSuggestions();
                    return;
                }
                fetch(searchUrl + '?q=' + encodeURIComponent(query), {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    },
                    credentials: 'same-origin'
                }).then(function (response) {
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json();
                }).then(function (data) {
                    if (!Array.isArray(data)) {
                        clearSuggestions();
                        return;
                    }
                    showSuggestions(data);
                }).catch(function () {
                    clearSuggestions();
                });
            }

            if (skuNameInput) {
                skuNameInput.addEventListener('input', function () {
                    var value = skuNameInput.value.trim();
                    if (suggestionTimeout) {
                        clearTimeout(suggestionTimeout);
                    }
                    suggestionTimeout = setTimeout(function () {
                        searchSkuByName(value);
                    }, 250);
                });

                skuNameInput.addEventListener('blur', function () {
                    var value = skuNameInput.value.trim();
                    setTimeout(function () {
                        clearSuggestions();
                    }, 200);
                    if (value !== '') {
                        lookupSku({ sku_name: value }, 'name');
                    }
                });
            }

            document.addEventListener('click', function (e) {
                if (!suggestionContainer || !skuNameInput) return;
                if (e.target === skuNameInput) return;
                if (!suggestionContainer.contains(e.target)) {
                    clearSuggestions();
                }
            });
        })();
    </script>
</x-layouts.app>
