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
            if (!Schema::hasColumn('board_members', 'image')) {
                $table->string('image')->nullable()->after('end_of_term');
            }
        });
    }
    
    public function down()
    {
        Schema::table('board_members', function (Blueprint $table) {
            if (Schema::hasColumn('board_members', 'image')) {
                $table->dropColumn('image');
            }
        });
    }
};
