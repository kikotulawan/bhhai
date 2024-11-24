<x-guest-layout>
    <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div class="w-full max-w-md p-8 space-y-4 rounded-xl bg-white shadow-lg">

            <!-- Validation Errors -->
            <x-validation-errors class="mb-4" />

            <!-- Reset Password Form -->
            <form method="POST" action="{{ route('password.update') }}">
                @csrf

                <input type="hidden" name="token" value="{{ $request->route('token') }}">

                <!-- Email Field (Read-Only) -->
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" type="email" name="email" value="{{ old('email', $request->email) }}" required readonly class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md bg-gray-100 focus:outline-none" />
                </div>

                <!-- Password Requirements Text with Icon -->
                <div class="flex items-center text-sm text-gray-600 mb-4">
                    <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
                    <p>Use at least 8 characters, including uppercase, lowercase, numbers, and symbols.</p>
                </div>

                <!-- Password Field with Eye Icon -->
                <div class="mb-4 relative">
                    <label for="password" class="block text-sm font-medium text-gray-700">New Password</label>
                    <input id="password" type="password" name="password" required autocomplete="new-password" oninput="checkPasswordStrength()" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500" />
                    
                    <!-- Eye Icon for Toggling Password Visibility -->
                    <span onclick="togglePassword('password', 'eye-icon1')" class="absolute right-3 top-8 cursor-pointer">
                        <i id="eye-icon1" class="fas fa-eye text-gray-500"></i>
                    </span>

                    <!-- Password Strength Indicator -->
                    <p id="password-strength-text" class="text-sm mt-2"></p>
                </div>

                <!-- Confirm Password Field with Eye Icon -->
                <div class="mb-4 relative">
                    <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input id="password_confirmation" type="password" name="password_confirmation" required autocomplete="new-password" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500" />
                    
                    <!-- Eye Icon for Toggling Confirm Password Visibility -->
                    <span onclick="togglePassword('password_confirmation', 'eye-icon2')" class="absolute right-3 top-8 cursor-pointer">
                        <i id="eye-icon2" class="fas fa-eye text-gray-500"></i>
                    </span>
                </div>

                <!-- Submit Button -->
                <div class="mt-6">
                    <button type="submit" class="w-full flex items-center justify-center px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-600">
                        Reset Password
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Font Awesome and zxcvbn Library for Icons and Password Strength -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.2/zxcvbn.js"></script>

    <!-- JavaScript for Toggling Password Visibility and Checking Strength -->
    <script>
        function togglePassword(fieldId, iconId) {
            const field = document.getElementById(fieldId);
            const eyeIcon = document.getElementById(iconId);
            
            if (field.type === "password") {
                field.type = "text";
                eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
            } else {
                field.type = "password";
                eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
            }
        }

        function checkPasswordStrength() {
            const password = document.getElementById('password').value;
            const strengthText = document.getElementById('password-strength-text');
            const result = zxcvbn(password);
            let strengthLabel = '';
            let strengthColor = '';

            switch (result.score) {
                case 0:
                case 1:
                    strengthLabel = 'Too weak';
                    strengthColor = 'text-red-500';
                    break;
                case 2:
                    strengthLabel = 'Weak';
                    strengthColor = 'text-yellow-500';
                    break;
                case 3:
                    strengthLabel = 'Moderate';
                    strengthColor = 'text-green-500';
                    break;
                case 4:
                    strengthLabel = 'Strong';
                    strengthColor = 'text-blue-500';
                    break;
                default:
                    strengthLabel = '';
                    strengthColor = '';
            }

            strengthText.textContent = strengthLabel;
            strengthText.className = `text-sm mt-2 ${strengthColor}`;
        }
    </script>
</x-guest-layout>
