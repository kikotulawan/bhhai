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
        Schema::table('users', function (Blueprint $table) {
            // Change the collation of the existing email column without redefining the unique constraint
            $table->string('email')->collation('utf8mb4_bin')->change();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Rollback to the previous state (if applicable)
            $table->string('email')->collation('utf8_general_ci')->change();
        });
    }
};
