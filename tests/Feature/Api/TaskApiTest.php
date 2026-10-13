<?php

namespace Tests\Feature\Api;

use App\Enums\TaskPriority;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    private const array TASK_STRUCTURE = [
        'id',
        'title',
        'description',
        'priority',
        'starts_at',
        'ends_at',
        'is_completed',
        'completed_at',
        'created_at',
        'updated_at',
    ];

    #[Test]
    public function it_lists_open_tasks_first_then_by_priority_then_newest(): void
    {
        $completedHigh = Task::factory()->priority(TaskPriority::High)->completed()->create();
        $low = Task::factory()->priority(TaskPriority::Low)->create();
        $olderHigh = Task::factory()->priority(TaskPriority::High)->create();
        $newerHigh = Task::factory()->priority(TaskPriority::High)->create();
        $medium = Task::factory()->priority(TaskPriority::Medium)->create();

        $this->getJson('/api/tasks')
            ->assertOk()
            ->assertJsonStructure(['data' => ['*' => self::TASK_STRUCTURE]])
            ->assertJsonPath('data.*.id', [
                $newerHigh->id,
                $olderHigh->id,
                $medium->id,
                $low->id,
                $completedHigh->id,
            ]);
    }

    #[Test]
    public function it_returns_an_empty_collection_when_there_are_no_tasks(): void
    {
        $this->getJson('/api/tasks')
            ->assertOk()
            ->assertExactJson(['data' => []]);
    }

    #[Test]
    public function it_creates_a_task(): void
    {
        $response = $this->postJson('/api/tasks', [
            'title' => 'Write the release notes',
            'description' => 'Summarise the refactor for the changelog.',
            'priority' => 'high',
            'starts_at' => '09:00',
            'ends_at' => '10:30',
        ]);

        $response
            ->assertCreated()
            ->assertJsonStructure(['data' => self::TASK_STRUCTURE])
            ->assertJsonPath('data.title', 'Write the release notes')
            ->assertJsonPath('data.priority', 'high')
            ->assertJsonPath('data.starts_at', '09:00')
            ->assertJsonPath('data.ends_at', '10:30')
            ->assertJsonPath('data.is_completed', false)
            ->assertJsonPath('data.completed_at', null);

        $this->assertDatabaseHas('tasks', [
            'title' => 'Write the release notes',
            'priority' => 'high',
            'completed_at' => null,
        ]);
    }

    #[Test]
    public function it_creates_a_task_with_only_a_title_using_sensible_defaults(): void
    {
        $this->postJson('/api/tasks', ['title' => 'Buy milk'])
            ->assertCreated()
            ->assertJsonPath('data.priority', 'medium')
            ->assertJsonPath('data.description', null)
            ->assertJsonPath('data.starts_at', null)
            ->assertJsonPath('data.ends_at', null);
    }

    #[Test]
    public function it_trims_the_title_and_treats_empty_optional_fields_as_null(): void
    {
        $this->postJson('/api/tasks', [
            'title' => '   Buy milk   ',
            'description' => '',
            'starts_at' => '',
        ])
            ->assertCreated()
            ->assertJsonPath('data.title', 'Buy milk')
            ->assertJsonPath('data.description', null)
            ->assertJsonPath('data.starts_at', null);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    #[Test]
    #[DataProvider('invalidTaskPayloads')]
    public function it_rejects_invalid_task_payloads(array $payload, string $invalidField): void
    {
        $this->postJson('/api/tasks', [...['title' => 'Valid title'], ...$payload])
            ->assertUnprocessable()
            ->assertOnlyJsonValidationErrors([$invalidField]);

        $this->assertDatabaseEmpty('tasks');
    }

    /**
     * @return array<string, array{array<string, mixed>, string}>
     */
    public static function invalidTaskPayloads(): array
    {
        return [
            'missing title' => [['title' => null], 'title'],
            'title too long' => [['title' => str_repeat('a', 121)], 'title'],
            'description too long' => [['description' => str_repeat('a', 2001)], 'description'],
            'unknown priority' => [['priority' => 'urgent'], 'priority'],
            'malformed start time' => [['starts_at' => '9am'], 'starts_at'],
            'out of range end time' => [['ends_at' => '25:00'], 'ends_at'],
            'end before start' => [['starts_at' => '10:00', 'ends_at' => '09:00'], 'ends_at'],
            'end equal to start' => [['starts_at' => '10:00', 'ends_at' => '10:00'], 'ends_at'],
        ];
    }

    #[Test]
    public function it_shows_a_single_task(): void
    {
        $task = Task::factory()->create();

        $this->getJson("/api/tasks/{$task->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $task->id)
            ->assertJsonPath('data.title', $task->title);
    }

    #[Test]
    public function it_updates_a_task(): void
    {
        $task = Task::factory()->priority(TaskPriority::Low)->create();

        $this->putJson("/api/tasks/{$task->id}", [
            'title' => 'Renamed',
            'description' => null,
            'priority' => 'high',
            'starts_at' => '13:00',
            'ends_at' => '14:00',
        ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Renamed')
            ->assertJsonPath('data.description', null)
            ->assertJsonPath('data.priority', 'high')
            ->assertJsonPath('data.starts_at', '13:00');

        $this->assertSame('Renamed', $task->fresh()?->title);
    }

    #[Test]
    public function it_partially_updates_a_task_without_touching_other_fields(): void
    {
        $task = Task::factory()->create(['title' => 'Original', 'priority' => TaskPriority::Low]);

        $this->patchJson("/api/tasks/{$task->id}", ['priority' => 'high'])
            ->assertOk()
            ->assertJsonPath('data.title', 'Original')
            ->assertJsonPath('data.priority', 'high');
    }

    #[Test]
    public function it_validates_the_time_window_against_stored_values_on_partial_update(): void
    {
        $task = Task::factory()->create(['starts_at' => '10:00', 'ends_at' => '11:00']);

        $this->patchJson("/api/tasks/{$task->id}", ['ends_at' => '09:30'])
            ->assertUnprocessable()
            ->assertOnlyJsonValidationErrors(['ends_at']);
    }

    #[Test]
    public function it_marks_a_task_as_completed(): void
    {
        Carbon::setTestNow('2026-10-13 12:00:00');
        $task = Task::factory()->create();

        $this->patchJson("/api/tasks/{$task->id}", ['is_completed' => true])
            ->assertOk()
            ->assertJsonPath('data.is_completed', true)
            ->assertJsonPath('data.completed_at', '2026-10-13T12:00:00+00:00');

        $this->assertNotNull($task->fresh()?->completed_at);
    }

    #[Test]
    public function it_reopens_a_completed_task(): void
    {
        $task = Task::factory()->completed()->create();

        $this->patchJson("/api/tasks/{$task->id}", ['is_completed' => false])
            ->assertOk()
            ->assertJsonPath('data.is_completed', false)
            ->assertJsonPath('data.completed_at', null);

        $this->assertNull($task->fresh()?->completed_at);
    }

    #[Test]
    public function it_rejects_a_non_boolean_completion_flag(): void
    {
        $task = Task::factory()->create();

        $this->patchJson("/api/tasks/{$task->id}", ['is_completed' => 'maybe'])
            ->assertUnprocessable()
            ->assertOnlyJsonValidationErrors(['is_completed']);
    }

    #[Test]
    public function it_deletes_a_task(): void
    {
        $task = Task::factory()->create();

        $this->deleteJson("/api/tasks/{$task->id}")->assertNoContent();

        $this->assertModelMissing($task);
    }

    #[Test]
    #[DataProvider('taskEndpoints')]
    public function it_returns_not_found_for_unknown_tasks(string $method): void
    {
        $this->json($method, '/api/tasks/999')->assertNotFound();
    }

    /**
     * @return array<string, array{string}>
     */
    public static function taskEndpoints(): array
    {
        return [
            'show' => ['GET'],
            'update' => ['PATCH'],
            'destroy' => ['DELETE'],
        ];
    }
}
