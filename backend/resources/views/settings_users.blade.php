@component('components.layouts.dashboard', ['title' => 'User Management'])
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="rounded-lg border border-slate-200 bg-white p-6">
            <h3 class="text-base font-semibold">Create Account</h3>
            <form method="POST" action="{{ route('settings.users.create') }}" class="mt-4 space-y-4">
                @csrf
                <div>
                    <label class="block text-sm font-medium text-slate-700">Name</label>
                    <input type="text" name="name" class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" required />
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700">Email</label>
                    <input type="email" name="email" class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" required />
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700">Password</label>
                    <input type="password" name="password" class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" required />
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700">Role</label>
                    <select name="role" class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" required>
                        <option value="sales_staff">Sales Staff</option>
                        <option value="sales_manager">Sales Manager</option>
                    </select>
                </div>
                <div class="pt-2">
                    <button class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700" type="submit">Create</button>
                </div>
            </form>
        </div>
        <div class="rounded-lg border border-slate-200 bg-white p-6">
            <h3 class="text-base font-semibold">Recent Users</h3>
            <div class="mt-4 overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200">
                    <thead class="bg-slate-50">
                        <tr>
                            <th class="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                            <th class="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-slate-200">
                        @foreach($users as $u)
                            <tr>
                                <td class="px-4 py-2 text-sm">{{ $u->name }}</td>
                                <td class="px-4 py-2 text-sm">{{ $u->email }}</td>
                                <td class="px-4 py-2 text-sm">{{ $u->role }}</td>
                                <td class="px-4 py-2 text-sm text-right">
                                    <form method="POST" action="{{ route('settings.users.delete') }}" class="inline" onsubmit="return confirm('Delete user {{ $u->email }}?')">
                                        @csrf
                                        <input type="hidden" name="id" value="{{ $u->id }}" />
                                        <button type="submit" class="rounded-md bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
@endcomponent
