<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SpaShellTest extends TestCase
{
    #[Test]
    public function it_serves_the_single_page_application_shell(): void
    {
        $this->withoutVite();

        $this->get('/')
            ->assertOk()
            ->assertSee('<div id="app"', escape: false);
    }

    #[Test]
    public function it_exposes_a_health_check(): void
    {
        $this->get('/up')->assertOk();
    }
}
