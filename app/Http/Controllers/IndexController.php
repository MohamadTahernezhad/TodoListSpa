<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
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
        $taskData = TaskResource::collection(Task::orderBy('importance', 'ASC')->paginate(100))->resource;
        return view('index', compact('date', 'taskData'));
    }
}
