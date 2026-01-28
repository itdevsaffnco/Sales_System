@component('components.layouts.dashboard', ['title' => 'General Settings'])
    <div class="space-y-6">
        <p class="text-slate-600">Manage drop-down options for Categories, Statuses, and Channel Distributions.</p>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <!-- Category Section -->
            <div class="rounded-lg border border-slate-200 bg-white p-6 flex flex-col h-full">
                <h3 class="mb-4 text-lg font-semibold border-b pb-2">Categories</h3>
                <ul class="mb-4 flex-1 overflow-y-auto space-y-2 max-h-[500px]">
                    @foreach($categories as $item)
                        <li class="flex items-center justify-between rounded bg-slate-50 px-3 py-2 text-sm group hover:bg-slate-100">
                            <span class="font-medium text-slate-700">{{ $item->value }}</span>
                            <form action="{{ route('settings.attributes.delete') }}" method="POST" onsubmit="return confirm('Delete this category?')" class="opacity-0 group-hover:opacity-100 transition-opacity">
                                @csrf
                                <input type="hidden" name="id" value="{{ $item->id }}">
                                <button type="submit" class="text-rose-500 hover:text-rose-700" title="Delete">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                </button>
                            </form>
                        </li>
                    @endforeach
                </ul>
                <form action="{{ route('settings.attributes.add') }}" method="POST" class="mt-auto">
                    @csrf
                    <input type="hidden" name="type" value="category">
                    <div class="flex gap-2">
                        <input type="text" name="value" placeholder="New Category" required class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                        <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Add</button>
                    </div>
                </form>
            </div>

            <!-- Status Section -->
            <div class="rounded-lg border border-slate-200 bg-white p-6 flex flex-col h-full">
                <h3 class="mb-4 text-lg font-semibold border-b pb-2">Statuses</h3>
                <ul class="mb-4 flex-1 overflow-y-auto space-y-2 max-h-[500px]">
                    @foreach($statuses as $item)
                        <li class="flex items-center justify-between rounded bg-slate-50 px-3 py-2 text-sm group hover:bg-slate-100">
                            <span class="font-medium text-slate-700">{{ $item->value }}</span>
                            <form action="{{ route('settings.attributes.delete') }}" method="POST" onsubmit="return confirm('Delete this status?')" class="opacity-0 group-hover:opacity-100 transition-opacity">
                                @csrf
                                <input type="hidden" name="id" value="{{ $item->id }}">
                                <button type="submit" class="text-rose-500 hover:text-rose-700" title="Delete">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                </button>
                            </form>
                        </li>
                    @endforeach
                </ul>
                <form action="{{ route('settings.attributes.add') }}" method="POST" class="mt-auto">
                    @csrf
                    <input type="hidden" name="type" value="status">
                    <div class="flex gap-2">
                        <input type="text" name="value" placeholder="New Status" required class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                        <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Add</button>
                    </div>
                </form>
            </div>

            <!-- Channel Distribution Section -->
            <div class="rounded-lg border border-slate-200 bg-white p-6 flex flex-col h-full">
                <h3 class="mb-4 text-lg font-semibold border-b pb-2">Channel Distributions</h3>
                <ul class="mb-4 flex-1 overflow-y-auto space-y-2 max-h-[500px]">
                    @foreach($channels as $item)
                        <li class="flex items-center justify-between rounded bg-slate-50 px-3 py-2 text-sm group hover:bg-slate-100">
                            <span class="font-medium text-slate-700">{{ $item->value }}</span>
                            <form action="{{ route('settings.attributes.delete') }}" method="POST" onsubmit="return confirm('Delete this channel dist?')" class="opacity-0 group-hover:opacity-100 transition-opacity">
                                @csrf
                                <input type="hidden" name="id" value="{{ $item->id }}">
                                <button type="submit" class="text-rose-500 hover:text-rose-700" title="Delete">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                </button>
                            </form>
                        </li>
                    @endforeach
                </ul>
                <form action="{{ route('settings.attributes.add') }}" method="POST" class="mt-auto">
                    @csrf
                    <input type="hidden" name="type" value="channel_distribution">
                    <div class="flex gap-2">
                        <input type="text" name="value" placeholder="New Channel Dist" required class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                        <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Add</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endcomponent
