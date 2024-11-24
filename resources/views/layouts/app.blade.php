<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Announcement')</title>
    @vite('resources/css/app.css')
    @livewireStyles
</head>
<body>
    <div>
        @yield('content')
    </div>
    @viteReactRefresh
    @vite('resources/js/index.js')
    @livewireScripts
</body>
</html>
