<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAccountHolderIdToFamiliesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('families', function (Blueprint $table) {
            // Add the account_holder_id column (this references the user's ID)
            $table->unsignedBigInteger('account_holder_id')->nullable()->after('lot');
            // Add a foreign key constraint if necessary
            $table->foreign('account_holder_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('families', function (Blueprint $table) {
            // Rollback the changes
            $table->dropForeign(['account_holder_id']);
            $table->dropColumn('account_holder_id');
        });
    }
}
