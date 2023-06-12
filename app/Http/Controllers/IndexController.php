<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;

class IndexController extends Controller
{
    public function index()
    {
        $date = Carbon::today()->format('l' . ' , ' . ' d ' . 'M');
        $taskData = Task::orderBy('importance', 'ASC')->paginate(100);
        return view('index', compact('date', 'taskData'));
    }
}
