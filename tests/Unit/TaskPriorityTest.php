<?php

namespace Tests\Unit;

use App\Enums\TaskPriority;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class TaskPriorityTest extends TestCase
{
    #[Test]
    public function higher_priorities_have_a_lower_rank(): void
    {
        $this->assertLessThan(TaskPriority::Medium->rank(), TaskPriority::High->rank());
        $this->assertLessThan(TaskPriority::Low->rank(), TaskPriority::Medium->rank());
    }

    #[Test]
    public function every_priority_has_a_unique_rank(): void
    {
        $ranks = array_map(fn (TaskPriority $priority): int => $priority->rank(), TaskPriority::cases());

        $this->assertSame($ranks, array_unique($ranks));
    }
}
