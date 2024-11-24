<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('firstName');
            $table->string('lastName');
            $table->string('middleName')->nullable();
            $table->string('gender');
            $table->string('contact_number')->nullable();
            $table->string('block')->nullable();
            $table->string('lot')->nullable();
            $table->string('proofOfResidency')->nullable();
            $table->string('nameOfOwner')->nullable();
             $table->string('email')->collation('utf8mb4_bin')->unique();
            $table->string('username')->unique()->nullable();
            $table->string('usertype')->default('0'); // Ensure this aligns with your logic
            $table->string('role')->default('renter');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->rememberToken();
            $table->foreignId('current_team_id')->nullable()->constrained('teams')->nullOnDelete(); // Assuming you have a 'teams' table
            $table->string('profile_photo_path', 2048)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
