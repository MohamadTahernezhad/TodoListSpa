<?php

namespace Database\Factories;

use App\Enums\TaskPriority;
use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startHour = fake()->numberBetween(8, 18);

        return [
            'title' => rtrim(fake()->sentence(4), '.'),
            'description' => fake()->optional(0.7)->sentence(12),
            'priority' => fake()->randomElement(TaskPriority::cases()),
            'starts_at' => sprintf('%02d:00', $startHour),
            'ends_at' => sprintf('%02d:30', $startHour + 1),
            'completed_at' => null,
        ];
    }

    public function completed(): static
    {
        return $this->state(fn (): array => ['completed_at' => now()]);
    }

    public function priority(TaskPriority $priority): static
    {
        return $this->state(fn (): array => ['priority' => $priority]);
    }

    public function unscheduled(): static
    {
        return $this->state(fn (): array => ['starts_at' => null, 'ends_at' => null]);
    }
}
