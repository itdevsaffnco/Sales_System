@component('components.layouts.dashboard', ['title' => 'Pricing'])
    <div class="space-y-6">
        <div class="rounded-lg border border-slate-200 bg-white p-6">
            <h3 class="text-base font-semibold">Update Price</h3>
            <form method="POST" action="{{ route('settings.pricing.update') }}" class="mt-4 space-y-4">
                @csrf
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700">SKU Code</label>
                        <input type="text" name="sku_code" class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" />
                        <p class="mt-1 text-xs text-slate-500">Isi salah satu: code atau name</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700">SKU Name</label>
                        <input type="text" name="sku_name" class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700">New Price</label>
                    <div class="relative mt-1">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm text-slate-500">Rp</div>
                        <input type="number" name="price" class="pl-10 mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" required min="0" />
                    </div>
                </div>
                <div class="pt-2">
                    <button class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700" type="submit">Update</button>
                </div>
            </form>
        </div>

        <div class="rounded-lg border border-slate-200 bg-white p-6">
            <div class="flex items-center justify-between gap-3">
                <h3 class="text-base font-semibold">SKUs</h3>
                <div class="flex items-center gap-2">
                    <form method="GET" action="{{ route('settings.pricing') }}" class="flex items-center gap-2">
                        <input name="q" value="{{ $q ?? request('q') }}" placeholder="Search code or name"
                               class="w-56 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                        <button class="rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800" type="submit">Search</button>
                    </form>
                    <a href="{{ route('settings.pricing.download', array_filter(['q' => request('q')])) }}"
                       class="rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">Download CSV</a>
                </div>
            </div>
            <div class="mt-4 overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200">
                    <thead class="bg-slate-50">
                        <tr>
                            <th class="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Code</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                            <th class="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Price</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-slate-200">
                        @forelse($skus as $sku)
                            <tr>
                                <td class="px-4 py-2 text-sm">{{ $sku->sku_code }}</td>
                                <td class="px-4 py-2 text-sm">{{ $sku->sku_name }}</td>
                                <td class="px-4 py-2 text-sm text-right">Rp {{ number_format((int)$sku->price, 0, ',', '.') }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="3" class="px-4 py-6 text-center text-sm text-slate-500">No data</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
@endcomponent
