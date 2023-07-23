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
        $taskData = TaskResource::collection(Task::orderBy('importance', 'ASC')->latest()->paginate(100))->resource;
        return view('index', compact('date', 'taskData'));
    }

    public function TaskCreate(Request $request)
    {
        $request->validate([
            'title' => 'required|max:255',
            'importance' => 'required',
            'body' => 'required',
            'start_at' => 'required|max:5',
            'end_at' => 'required|max:5',
        ]);
        Task::create([
            'title' => $request->title,
            'importance' => $request->importance,
            'body' => $request->body,
            'start_at' => $request->start_at,
            'end_at' => $request->end_at,
            'active' => '0',
        ]);
        return response()->json(200);
    }

    public function GetAllTasksData()
    {
        return TaskResource::collection(Task::orderBy('importance', 'ASC')->latest()->paginate(100))->resource;
    }

    public function update(Request $request, string $id)
    {
        $taskItem = Task::query();
        $taskItem = $taskItem->where('id', $id)->first();
        $taskItem->update([
            'active' => $request->input('data')
        ]);
        return response()->json(200);
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(200);
    }
}
