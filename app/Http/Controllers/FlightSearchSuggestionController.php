<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FlightSearchSuggestionController extends Controller
{
    public function index($term)
    {
        $client = new Client(['base_uri' => "https://api.loocpi.com/v1/"]);
        $response = $client->request('GET', "locations?key=".env('LOOCPI_API_KEY')."&autocomplete={$term}&lang=en");

        return response()->json($response->getBody()->getContents());
    }
}
