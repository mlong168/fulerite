<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDatasourceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('datasources', function (Blueprint $table) {
            $table->increments('id');
            $table->string('driver');
            $table->string('alias')->unique();
            $table->string('db_name');
            $table->string('username');
            $table->string('password', 60);
            $table->integer('port');
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
        //
    }
}
