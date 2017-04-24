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
//0.13-2013-06-05: removed downloadAlso option when saving
//0.13-2013-06-05: sends messages to Designer when the directory tree does not exists
//0.13-2013-06-05: opens files from CWD only
//0.12-2013-03-09: using DATA_IMPORT - loading the file in DOMXml and dump from it and transfer as xml, in order to prevent dump of php files
//0.11-2013-02-08: using libxml_use_internal_errors
//0.10-2013-02-03: changed to $_REQUEST for SAVE_FILE_FROM_POST / document to save from Designer saveCallback
//0.9: namespace fix when saving an xml file XSLT transformer

session_start();
include_once "defaults.php";
include_once "includes/awsxmsutils.php";

function is_in_cwd($param) {
	$fullpath = realpath($param);

	if (strpos($fullpath, getcwd()) === FALSE)
		return FALSE;
	else
		return TRUE;
}

//used in Designer saveCallback
switch ($_REQUEST["cat"]) {
	case 'SAVE_FILE_FROM_POST' :
		$response = "SAVED";
		if ($_SESSION["xmleditoradmin"] == AWS_DESIGNER_ADMIN) {
			//force file in CWD
			if(XMS_APPS_LOCKED_IN_CWD)
				//remove the cwd,../ and /
				$file = ltrim(str_replace(".." . DIRECTORY_SEPARATOR, "", str_replace(getcwd() . DIRECTORY_SEPARATOR, '', getcwd() . DIRECTORY_SEPARATOR . $_REQUEST["location"])), DIRECTORY_SEPARATOR);
			else 
				$file = $_REQUEST["location"];
			
			if (!is_dir(dirname($file)))
				$response = "Directory ".dirname($file)." not found.\nFILE NOT SAVED";
			else {
				$documentSource = file_get_contents('php://input');

				if (AWS_HTML_XSL_NAMESPACE_FIX && $_REQUEST["namespaceFix"] == "true") {
					$xmldoc = new DOMDocument("1.0");
					$xmldoc -> loadXML(file_get_contents('php://input'));
					$xsl = new DOMDocument;

					if ($_REQUEST["usethisstylesheet"])
						$xsl -> load($_REQUEST["usethisstylesheet"]);
					else
						$xsl -> load('xsl/namespacefix-xmldoc.xsl');

					$proc = new XSLTProcessor;
					$proc -> importStyleSheet($xsl);

					$documentSource = $proc -> transformToXML($xmldoc);
				}

				if (get_magic_quotes_gpc())
					file_put_contents($file, stripslashes($documentSource));
				else
					file_put_contents($file, $documentSource);
			}

			header('HTTP/1.1 200 OK');
			header('Content-Type: text/xml');
			echo "<response>" . $response . "</response>";

		}
		break;
}

switch ($_POST["cat"]) {
	case 'DATA_IMPORT' :
		if ($_SESSION["xmleditoradmin"] == AWS_DESIGNER_ADMIN) {
			if (function_exists("libxml_use_internal_errors"))
				libxml_use_internal_errors(true);

			header("Content-Type: text/xml;");
			$xmldoc = new DOMDocument("1.0");

			
			if(XMS_APPS_LOCKED_IN_CWD)
				//remove the cwd,../ and /
				$fileToOpen = ltrim(str_replace(".." . DIRECTORY_SEPARATOR, "", str_replace(getcwd() . DIRECTORY_SEPARATOR, '', getcwd() . DIRECTORY_SEPARATOR . $_POST["location"])), DIRECTORY_SEPARATOR);
			else 
				$fileToOpen = $_POST["location"];
			

			if (file_exists($fileToOpen))
				$xmldoc -> loadXML(file_get_contents($fileToOpen));
			else
				$xmldoc -> loadXML(file_get_contents("templates/FILE_OPEN_NOT_ALLOWED.xml"));

			if (function_exists("libxml_clear_errors"))
				libxml_clear_errors();

			echo $xmldoc -> C14N();
		}
		break;

	case 'HTML2AWS' :
		if ($_SESSION["xmleditoradmin"] == AWS_DESIGNER_ADMIN) {
			//disable libxml  error handling by php
			if (function_exists("libxml_use_internal_errors"))
				libxml_use_internal_errors(true);

			header("Content-Type: text/xml;");
			$xmldoc = new DOMDocument("1.0");
			$xmldoc -> loadHTML(file_get_contents($_POST["location"]));

			if (function_exists("libxml_clear_errors"))
				libxml_clear_errors();

			$xsl = new DOMDocument;
			$xsl -> load('xsl/html2aws.xsl');
			$proc = new XSLTProcessor;
			$proc -> importStyleSheet($xsl);

			echo $proc -> transformToXML($xmldoc);
		}
		break;

	case 'SAVE_FILE_FROM_POST' :
		$response = "SAVED";
		if ($_SESSION["xmleditoradmin"] == AWS_DESIGNER_ADMIN) {
			//force save in CWD if folders exist
			if(XMS_APPS_LOCKED_IN_CWD)
				//remove the cwd,../ and /
				$file = ltrim(str_replace(".." . DIRECTORY_SEPARATOR, "", str_replace(getcwd() . DIRECTORY_SEPARATOR, '', getcwd() . DIRECTORY_SEPARATOR . $_POST["location"])), DIRECTORY_SEPARATOR);
			else 
				$file = $_POST["location"];
			
			
			if (!is_dir(dirname($file)))
				$response = "Directory ".dirname($file)." not found.\nFILE NOT SAVED";
			else {
				$documentSource = file_get_contents('php://input');

				if (AWS_HTML_XSL_NAMESPACE_FIX && $_POST["namespaceFix"] == "true") {
					$xmldoc = new DOMDocument("1.0");
					$xmldoc -> loadXML(file_get_contents('php://input'));
					$xsl = new DOMDocument;

					if ($_POST["usethisstylesheet"])
						$xsl -> load($_POST["usethisstylesheet"]);
					else
						$xsl -> load('xsl/namespacefix-xmldoc.xsl');

					$proc = new XSLTProcessor;
					$proc -> importStyleSheet($xsl);

					$documentSource = $proc -> transformToXML($xmldoc);
				}

				if (get_magic_quotes_gpc())
					file_put_contents($file, stripslashes($documentSource));
				else
					file_put_contents($file, $documentSource);

			}

			header('HTTP/1.1 200 OK');
			header('Content-Type: text/xml');
			echo "<response>" . $response . "</response>";

		}
		break;
	case 'LOGIN' :
		header("Content-Type: text/xml;");

		if (!empty($_POST["user"]) && $_POST["user"] != "User name" && !empty($_POST["pass"])) {
			if (AWS_DESIGNER_ADMIN == $_POST["user"] && AWS_DESIGNER_PASSWORD == $_POST["pass"]) {
				echo "<response><login>allowed</login></response>";
				$_SESSION["xmleditoradmin"] = $_POST["user"];
			} else
				echo "<response><login>denied</login></response>";
		}
		break;

	case 'LOGOFF' :
		unset($_SESSION["xmleditoradmin"]);
		session_unset();
		session_regenerate_id(true);
		break;
}
