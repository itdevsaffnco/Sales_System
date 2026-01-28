@php
    $title = 'Login';
    $appName = 'Sales App';
    $subtitle = 'Sign in to continue';
@endphp

@component('components.layouts.app', ['title' => $title, 'appName' => $appName, 'subtitle' => $subtitle])
    <div class="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center">
        <div class="w-full max-w-md">
            <div class="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div class="px-6 pt-6">
                    <div class="flex items-center justify-center">
                        <img src="{{ asset('images/logo.svg') }}" alt="Logo" class="h-14 w-14 rounded-2xl">
                    </div>
                    <h1 class="mt-4 text-center text-2xl font-semibold tracking-tight">Welcome back</h1>

                </div>

                <div class="px-6 pb-6 pt-6">
                    <form class="space-y-4" method="POST" action="{{ url('/login') }}">
                        @csrf

                        <div>
                            <label class="block text-sm font-medium text-slate-700">Email</label>
                            <input
                                class="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                                name="email"
                                type="email"
                                required
                                value="{{ old('email') }}"
                                placeholder="staff@sales.local / manager@sales.local"
                                autocomplete="email"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-700">Password</label>
                            <input
                                class="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                                name="password"
                                type="password"
                                required
                                placeholder="password123"
                                autocomplete="current-password"
                            />
                        </div>

                        <div class="pt-2">
                            <button class="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200" type="submit">
                                Login
                            </button>
                        </div>
                    </form>


                </div>
            </div>

            <div class="mt-4 text-center text-xs text-slate-500">
                © {{ date('Y') }} Sales App
            </div>
        </div>
    </div>
@endcomponent
