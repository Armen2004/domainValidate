<?php

namespace App\Http\Controllers;

use App\Jobs\DomainJob;
use App\Models\Domain;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use League\Csv\Reader;

class DomainController extends Controller
{
    const MAX_ROW_COUNT = 100000;

    public function index()
    {
        return view('index');
    }

    public function store(Request $req)
    {
        $req->validate(['file' => 'required|mimes:csv']);
        $file = $req->file('file')->storeAs('uploads', $req->file->getClientOriginalName());
        $reader = Reader::createFromPath(Storage::path($file), 'r');
        $records = $reader->getRecords();
        $count = $reader->count();
        if ($count > self::MAX_ROW_COUNT) {
            return response()->json([
                'status' => 0,
                'message' => 'Max row limit 100.000.'
            ]);
        }
        foreach ($records as $offset => $record) {
            DomainJob::dispatch($record);
        }

        return response()->json([
            'status' => 1,
            'message' => 'Success data inserted!!!'
        ]);
    }

    public function listData()
    {
        return response()->json([
            'status' => 1,
            'data' => Domain::all()
        ]);
    }
}
