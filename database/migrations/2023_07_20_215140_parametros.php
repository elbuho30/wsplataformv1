<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Parametros extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('parametros', function (Blueprint $table) {
            $table->id();
            $table->string('nit');
            $table->string('razon_social');
            $table->string('sigla')->nullable();
            $table->string('descripcion')->nullable();
            $table->string('telefono')->nullable();
            $table->string('celular')->nullable();
            $table->string('email')->nullable();
            $table->string('url_meta')->nullable();
            $table->string('api_key')->nullable();
            $table->string('identificador_app')->nullable();            
            $table->boolean('estado')->default(false);
            $table->bigInteger('user_id')->unsigned();           
            $table->timestamps();
        });
        Schema::table('parametros', function ($table) {
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
        Schema::dropIfExists('parametros');
    }
}
