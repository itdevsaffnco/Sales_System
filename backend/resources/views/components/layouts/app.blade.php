<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Sales App' }}</title>
    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @else
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        <style>
            /*! tailwindcss v4.0.7 | minimal runtime subset from welcome.blade */
            @layer theme {
                :root {
                    --font-sans: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
                    'Segoe UI Symbol', 'Noto Color Emoji';
                }
            }
        </style>
        <script src="https://cdn.tailwindcss.com"></script>
    @endif
</head>
<body class="min-h-screen bg-slate-50 text-slate-900">
    @php
        $sessionUser = request()->session()->get('user');
        $userName = $sessionUser['name'] ?? null;
        $userRole = $sessionUser['role'] ?? null;
    @endphp

    <div class="min-h-screen">
        <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
            <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <div class="flex items-center gap-3">
                    <img src="{{ asset('images/logo.svg') }}" alt="Logo" class="h-9 w-9 rounded-xl">
                    <div>
                        <div class="text-sm font-semibold leading-5">{{ $appName ?? 'Sales App' }}</div>
                        <div class="text-xs text-slate-500 leading-4">{{ $subtitle ?? 'Sales reporting' }}</div>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    @if ($userName)
                        <div class="hidden sm:block text-right">
                            <div class="text-xs font-medium leading-4">{{ $userName }}</div>
                            <div class="text-[11px] text-slate-500 leading-4">{{ $userRole }}</div>
                        </div>
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button class="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800" type="submit">Logout</button>
                        </form>
                    @endif
                </div>
            </div>
        </header>

        <main class="mx-auto w-full max-w-6xl px-4 py-6">
            @if (session('success'))
                <div class="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    {{ session('success') }}
                </div>
            @endif

            @if (session('error'))
                <div class="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                    {{ session('error') }}
                </div>
            @endif

            @if ($errors->any())
                <div class="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                    <ul class="list-disc pl-5">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            {{ $slot }}
        </main>
    </div>
</body>
</html>
