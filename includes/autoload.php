<?php
require __DIR__ . '/Psr4Autoloader.php';

// instantiate the loader
$loader = new Psr4Autoloader();
// register the autoloader
$loader->register();
// register the base directories for the namespace prefix
$loader->addNamespace('Xms\Core', __DIR__ . '/Xms/Core');
$loader->addNamespace('Test', __DIR__ . '../test/phpUnit');
$loader->addNamespace('Third\Party', __DIR__ . '/Third/Party');
