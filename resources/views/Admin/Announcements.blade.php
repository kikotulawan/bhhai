<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BHHAI</title>
    @viteReactRefresh
    @vite(['resources/js/app.jsx', 'resources/css/app.css', 'resources/js/index.jsx'])
</head>
<body>
<div id="admin"></div> 

</body>
</html>
