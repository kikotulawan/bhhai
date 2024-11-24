<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('block_and_lots', function (Blueprint $table) {
            $table->string('status')->nullable()->after('lot');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('block_and_lots', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
