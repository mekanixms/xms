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

require 'includes/autoload.php';

//TESTING XSL PROCESSOR LOADED
if (!extension_loaded("xsl"))
	die("XSL Extension not loaded.<br/>Please install php xslt extension");

ini_set("display_errors", "Off");

ini_set("error_reporting", "E_ALL");

ini_set("magic_quotes_gpc", "Off");

ini_set('include_path', ini_get('include_path') . ':' . dirname($_SERVER['SCRIPT_FILENAME']) . PATH_SEPARATOR . "includes");

ini_set('default_charset', 'utf-8');

//thanks to Christian Roy
//http://christian.roy.name/blog/detecting-modrewrite-using-php
if (function_exists('apache_get_modules')) {
	$MOD_REWRITE = in_array('mod_rewrite', apache_get_modules());
} else {
	$MOD_REWRITE = getenv('HTTP_MOD_REWRITE') == 'On' ? TRUE : FALSE;
	$MOD_REWRITE = $_SERVER['HTTP_MOD_REWRITE'] == 'On' ? TRUE : FALSE;
}

define('MOD_REWRITE_ENABLED', $MOD_REWRITE);

//// 3.0
define('XMS_RESOURCE_ACCESS', 'access.xml');
define('XMS_RESOURCE_CONFIG', 'config.xml');
define('XMS_RESOURCE_ROUTER', 'router.xml');
define('XMS_RESOURCE_PARSERS', 'parsers.xml');
define('XMS_RESOURCE_LANG', 'lang.xml');

////

//APPLICATION
define('XMS_APPS_LOCKED_IN_CWD', TRUE);

define('AWS_HOME', "templates/index.xml");

define('AWS_DEFAULTS_LOADED', TRUE);

//DESIGNER's USER NAME AND PASSWORD
define('AWS_DESIGNER_ADMIN', "admin");

define('AWS_DESIGNER_PASSWORD', "admin");

//USER ACCESS
define('XMS_USER_ACCESS_VAR', $_SESSION['XMS_CURRENT_USER'] ? $_SESSION['XMS_CURRENT_USER'] : "guest");
define("AWS_USER_ACCESS_DISABLED", FALSE);

//DESIGNER THEME - FULL LIST IN CSS FOLDER
define('AWS_DESIGNER_THEME', "redmond");

define('AWS_HTML_XSL_NAMESPACE_FIX', TRUE);

//FOR MATCH AND MATCHITERATOR DIRECTIVES
define("AWS_ITERATOR_MATCH_PREFIX", '/\{-\{');

define("AWS_ITERATOR_MATCH_SUFFIX", '\}-\}/');

//CACHE FOLDER
//define('AWS_CACHE_LOCATION',	 		"cache".DIRECTORY_SEPARATOR.session_id());
define('AWS_CACHE_LOCATION', "cache");

//if apache_mod_rewrite, this holds the file where to record the streamed resources by urlhandler.php
define('AWS_STREAM_FILE', FALSE);

//////////////////
//ERROR HANDLING//
//////////////////

//403 FORBIDDEN APPLICATION
define('AWS_ERROR_403', "templates/403.xml");
//404 NOT FOUND ERROR APPLICATION
define('AWS_ERROR_404', "templates/404.xml");

//LOG LAMDA FUNCTIONS TO BE RECORDED - FOR TESTING ONLY, SLOWS DOWN THE APPLICATION
//IF ENABLED SEE THE FILES IN log FOLDER
define('AWS_DEBUG', FALSE);

define('AWS_DEBUG_USE_XMS_ERROR_HANDLERS', TRUE);

define('AWS_LOG_ROTATE_MAX_FILESIZE', 50000);

define('AWS_DEBUG_ERROR_HANDLERS_DROP_NOTICES', TRUE);

define('AWS_DEBUG_ERROR_HANDLERS_DROP_WARNINGS', FALSE);

if (AWS_DEBUG_USE_XMS_ERROR_HANDLERS) {
	set_error_handler('Utils::xmsCaptureErrors');
	set_exception_handler('Utils::xmsCaptureExceptions');
	register_shutdown_function('Utils::xmsCaptureShutdown');
}

//set to FALSE if you want Xms::appConfig to use
//Xms::TEMPLATE_FILE_SOURCE instead of Xms::name
define("AWS_APP_CONFIG_USE_APP_NAME", FALSE);

//SEO TOOLS
define("AWS_SEO_PARSERS_ENABLED", TRUE);

//THE STREAMS TO USE FOR LOGS
define('AWS_DEBUG_GLOBAL_FILENAME', "log" . DIRECTORY_SEPARATOR . ".GLOBAL.log");
define('AWS_DEBUG_FILENAME', "log" . DIRECTORY_SEPARATOR . ".".session_id() . ".log");
define('AWS_DEBUGGING_ERRORS_HANDLER', "log" . DIRECTORY_SEPARATOR . ".xmsErrors.log");
define('AWS_DEBUGGING_EXCEPTIONS_HANDLER', "log" . DIRECTORY_SEPARATOR . ".xmsExceptions.log");
define('AWS_DEBUGGING_SHUTDOWN_HANDLER', "log" . DIRECTORY_SEPARATOR . ".xmsShutdown.log");
?>
