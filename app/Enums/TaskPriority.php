<?php

namespace App\Enums;

enum TaskPriority: string
{
    case High = 'high';
    case Medium = 'medium';
    case Low = 'low';

    /**
     * Sort weight of the priority; lower values come first.
     */
    public function rank(): int
    {
        return match ($this) {
            self::High => 0,
            self::Medium => 1,
            self::Low => 2,
        };
    }
}
