<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
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
        return [
            'title' => fake()->sentence(),
            'importance' => rand(1, 3),
            'body' => fake()->paragraph(),
            'start_at' => fake()->time('h:m'),
            'end_at' => fake()->time('h:m'),
            'active' => rand(0, 1),
        ];
    }
}
