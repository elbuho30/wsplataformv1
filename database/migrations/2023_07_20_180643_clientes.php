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
        Schema::create('cliente', function (Blueprint $table) {
            $table->id();
            $table->string('nro_documento');
            $table->string('nombres');
            $table->string('apellidos');
            $table->string('celular');
            $table->string('email');
            $table->boolean('estado')->default(false);
            $table->bigInteger('user_id')->unsigned();
           
            $table->timestamps();
        });
        Schema::table('cliente', function ($table) {
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cliente');
    }
};
