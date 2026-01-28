<x-layouts.dashboard title="Sales Dashboard" :selected-channel="$selected_channel">
    <div class="mb-8">
        <h2 class="text-2xl font-bold text-slate-900">
            @if($selected_channel)
                {{ $selected_channel }} Dashboard
            @else
                General Dashboard
            @endif
        </h2>
        <p class="mt-1 text-sm text-slate-500">Overview of sales performance and metrics.</p>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div class="overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
            <dt class="truncate text-sm font-medium text-slate-500">Total Sales</dt>
            <dd class="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Rp {{ number_format($total_sales ?? 0, 0, ',', '.') }}
            </dd>
            <div class="mt-2 flex items-baseline text-sm font-semibold text-emerald-600">
                <svg class="h-4 w-4 flex-shrink-0 self-center" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clip-rule="evenodd" />
                </svg>
                <span class="sr-only"> Increased by </span>
                0%
                <span class="ml-2 text-slate-400 font-normal">vs last month</span>
            </div>
        </div>

        <div class="overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
            <dt class="truncate text-sm font-medium text-slate-500">Transactions</dt>
            <dd class="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                {{ $total_entries }}
            </dd>
            <div class="mt-2 flex items-baseline text-sm font-semibold text-emerald-600">
                <svg class="h-4 w-4 flex-shrink-0 self-center" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clip-rule="evenodd" />
                </svg>
                <span class="sr-only"> Increased by </span>
                0%
                <span class="ml-2 text-slate-400 font-normal">vs last month</span>
            </div>
        </div>

        <div class="overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
            <dt class="truncate text-sm font-medium text-slate-500">Avg. Order Value</dt>
            <dd class="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Rp {{ number_format($avg_order_value ?? 0, 0, ',', '.') }}
            </dd>
             <div class="mt-2 flex items-baseline text-sm font-semibold text-rose-600">
                <svg class="h-4 w-4 flex-shrink-0 self-center" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                     <path fill-rule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clip-rule="evenodd" />
                </svg>
                <span class="sr-only"> Decreased by </span>
                0%
                <span class="ml-2 text-slate-400 font-normal">vs last month</span>
            </div>
        </div>

        <div class="overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
            <dt class="truncate text-sm font-medium text-slate-500">Active Channels</dt>
            <dd class="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                {{ $active_channels ?? 0 }}
            </dd>
            <div class="mt-2 flex items-baseline text-sm text-slate-500">
                <span class="font-normal">out of 30+ channels</span>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 gap-8">
        <div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
            <h3 class="text-base font-semibold leading-6 text-slate-900 mb-4">Sales Trend</h3>
            <div class="relative h-64 w-full bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-300">
                <div class="text-center">
                    <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    <p class="mt-2 text-sm text-slate-500">Chart visualization will appear here</p>
                </div>
            </div>
        </div>

        <div class="rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">
            <div class="border-b border-slate-200 px-6 py-5 flex items-center justify-between gap-3">
                <h3 class="text-base font-semibold leading-6 text-slate-900">Recent Entries</h3>
                <div class="flex items-center gap-2">
                    <form method="GET" action="{{ route('dashboard.sales') }}" class="flex items-center gap-2">
                        <input type="hidden" name="channel" value="{{ $selected_channel }}">
                        <input type="text" name="q" value="{{ $search_query ?? request('q') }}"
                               placeholder="Cari produk/akun/channel"
                               class="px-3 py-1.5 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-52">
                        <button type="submit"
                                class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-slate-700 text-white hover:bg-slate-800">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M10 18a8 8 0 110-16 8 8 0 010 16z" />
                            </svg>
                            Search
                        </button>
                    </form>
                    <a href="{{ route('dashboard.sales.export', array_filter(['channel' => $selected_channel, 'q' => $search_query ?? request('q')])) }}"
                       class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v16h16V4M8 12l4 4 4-4M12 16V8" />
                        </svg>
                        Export
                    </a>
                </div>
            </div>
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
                        @forelse($recent_entries as $entry)
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
                                    <form action="{{ route('dashboard.entry.delete', ['id' => $entry->id, 'channel' => $selected_channel]) }}" method="POST" class="inline" onsubmit="return confirm('Hapus data ini?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="text-red-600 hover:text-red-900">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="7" class="px-6 py-6 text-center text-sm text-slate-500">
                                    No recent entries found.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</x-layouts.dashboard>
