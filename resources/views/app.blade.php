<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="description" content="A calm, focused todo list built with Laravel and Vue.">
    <meta name="color-scheme" content="light dark">
    <meta name="theme-color" content="#fafafb" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#111114" media="(prefers-color-scheme: dark)">

    <title>{{ config('app.name') }}</title>

    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="alternate icon" href="/favicon.ico">

    {{-- Apply the saved theme before first paint to avoid a flash of the wrong colours. --}}
    <script>
        (() => {
            let theme = 'auto';
            try {
                theme = localStorage.getItem('theme') ?? 'auto';
            } catch {}
            const dark = theme === 'dark' || (theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
            document.documentElement.classList.toggle('dark', dark);
        })();
    </script>

    @fonts
    @vite(['resources/css/app.css', 'resources/js/app.ts'])
</head>
<body>
    <div id="app"></div>

    <noscript>
        <p style="padding: 2rem; text-align: center">This app needs JavaScript enabled to run.</p>
    </noscript>
</body>
</html>
