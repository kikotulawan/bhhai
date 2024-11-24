<!DOCTYPE html>
<html>
<head>
    <title>Account Created</title>
</head>
<body>
    <h1>Hello, {{ $user->firstName }} {{ $user->lastName }}</h1>
    <p>Your account has been craeted. Your login credentials are as follows:</p>
    <p>Email: {{ $user->email }}</p>
    <p>Password: {{ $password }}</p>
    <p>Please change your password after logging in for the first time.</p>
</body>
</html>