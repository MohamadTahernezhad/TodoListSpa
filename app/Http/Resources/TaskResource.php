<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'importance' => $this->importance,
            'body' => $this->body,
            'start_at' => $this->start_at,
            'end_at' => $this->end_at,
            'active' => $this->active,
            'created_at' => Carbon::parse($this->created_at)->format('l'),
        ];
    }
}
