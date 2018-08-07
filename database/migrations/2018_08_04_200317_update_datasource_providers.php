<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateDatasourceProviders extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('providers', function($table) {
            $table->dropColumn('datasource');
        });

        Schema::table('providers', function($table) {
            $table->string('datasource');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('providers', function($table) {
            $table->dropColumn('datasource');
        });
    }
}
