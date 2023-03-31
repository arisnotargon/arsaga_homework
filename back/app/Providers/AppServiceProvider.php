<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Elastic\Elasticsearch\ClientBuilder;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        $this->app->singleton('es', function () {
            $builder = ClientBuilder::create()->setHosts([
                config('database.es.host') . ':' . config('database.es.port')
            ]);
            if (app()->environment() === 'local') {
                $builder->setLogger(app('log')->driver());
            }
            return $builder->build();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
