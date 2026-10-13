<?php

namespace App\Http\Requests;

use App\Enums\TaskPriority;
use App\Http\Requests\Concerns\ValidatesTimeWindow;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    use ValidatesTimeWindow;

    /**
     * Every field is optional so the endpoint supports partial updates,
     * e.g. `{"is_completed": true}` to tick a task off.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:120'],
            'description' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'priority' => ['sometimes', 'required', Rule::enum(TaskPriority::class)],
            'starts_at' => ['sometimes', 'nullable', 'date_format:H:i'],
            'ends_at' => ['sometimes', 'nullable', 'date_format:H:i'],
            'is_completed' => ['sometimes', 'boolean'],
        ];
    }
}
