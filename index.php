<?php
/*
 * XMS - Online Web Development
 *
 * Copyright (c) 2010 Cezar Lucan cezar.lucan@aws-dms.com
 * Licensed under GPL license.
 * http://www.aws-dms.com
 *
 * Date: 2010-10-24
 */
session_start();
require 'defaults.php';

$XMS = new Xms\Core\Xms();

$XMS->run();
echo $XMS->get();

//file_put_contents("DURATION", $XMS->TEMPLATE_FILE_SOURCE . "\t\t\t\t\t" . sprintf('%f', $XMS->getET()) . "\n", FILE_APPEND);

?>