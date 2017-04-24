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
/*
  Router used when mod rewrite is enabled
  looks inside request uri and searches for resources that exists but are behind fake keys
  if such a resource is found this file will stream it
  if not found loads index.php to handle it

  V.0.2-beta-2012-09-30
 */
session_start();
include ('defaults.php');

//if ($req_host == $_SERVER['HTTP_HOST'])
{
    //holds the path to existing resourse
    $exists = false;
    //holds the keys to remove from REQUEST URI
    $doesNotExists = array();
    //get  working directory
    $pi = pathinfo(filter_input(INPUT_SERVER, "SCRIPT_NAME"));
    $WD = $pi['dirname'];
    //on windows root is \
    if ($WD == '\\')
        $WD = "/";
    //remove the query string
    $URL = explode("?", filter_input(INPUT_SERVER, "REQUEST_URI"));
    //remove WD
    $rwd = substr_replace($URL[0], "", strpos($URL[0], $WD), strlen($WD));
    //remove trailing and ending slashes so not to have empty elements in the array
    $rwd = trim($rwd, "/");
    //split into path members
    $URL = explode("/", $rwd);

    while (sizeof($URL)) {
        if (is_file(implode("/", $URL)) || is_dir(implode("/", $URL))) {
            //copy existing file/dir into exists
            $exists = $URL;
            //and reset URL to get out of while
            $URL = array();
        } else
        //if not exists save current key for removal
            $doesNotExists[] = array_shift($URL);
    }
    //get the new URL by removing of the fake keys
    $URL = str_replace("/" . implode("/", $doesNotExists), "", filter_input(INPUT_SERVER, "REQUEST_URI"));

    if ($exists) {
        //debugging only
        if (defined("AWS_STREAM_FILE"))
            file_put_contents(AWS_STREAM_FILE, $URL . "\n", FILE_APPEND);

        $URL_info = pathinfo($URL);

        // if apache and php as module
        if (function_exists('virtual')) {
            header('content-type: ' . (Utils::mime($URL_info["extension"]) ? Utils::mime($URL_info["extension"]) : "text/xml"));
            if ($URL_info["extension"] == "psj")
                header("Content-Encoding: gzip");
            virtual($URL);
        }
        //php as CGI or not on apache !!! NOT SAFE !!!
        else {
            //build content based on the request methid
            switch (filter_input(INPUT_SERVER, "REQUEST_METHOD")) {
                case 'GET' :
                    $content = http_build_query($_GET, '', '&');
                    break;

                case 'POST' :
                    $content = http_build_query($_POST, '', '&');
                    break;
            }

            $opts = array(filter_input(INPUT_SERVER, "REQUEST_SCHEME") => array('method' => filter_input(INPUT_SERVER, "REQUEST_METHOD"), 'content' => $content));

            $context = stream_context_create($opts);
            header("Content-Type: " . Utils::mime($URL_info["extension"]));
            if ($URL_info["extension"] == "psj")
                header("Content-Encoding: gzip");
            ob_clean();
            flush();
            //et the scheme: not safe it it might not be transmitted by the client side
            $parsed_url = parse_url(filter_input(INPUT_SERVER, "HTTP_REFERER"));
            readfile($parsed_url["scheme"] . "://" . filter_input(INPUT_SERVER, "HTTP_HOST") . $URL, 0, $context);
            exit;
        }
    } else
        require_once ('index.php');
}
