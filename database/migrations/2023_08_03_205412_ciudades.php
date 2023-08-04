<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Ciudades extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ciudades', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->boolean('estado')->default(true);
            $table->bigInteger('departamento_id')->unsigned();
            $table->bigInteger('user_id')->unsigned();
           
            $table->timestamps();
        });
        Schema::table('ciudades', function ($table) {
            $table->foreign('departamento_id')->references('id')->on('departamentos');
        });
        
        Schema::table('ciudades', function ($table) {
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
