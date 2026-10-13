<?php

namespace Database\Seeders;

use App\Enums\TaskPriority;
use App\Models\Task;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with a realistic demo day.
     */
    public function run(): void
    {
        $tasks = [
            ['Review the API pull request', 'Focus on validation rules and the new task resource.', TaskPriority::High, '09:00', '10:00', false],
            ['Prepare the sprint demo', 'Walk through the new task dialog and dark mode.', TaskPriority::High, '14:00', '15:00', false],
            ['Reply to design feedback', 'They mostly need a yes or no on the colour palette.', TaskPriority::Medium, null, null, false],
            ['Book a dentist appointment', null, TaskPriority::Medium, '17:30', '18:00', false],
            ['Read chapter 4 of “Refactoring”', null, TaskPriority::Low, '21:00', '22:00', false],
            ['Update project dependencies', 'Laravel 13, Vue 3.5 and Tailwind CSS 4.', TaskPriority::Medium, null, null, true],
            ['Go for a 30-minute run', null, TaskPriority::Low, '07:00', '07:30', true],
        ];

        foreach ($tasks as [$title, $description, $priority, $startsAt, $endsAt, $completed]) {
            Task::factory()
                ->priority($priority)
                ->create([
                    'title' => $title,
                    'description' => $description,
                    'starts_at' => $startsAt,
                    'ends_at' => $endsAt,
                ])
                ->setCompleted($completed)
                ->save();
        }
    }
}
