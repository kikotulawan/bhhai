import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Setup Laravel Echo
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Setup Pusher or Soketi
window.Pusher = Pusher;

// Laravel Echo configuration
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,  // Reference the Vite .env variables
    wsHost: import.meta.env.VITE_PUSHER_HOST || '127.0.0.1',
    wsPort: import.meta.env.VITE_PUSHER_PORT || 6001,
    forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
    disableStats: true,  // Disable Pusher's stats collection
    encrypted: process.env.MIX_PUSHER_APP_TLS || false,  // Encryption (optional for TLS)
});
