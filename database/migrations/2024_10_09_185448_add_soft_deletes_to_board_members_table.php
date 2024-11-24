<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('board_members', function (Blueprint $table) {
            // Check if 'deleted_at' column does not already exist before adding it
            if (!Schema::hasColumn('board_members', 'deleted_at')) {
                $table->softDeletes();  // Add the 'deleted_at' column
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('board_members', function (Blueprint $table) {
            // Drop 'deleted_at' column if it exists
            if (Schema::hasColumn('board_members', 'deleted_at')) {
                $table->dropColumn('deleted_at');
            }
        });
    }
};

