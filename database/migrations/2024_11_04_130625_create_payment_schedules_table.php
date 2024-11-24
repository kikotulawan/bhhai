<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentSchedulesTable extends Migration
{
    public function up()
    {
        Schema::create('payment_schedules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Foreign key to the users table
            $table->integer('amount'); // Amount in centavos
            $table->string('description');
            $table->string('remarks')->nullable();
            $table->date('due_date'); // Date when payment is due
            $table->string('status')->default('Pending'); // Status of the payment (e.g., Pending, Paid)
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('payment_schedules');
    }
}