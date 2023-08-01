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
            $table->string('departamento');
            $table->string('ciudad');
            $table->string('direccion');
            $table->string('direccion2');
            $table->string('telefono');
            $table->string('celular');
            $table->string('email');
            $table->string('url_web');
            $table->string('horario_atencion');
            $table->boolean('estado')->default(false);         
            $table->timestamps();
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
