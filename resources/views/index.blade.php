<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    @vite('resources/css/app.css')
</head>
<body
    class="bg-gradient-to-b from-[#e8eaee] via-[#d1d4db] to-[#babdc8] bg-no-repeat h-screen overflow-hidden dark:bg-none dark:bg-slate-800">
<div id="app"
     class="mx-auto w-[50%] bg-white rounded-2xl p-8 mt-5 text-black shadow-2xl dark:bg-slate-700 dark:text-white">
    <div class="flex justify-between items-center border-b-2 border-gray-200 border-solid">
        <div>
            <h1 class="text-[2rem] font-bold">Todo List</h1>
        </div>
        <div class="flex font-bold">
            <router-link to="/" class="px-3" active-class="bg-blue-400 rounded text-white">Task
            </router-link>
            <router-link to="/about" class="px-3" active-class="bg-blue-400 rounded text-white">About
            </router-link>
        </div>
    </div>
    <router-view :date="{{json_encode($date)}}" :tasks="{{json_encode($taskData)}}"></router-view>
</div>

@vite('resources/js/app.js')
</body>
</html>
