@component('components.layouts.dashboard', ['title' => 'Product Settings'])
    @php
        $val = function($field, $default = null) use ($editing) {
            $old = old($field);
            if ($old !== null) return $old;
            if (!empty($editing)) {
                return $editing[$field] ?? $default;
            }
            return $default;
        };

        $sortLink = function($col, $label) {
            $currentSort = request('sort', 'sku_code');
            $currentDir = request('direction', 'asc');
            $nextDir = ($currentSort === $col && $currentDir === 'asc') ? 'desc' : 'asc';
            $params = array_merge(request()->query(), ['sort' => $col, 'direction' => $nextDir]);
            $url = route('settings.products', $params);
            
            $arrow = '';
            if ($currentSort === $col) {
                $arrow = $currentDir === 'asc' ? ' &uarr;' : ' &darr;';
            }
            
            return '<a href="'.$url.'" class="group inline-flex items-center hover:text-slate-700">'.$label.$arrow.'</a>';
        };
    @endphp
    <div class="space-y-6">
        <div class="rounded-lg border border-slate-200 bg-white p-6">
            <div class="flex items-center justify-between">
                <h3 class="text-base font-semibold">Adding New Product</h3>
                @if(!empty($editing))
                    <span class="inline-flex items-center rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">Edit Mode</span>
                @endif
            </div>
            <form method="POST" action="{{ route('settings.products.create') }}" class="mt-4 space-y-4">
                @csrf
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label class="block text-sm font-medium text-slate-700">SKU Name</label>
                        <input type="text" name="sku_name" value="{{ $val('sku_name') }}" class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" required />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700">SKU Code</label>
                        <input type="text" name="sku_code" value="{{ $val('sku_code') }}" class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" required />
                    </div>
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <label class="block text-sm font-medium text-slate-700">mL</label>
                        <input type="text" name="ml" value="{{ $val('ml') }}" class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" placeholder="e.g. 50 mL" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700">Category</label>
                        <select name="category" class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" required>
                            <option value="">Pilih Category</option>
                            @foreach(($categories ?? []) as $cat)
                                <option value="{{ $cat }}" {{ (string)$val('category') === (string)$cat ? 'selected' : '' }}>{{ $cat }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700">Status</label>
                        <select name="status" class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" required>
                            <option value="">Pilih Status</option>
                            @foreach(($statuses ?? []) as $st)
                                <option value="{{ $st }}" {{ (string)$val('status') === (string)$st ? 'selected' : '' }}>{{ $st }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label class="block text-sm font-medium text-slate-700">Channel Distribution</label>
                        <select name="channel_distribution" class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" required>
                            <option value="">Pilih Channel</option>
                            @foreach(($channelGroups ?? []) as $cg)
                                <option value="{{ $cg }}" {{ (string)$val('channel_distribution') === (string)$cg ? 'selected' : '' }}>{{ $cg }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700">Pricing (RSP)</label>
                        <div class="relative mt-1">
                            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm text-slate-500">Rp</div>
                            <input type="number" name="price" value="{{ $val('price') }}" min="0" class="w-full rounded-md border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" placeholder="0" />
                        </div>
                    </div>
                </div>
                <div class="pt-2">
                    <button class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700" type="submit">
                        {{ !empty($editing) ? 'Save Changes' : 'Create' }}
                    </button>
                    @if(!empty($editing))
                        <a href="{{ route('settings.products') }}" class="ml-2 rounded-md bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Cancel</a>
                    @endif
                </div>
            </form>
        </div>

        <div class="rounded-lg border border-slate-200 bg-white p-6">
            <div class="flex items-center justify-between gap-3">
                <h3 class="text-base font-semibold">Existing SKUs</h3>
                <div class="flex items-center gap-2">
                    <form method="GET" action="{{ route('settings.products') }}" class="flex items-center gap-2">
                        <input name="q" value="{{ $q ?? request('q') }}" placeholder="Search code or name" class="w-56 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                        <button class="rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800" type="submit">Search</button>
                    </form>
                    <a href="{{ route('settings.products.download', array_filter(['q' => request('q')])) }}" class="rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">Download CSV</a>
                </div>
            </div>
            <div class="mt-4 overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200">
                    <thead class="bg-slate-50">
                        <tr>
                            <th class="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">{!! $sortLink('sku_code', 'Code') !!}</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">{!! $sortLink('sku_name', 'Name') !!}</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">{!! $sortLink('ml', 'ML') !!}</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">{!! $sortLink('category', 'Category') !!}</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">{!! $sortLink('status', 'Status') !!}</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">{!! $sortLink('channel_distribution', 'Channel') !!}</th>
                            <th class="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">
                                <div class="flex justify-end">
                                    {!! $sortLink('price', 'Price') !!}
                                </div>
                            </th>
                            <th class="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-slate-200">
                        @forelse($skus as $sku)
                            <tr class="hover:bg-slate-50">
                                <td class="px-4 py-2 text-sm">{{ $sku->sku_code }}</td>
                                <td class="px-4 py-2 text-sm">{{ $sku->sku_name }}</td>
                                <td class="px-4 py-2 text-sm">{{ $sku->ml }}</td>
                                <td class="px-4 py-2 text-sm">{{ $sku->category }}</td>
                                <td class="px-4 py-2 text-sm">{{ $sku->status }}</td>
                                <td class="px-4 py-2 text-sm">{{ $sku->channel_distribution }}</td>
                                <td class="px-4 py-2 text-sm text-right whitespace-nowrap">Rp {{ number_format((int)$sku->price, 0, ',', '.') }}</td>
                                <td class="px-4 py-2 text-sm">
                                    <div class="flex items-center justify-end gap-2">
                                        <button type="button" onclick="openDeleteModal('{{ $sku->sku_code }}', '{{ addslashes($sku->sku_name) }}')" class="inline-flex items-center rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="8" class="px-4 py-6 text-center text-sm text-slate-500">No data</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div id="deleteModal" class="fixed inset-0 z-50 hidden overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onclick="closeDeleteModal()"></div>
            <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
            <div class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">Hapus SKU</h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">
                                    Apakah Anda yakin ingin menghapus SKU <span id="deleteSkuName" class="font-bold"></span>? Tindakan ini tidak dapat dibatalkan.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <form method="POST" action="{{ route('settings.products.delete') }}" id="deleteForm">
                        @csrf
                        <input type="hidden" name="sku_code" id="deleteSkuCode">
                        <button type="submit" class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">
                            Hapus
                        </button>
                    </form>
                    <button type="button" onclick="closeDeleteModal()" class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Batal
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        function openDeleteModal(skuCode, skuName) {
            document.getElementById('deleteSkuCode').value = skuCode;
            document.getElementById('deleteSkuName').textContent = skuName;
            document.getElementById('deleteModal').classList.remove('hidden');
        }

        function closeDeleteModal() {
            document.getElementById('deleteModal').classList.add('hidden');
        }
    </script>
@endcomponent
