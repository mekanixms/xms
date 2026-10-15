<?php

use Doctum\Doctum;
use Symfony\Component\Finder\Finder;

$iterator = Finder::create()
    ->files()
    ->name('*.php')
    ->in(__DIR__ . '/includes/Xms');

return new Doctum($iterator, [
    'title' => 'XMS API',
    'language' => 'en',
    'build_dir' => __DIR__ . '/doc',
    'cache_dir' => __DIR__ . '/cache/doctum',
    'default_opened_level' => 2,
]);
