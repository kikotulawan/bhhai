<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>BHHAI</title>
    @viteReactRefresh
    @vite(['resources/js/app.jsx','resources/js/index.jsx', 'resources/css/app.css'])
</head>
<body>
    <div id="root"></div>
</body>
</html>
