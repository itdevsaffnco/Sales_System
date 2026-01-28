@component('components.layouts.dashboard', ['title' => 'Account Settings'])
    <div class="max-w-4xl">
        <div class="rounded-lg border border-slate-200 bg-white p-6">
            <div class="mb-6 border-b border-slate-100 pb-6">
                <h3 class="text-base font-semibold leading-6 text-slate-900">Profile Info</h3>
                <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label class="block text-sm font-medium text-slate-700">Name</label>
                        <div class="mt-1 block w-full rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                            {{ session('user')['name'] ?? '-' }}
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700">Role</label>
                        <div class="mt-1 block w-full rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700 uppercase">
                            {{ str_replace('_', ' ', session('user')['role'] ?? '-') }}
                        </div>
                    </div>
                </div>
            </div>

            <form method="POST" action="{{ route('settings.account.password') }}">
                @csrf
                <h3 class="text-base font-semibold leading-6 text-slate-900 mb-4">Change Password</h3>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label class="block text-sm font-medium text-slate-700">Current Password</label>
                        <input type="password" name="current_password" class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" required />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700">New Password</label>
                        <input type="password" name="new_password" class="mt-1 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" required />
                    </div>
                </div>
                <div class="pt-4">
                    <button class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700" type="submit">Change Password</button>
                </div>
            </form>
        </div>
    </div>
@endcomponent
