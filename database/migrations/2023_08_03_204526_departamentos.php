<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Departamentos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('departamentos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->boolean('estado')->default(true);
            $table->bigInteger('pais_id')->unsigned();
            $table->bigInteger('user_id')->unsigned();
           
            $table->timestamps();
        });
        Schema::table('departamentos', function ($table) {
            $table->foreign('pais_id')->references('id')->on('paises');
        });
        
        Schema::table('departamentos', function ($table) {
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
        Schema::dropIfExists('departamentos');
    }
}
