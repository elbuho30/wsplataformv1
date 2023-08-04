<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Oficinas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('oficinas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('direccion')->label('Dirección');
            $table->string('direccion2');
            $table->string('telefono')->label('Teléfono');
            $table->string('celular');
            $table->string('email');
            $table->string('url_web');
            $table->string('horario_atencion')->label(('Horario atención'));
            $table->boolean('estado')->default(false);         
            $table->bigInteger('ciudad_id')->unsigned();
            $table->bigInteger('user_id')->unsigned();
           
            $table->timestamps();
        });
        Schema::table('oficinas', function ($table) {
            $table->foreign('ciudad_id')->references('id')->on('ciudades');
        });
        
        Schema::table('oficinas', function ($table) {
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
        Schema::dropIfExists('oficinas');
    }
}

