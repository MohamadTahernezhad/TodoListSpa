<?php

namespace Tests\Unit;

use App\Models\Task;
use Carbon\CarbonImmutable;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class TaskTest extends TestCase
{
    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();

        parent::tearDown();
    }

    #[Test]
    public function a_new_task_is_not_completed(): void
    {
        $this->assertFalse((new Task)->is_completed);
    }

    #[Test]
    public function completing_a_task_records_the_completion_time(): void
    {
        CarbonImmutable::setTestNow('2026-10-13 08:30:00');

        $task = (new Task)->setCompleted(true);

        $this->assertTrue($task->is_completed);
        $this->assertSame('2026-10-13 08:30:00', $task->completed_at?->toDateTimeString());
    }

    #[Test]
    public function completing_an_already_completed_task_keeps_the_original_time(): void
    {
        CarbonImmutable::setTestNow('2026-10-13 08:30:00');
        $task = (new Task)->setCompleted(true);

        CarbonImmutable::setTestNow('2026-10-14 09:00:00');
        $task->setCompleted(true);

        $this->assertSame('2026-10-13 08:30:00', $task->completed_at?->toDateTimeString());
    }

    #[Test]
    public function reopening_a_task_clears_the_completion_time(): void
    {
        $task = (new Task)->setCompleted(true)->setCompleted(false);

        $this->assertFalse($task->is_completed);
        $this->assertNull($task->completed_at);
    }

    #[Test]
    public function times_are_normalised_to_hours_and_minutes(): void
    {
        $task = (new Task)->setRawAttributes(['starts_at' => '09:15:00', 'ends_at' => null]);

        $this->assertSame('09:15', $task->starts_at);
        $this->assertNull($task->ends_at);
    }
}
