<?php

namespace App\Models;

use App\Casts\TimeOfDay;
use App\Enums\TaskPriority;
use Carbon\CarbonImmutable;
use Database\Factories\TaskFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property TaskPriority $priority
 * @property string|null $starts_at
 * @property string|null $ends_at
 * @property CarbonImmutable|null $completed_at
 * @property-read bool $is_completed
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable(['title', 'description', 'priority', 'starts_at', 'ends_at'])]
class Task extends Model
{
    /** @use HasFactory<TaskFactory> */
    use HasFactory;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'priority' => 'medium',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'priority' => TaskPriority::class,
            'starts_at' => TimeOfDay::class,
            'ends_at' => TimeOfDay::class,
            'completed_at' => 'immutable_datetime',
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
        ];
    }

    /**
     * @return Attribute<bool, never>
     */
    protected function isCompleted(): Attribute
    {
        return Attribute::get(fn (): bool => $this->completed_at !== null);
    }

    /**
     * Mark the task as completed or reopen it. Completing an already
     * completed task keeps its original completion time.
     */
    public function setCompleted(bool $completed): static
    {
        $this->completed_at = $completed ? ($this->completed_at ?? CarbonImmutable::now()) : null;

        return $this;
    }

    /**
     * Open tasks first, then by priority, then newest first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ordered(Builder $query): void
    {
        $query->orderByRaw('CASE WHEN completed_at IS NULL THEN 0 ELSE 1 END');

        collect(TaskPriority::cases())
            ->sortBy(fn (TaskPriority $priority): int => $priority->rank())
            ->each(fn (TaskPriority $priority) => $query->orderByRaw(
                'CASE WHEN priority = ? THEN 0 ELSE 1 END',
                [$priority->value],
            ));

        $query->latest('id');
    }
}
