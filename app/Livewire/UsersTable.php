<?php

namespace App\Http\Livewire;

use Livewire\Component;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserApproved;

class UsersTable extends Component
{
    public $users;

    public function mount()
    {
        $this->users = User::where('role', 'applicant')->get(); // Adjust the role check as necessary
    }

    public function approve($userId)
    {
        $user = User::find($userId);
        $user->status = 'approved'; 
        $user->save();

        Mail::to($user->email)->send(new UserApproved($user));

        session()->flash('message', 'User approved successfully.');
        $this->mount(); 
    }

    public function reject($userId)
    {
        $user = User::find($userId);
        $user->status = 'rejected'; 
        $user->save();

        session()->flash('message', 'User rejected.');
        $this->mount(); 
    }

    public function render()
    {
        return view('livewire.users-table');
    }
}
