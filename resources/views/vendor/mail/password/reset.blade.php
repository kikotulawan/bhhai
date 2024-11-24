@component('mail::message')
# Reset Password

Click the button below to reset your password.

@component('mail::button', ['url' => config('app.frontend_url') . '/reset-pass?token=' . $token . '&email=' . urlencode($email)])
Reset Password
@endcomponent

If you did not request a password reset, no further action is required.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
