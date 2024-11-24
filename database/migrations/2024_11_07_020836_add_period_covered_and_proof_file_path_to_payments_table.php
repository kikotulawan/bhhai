<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPeriodCoveredAndProofFilePathToPaymentsTable extends Migration
{
    public function up()
    {
        Schema::table('payments', function (Blueprint $table) {
            if (!Schema::hasColumn('payments', 'period_covered')) {
                $table->string('period_covered')->nullable()->after('amount'); // Halimbawa ng format: "January 2025" o due date
            }
            if (!Schema::hasColumn('payments', 'proof_file_path')) {
                $table->string('proof_file_path')->nullable()->after('status'); // Path ng proof file
            }
        });
    }

    public function down()
    {
        Schema::table('payments', function (Blueprint $table) {
            if (Schema::hasColumn('payments', 'period_covered')) {
                $table->dropColumn('period_covered');
            }
            if (Schema::hasColumn('payments', 'proof_file_path')) {
                $table->dropColumn('proof_file_path');
            }
        });
    }
}
