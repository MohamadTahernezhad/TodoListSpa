<?php

namespace Tests\Feature;

use App\Models\Task;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class DatabaseSeederTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_seeds_a_demo_day_with_open_and_completed_tasks(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertGreaterThan(0, Task::query()->whereNull('completed_at')->count());
        $this->assertGreaterThan(0, Task::query()->whereNotNull('completed_at')->count());
    }
}
