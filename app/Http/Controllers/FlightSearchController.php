<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FlightSearchController extends Controller
{
    public function store(Request $request)
    {
        $data = json_encode($request->all());
        $now = \Carbon\Carbon::now();
        app('db')->insert('insert into flight_search (data, created_at, updated_at) values (?, ?, ?)', [$data, $now, $now]);
        return response()->json('ok');
    }
}
