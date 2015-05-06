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

if(AWS_DEBUG)
    $XMS->XMS_SERVER_CONSOLE = "\t\t\t".$XMS->TEMPLATE_FILE_SOURCE." ET:".$XMS->getET()."\n";
