<?php

namespace App\Http\Requests\Concerns;

use App\Models\Task;
use Illuminate\Validation\Validator;

/**
 * Ensures a task never ends before it starts. When a field is omitted from a
 * partial update, the value already stored on the task is used instead.
 */
trait ValidatesTimeWindow
{
    /**
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->hasAny(['starts_at', 'ends_at'])) {
                    return;
                }

                $task = $this->route('task');
                $task = $task instanceof Task ? $task : null;

                $startsAt = $this->input('starts_at', $task?->starts_at);
                $endsAt = $this->input('ends_at', $task?->ends_at);

                if (is_string($startsAt) && is_string($endsAt) && $endsAt <= $startsAt) {
                    $validator->errors()->add('ends_at', __('The end time must be after the start time.'));
                }
            },
        ];
    }
}
