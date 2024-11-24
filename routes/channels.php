<?php

use Illuminate\Support\Facades\Broadcast;

// This defines a private channel for each user, where {id} is the user’s ID
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    // Authorizes the current authenticated user to listen to their own notifications channel
    return (int) $user->id === (int) $id;
});
