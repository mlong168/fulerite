<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Feed;

class FeedController extends Controller
{
    public function getData()
    {
        $feeds = Feed::paginate(10)->toArray();

        return response()->success(compact('feeds'));
    }

    // Get a list of columns
    public function getColumns()
    {
    	$feed = new Feed();
    	$columns = $feed->getTableColumns();
    	return response()->success(compact('columns'));	
    }
}
