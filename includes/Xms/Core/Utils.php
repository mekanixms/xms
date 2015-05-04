<?php namespace Xms\Core;

use DOMNode;
use DOMElement;
use DOMDocumentFragment;
use DOMProcessingInstruction;
use Closure;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * Utilities
 */
abstract class Utils
{

    public static $mime_types = array("323" => "text/h323",
        "acx" => "application/internet-property-stream",
        "ai" => "application/postscript",
        "aif" => "audio/x-aiff",
        "aifc" => "audio/x-aiff",
        "aiff" => "audio/x-aiff",
        "asf" => "video/x-ms-asf",
        "asr" => "video/x-ms-asf",
        "asx" => "video/x-ms-asf",
        "au" => "audio/basic",
        "avi" => "video/x-msvideo",
        "axs" => "application/olescript",
        "bas" => "text/plain",
        "bcpio" => "application/x-bcpio",
        "bin" => "application/octet-stream",
        "bmp" => "image/bmp",
        "c" => "text/plain",
        "cat" => "application/vnd.ms-pkiseccat",
        "cdf" => "application/x-cdf",
        "cer" => "application/x-x509-ca-cert",
        "class" => "application/octet-stream",
        "clp" => "application/x-msclip",
        "cmx" => "image/x-cmx",
        "cod" => "image/cis-cod",
        "cpio" => "application/x-cpio",
        "crd" => "application/x-mscardfile",
        "crl" => "application/pkix-crl",
        "crt" => "application/x-x509-ca-cert",
        "csh" => "application/x-csh",
        "css" => "text/css",
        "dcr" => "application/x-director",
        "der" => "application/x-x509-ca-cert",
        "dir" => "application/x-director",
        "dll" => "application/x-msdownload",
        "dms" => "application/octet-stream",
        "doc" => "application/msword",
        "dot" => "application/msword",
        "dvi" => "application/x-dvi",
        "dxr" => "application/x-director",
        "eps" => "application/postscript",
        "etx" => "text/x-setext",
        "evy" => "application/envoy",
        "exe" => "application/octet-stream",
        "fif" => "application/fractals",
        "flr" => "x-world/x-vrml",
        "gif" => "image/gif",
        "gtar" => "application/x-gtar",
        "gz" => "application/x-gzip",
        "h" => "text/plain",
        "hdf" => "application/x-hdf",
        "hlp" => "application/winhlp",
        "hqx" => "application/mac-binhex40",
        "hta" => "application/hta",
        "htc" => "text/x-component",
        "htm" => "text/html",
        "html" => "text/html",
        "htt" => "text/webviewhtml",
        "ico" => "image/x-icon",
        "ief" => "image/ief",
        "iii" => "application/x-iphone",
        "ins" => "application/x-internet-signup",
        "isp" => "application/x-internet-signup",
        "jfif" => "image/pipeg",
        "jpe" => "image/jpeg",
        "jpeg" => "image/jpeg",
        "jpg" => "image/jpeg",
        "js" => "application/x-javascript",
        "latex" => "application/x-latex",
        "lha" => "application/octet-stream",
        "lsf" => "video/x-la-asf",
        "lsx" => "video/x-la-asf",
        "lzh" => "application/octet-stream",
        "m13" => "application/x-msmediaview",
        "m14" => "application/x-msmediaview",
        "m3u" => "audio/x-mpegurl",
        "man" => "application/x-troff-man",
        "mdb" => "application/x-msaccess",
        "me" => "application/x-troff-me",
        "mht" => "message/rfc822",
        "mhtml" => "message/rfc822",
        "mid" => "audio/mid",
        "mny" => "application/x-msmoney",
        "mov" => "video/quicktime",
        "movie" => "video/x-sgi-movie",
        "mp2" => "video/mpeg",
        "mp3" => "audio/mpeg",
        "mpa" => "video/mpeg",
        "mpe" => "video/mpeg",
        "mpeg" => "video/mpeg",
        "mpg" => "video/mpeg",
        "mpp" => "application/vnd.ms-project",
        "mpv2" => "video/mpeg",
        "ms" => "application/x-troff-ms",
        "mvb" => "application/x-msmediaview",
        "nws" => "message/rfc822",
        "oda" => "application/oda",
        "p10" => "application/pkcs10",
        "p12" => "application/x-pkcs12",
        "p7b" => "application/x-pkcs7-certificates",
        "p7c" => "application/x-pkcs7-mime",
        "p7m" => "application/x-pkcs7-mime",
        "p7r" => "application/x-pkcs7-certreqresp",
        "p7s" => "application/x-pkcs7-signature",
        "pbm" => "image/x-portable-bitmap",
        "pdf" => "application/pdf",
        "pfx" => "application/x-pkcs12",
        "pgm" => "image/x-portable-graymap",
        "pko" => "application/ynd.ms-pkipko",
        "pma" => "application/x-perfmon",
        "pmc" => "application/x-perfmon",
        "pml" => "application/x-perfmon",
        "pmr" => "application/x-perfmon",
        "pmw" => "application/x-perfmon",
        "pnm" => "image/x-portable-anymap",
        "pot" => "application/vnd.ms-powerpoint",
        "ppm" => "image/x-portable-pixmap",
        "pps" => "application/vnd.ms-powerpoint",
        "ppt" => "application/vnd.ms-powerpoint",
        "prf" => "application/pics-rules",
        "ps" => "application/postscript",
        "psj" => "application/x-javascript",
        "pub" => "application/x-mspublisher",
        "qt" => "video/quicktime",
        "ra" => "audio/x-pn-realaudio",
        "ram" => "audio/x-pn-realaudio",
        "ras" => "image/x-cmu-raster",
        "rgb" => "image/x-rgb",
        "rmi" => "audio/mid",
        "roff" => "application/x-troff",
        "rtf" => "application/rtf",
        "rtx" => "text/richtext",
        "scd" => "application/x-msschedule",
        "sct" => "text/scriptlet",
        "setpay" => "application/set-payment-initiation",
        "setreg" => "application/set-registration-initiation",
        "sh" => "application/x-sh",
        "shar" => "application/x-shar",
        "sit" => "application/x-stuffit",
        "snd" => "audio/basic",
        "spc" => "application/x-pkcs7-certificates",
        "spl" => "application/futuresplash",
        "src" => "application/x-wais-source",
        "sst" => "application/vnd.ms-pkicertstore",
        "stl" => "application/vnd.ms-pkistl",
        "stm" => "text/html",
        "svg" => "image/svg+xml",
        "sv4cpio" => "application/x-sv4cpio",
        "sv4crc" => "application/x-sv4crc",
        "t" => "application/x-troff",
        "tar" => "application/x-tar",
        "tcl" => "application/x-tcl",
        "tex" => "application/x-tex",
        "texi" => "application/x-texinfo",
        "texinfo" => "application/x-texinfo",
        "tgz" => "application/x-compressed",
        "tif" => "image/tiff",
        "tiff" => "image/tiff",
        "tr" => "application/x-troff",
        "trm" => "application/x-msterminal",
        "tsv" => "text/tab-separated-values",
        "txt" => "text/plain",
        "uls" => "text/iuls",
        "ustar" => "application/x-ustar",
        "vcf" => "text/x-vcard",
        "vrml" => "x-world/x-vrml",
        "wav" => "audio/x-wav",
        "wcm" => "application/vnd.ms-works",
        "wdb" => "application/vnd.ms-works",
        "wks" => "application/vnd.ms-works",
        "wmf" => "application/x-msmetafile",
        "wps" => "application/vnd.ms-works",
        "wri" => "application/x-mswrite",
        "wrl" => "x-world/x-vrml",
        "wrz" => "x-world/x-vrml",
        "xaf" => "x-world/x-vrml",
        "xbm" => "image/x-xbitmap",
        "xla" => "application/vnd.ms-excel",
        "xlc" => "application/vnd.ms-excel",
        "xlm" => "application/vnd.ms-excel",
        "xls" => "application/vnd.ms-excel",
        "xlt" => "application/vnd.ms-excel",
        "xlw" => "application/vnd.ms-excel",
        "xof" => "x-world/x-vrml",
        "xpm" => "image/x-xpixmap",
        "xwd" => "image/x-xwindowdump",
        "z" => "application/x-compress",
        "zip" => "application/zip");

    static function mime($extension)
    {
        return self::$mime_types[$extension];
    }

    static function clientrun(&$el)
    {
        $closure = function(&$el) {
            $isDirective = Directive::isDirective($el);

            if ($isDirective) {
                $d = new Directive($el);
                $d();

                switch ($el->nodeType) {
                    case 1 :
                        $el->topmost()->trigger($el->localName, array($el->hasAttribute("id") ? $el->getAttribute("id") : $el->getNodePath()), XmsEvent::BUBBLE_CANCEL);
                        break;
                    case 7 :
                        $el->parentNode->topmost()->trigger($el->target, array($el->getNodePath()), XmsEvent::BUBBLE_CANCEL);
                        break;
                };

                if ($d->result instanceof DOMDocumentFragment) {
                    if ($d->result->hasChildNodes()) {
                        $current = $d->result->firstChild;
                        do {
                            $newNode = $el->parentNode->insertBefore($current->cloneNode(TRUE), $el->nextSibling);
                            self::clientrun($newNode);
                            $current = $current->nextSibling;
                        } while ($current instanceof DOMNode);
                    }
                }
                $next = $el->nextSibling;
                $el->parentNode->removeChild($el);
                return $next;
                //returnez nextSibling pt ca directiva face modificari si se sterge deci nu am avea continuitate
            } else {
                if ($el instanceof DOMElement)
                    if ($el->hasChildNodes()) {
                        $current = $el->firstChild;
                        do {
                            $next = self::clientrun($current);
                            $current = $next instanceof DOMNode ? $next : $current->nextSibling;
                        } while ($current instanceof DOMNode);
                    }
            }
        };

        return $closure($el);
    }

    static function directivePHP()
    {
        return function(&$el) {
            if ($el->nodeType == 7)
                $functionText = $el->data;

            $toRun = Xms::_create_function($el, '$el', $functionText);
            $result = $toRun($el->parentNode);

            $docFragment = $el->ownerDocument->createDocumentFragment();

            if ($result) {
                if ($result instanceOf DOMNode) {
                    if ($result->ownerDocument === $el->ownerDocument)
                        $docFragment->appendChild($result);
                    else
                        $docFragment->appendChild($el->ownerDocument->importNode($result, TRUE));
                } elseif (is_string($result))
                    $docFragment->appendXML($result);
            }
            return $docFragment;
        };
    }

    static function directiveJS()
    {
        return function(&$el) {
            $docFragment = $el->ownerDocument->createDocumentFragment();

            if ($el->nodeType == 7) {
                $jsTextNode = $el->ownerDocument->createTextNode($el->data);

                $script = $el->ownerDocument->createElement("script");

                $script->appendChild($jsTextNode);
                $docFragment->appendChild($script);
            }
            return $docFragment;
        };
    }

    static function directiveCASE()
    {
        return function(&$el) {
            $found = FALSE;

            $defaultNode = FALSE;

            $functionText = "";

            if (strtolower($el->localName) == "case" && $el->nodeType == 1) {
                if ($el->hasChildNodes())
                    foreach ($el->childNodes as $child)
                        if ($child->nodeType == 1 && $child->localName == "filter")
                            foreach ($child->childNodes as $filterChild)
                                if ($filterChild->nodeType == 7)
                                    $functionText = $filterChild->data;

                $toRun = Xms::_create_function($el, '&$el', $functionText);

                $selected = $toRun($el);

                if (!$selected)
                    $selected = "default";

                $docFragment = $el->ownerDocument->createDocumentFragment();

                if (is_string($selected))
                    if ($el->hasChildNodes())
                        foreach ($el->childNodes as $childToCheck) {
                            if ($childToCheck->nodeType == 1 && $childToCheck->localName === "default")
                                $defaultNode = $childToCheck;

                            if ($childToCheck->nodeType == 1 && $childToCheck->localName === trim($selected)) {
                                $found = TRUE;

                                foreach ($childToCheck->childNodes as $cn)
                                    $docFragment->appendChild($cn->cloneNode(TRUE));
                            }
                        }

                if (!$found && $defaultNode)
                    foreach ($defaultNode->childNodes as $dcn)
                        $docFragment->appendChild($dcn->cloneNode(TRUE));
            }
            return $docFragment;
        };
    }

    static function directiveIMPORT()
    {
        return function(&$el, &$target = FALSE) {
            if ($target instanceof DOMNode)
                $targetNodeInDoc = $target;
            else
                $targetNodeInDoc = $el;

            $p = new Xml($el);
            $p->q($el->getNodePath());
            $advancedImportSource = $p->children("source/processing-instruction('aws')[1]")->get(0);

            if ($el->hasChildNodes())
                foreach ($el->childNodes as $cn)
                    if ($cn->nodeType == 1)
                        switch ($cn->localName) {
                            case "runfirst" :
                                if ($cn->hasChildNodes())
                                    foreach ($cn->childNodes as $child)
                                        if ($child->nodeType == 7)
                                            $functionText = $child->data;

                                $toRun = Xms::_create_function($cn, '$el', $functionText);
                                $toRun($el);
                                break;
                        }
            //daca nu avem sursa  folosim drept sursa default template-ul
            if ($el->hasAttribute("source")) {
                //default source to get from import[@source]
                if ($el->hasAttribute("cache") && $el->getAttribute("cache") == "enabled") {
                    if (!is_dir(AWS_CACHE_LOCATION))
                        mkdir(AWS_CACHE_LOCATION, 0777, TRUE);

                    if ($el->hasAttribute("clearcache"))
                        if (file_exists(AWS_CACHE_LOCATION . DIRECTORY_SEPARATOR . $el->getAttribute("cachestorage")))
                            if ($el->getAttribute("clearcache") != "FALSE" && time() - filemtime(AWS_CACHE_LOCATION . DIRECTORY_SEPARATOR . $el->getAttribute("cachestorage")) >= $el->getAttribute("clearcache"))
                                unlink(AWS_CACHE_LOCATION . DIRECTORY_SEPARATOR . $el->getAttribute("cachestorage"));

                    if (!file_exists(AWS_CACHE_LOCATION . DIRECTORY_SEPARATOR . $el->getAttribute("cachestorage")))
                        file_put_contents(AWS_CACHE_LOCATION . DIRECTORY_SEPARATOR . $el->getAttribute("cachestorage"), file_get_contents($el->getAttribute("source")));

                    $sursaDefaultImport = file_get_contents(AWS_CACHE_LOCATION . DIRECTORY_SEPARATOR . $el->getAttribute("cachestorage"));
                } else
                    $sursaDefaultImport = file_get_contents(html_entity_decode($el->getAttribute("source")));

                if ($el->hasAttribute("importashtml"))
                    $documentFrom = new Html($sursaDefaultImport);
                else
                    $documentFrom = new Xml($sursaDefaultImport);
            } else if ($advancedImportSource instanceof DOMProcessingInstruction) {
                //if no default source check import/source/aws#pi
                $toRun = Xms::_create_function($advancedImportSource, '$el', $advancedImportSource->data);
                // and execute; also here importashtml can be set
                $sursaDefaultImport = $toRun($el);

                if ($el->hasAttribute("importashtml"))
                    $documentFrom = new Html($sursaDefaultImport);
                else
                    $documentFrom = new Xml($sursaDefaultImport);
            } else
            //otherwise just use the app itself as source
                $documentFrom = $el->topmost()->APP;


            if ($el->hasAttribute("xpath")) {
                //run import only if we have a target set
                $docFragment = $targetNodeInDoc->ownerDocument->createDocumentFragment();
                //we need to return a doc fragment so initializing it here
                $xpath = $el->getAttribute("xpath");

                /////////////////
                //import/filter//
                /////////////////
                if ($el->hasChildNodes())
                    foreach ($el->childNodes as $cn)
                        if ($cn->nodeType == 1)
                            switch ($cn->localName) {
                                case "filter" :
                                    if ($cn->hasChildNodes())
                                        foreach ($cn->childNodes as $child)
                                            if ($child->nodeType == 7)
                                                $functionText = $child->data;

                                    $toRun = Xms::_create_function($cn, '$doc,$el', $functionText);
                                    $toRun($documentFrom, $el);
                                    break;
                                case "check" :
                                    if ($cn->hasChildNodes())
                                        foreach ($cn->childNodes as $child)
                                            if ($child->nodeType == 7)
                                                $functionText = $child->data;

                                    $toRun = Xms::_create_function($cn, '$doc,$el', $functionText);
                                    $checkedFunctionReturnValue = $toRun($documentFrom, $el);

                                    $hasCheck = true;
                                    break;
                                case "eachnode" :
                                    if ($cn->hasChildNodes())
                                        foreach ($cn->childNodes as $child)
                                            if ($child->nodeType == 7)
                                                $functionText = $child->data;

                                    $withResults = Xms::_create_function($cn, '$el', $functionText);
                                    break;
                            }

                if ($hasCheck) {
                    //daca functia returneaza o alta valoare in afara de false

                    if ($checkedFunctionReturnValue) {
                        //execut acelasi cod ca atunci cand nu avem un check pe acest element
                        $documentFrom->q($xpath);

                        foreach ($documentFrom->results as $result) {
                            $newnode = $targetNodeInDoc->ownerDocument->importNode($result, TRUE);

                            if (function_exists($withResults)) {

                                $eachNode_withResults = $withResults($newnode);

                                if (is_bool($eachNode_withResults)) {
                                    if ($eachNode_withResults)
                                        $docFragment->appendChild($newnode);
                                } elseif ($eachNode_withResults instanceOf DOMNode) {
                                    if ($eachNode_withResults->ownerDocument === $targetNodeInDoc->ownerDocument)
                                        $docFragment->appendChild($eachNode_withResults);
                                    else
                                        $docFragment->appendChild($targetNodeInDoc->ownerDocument->importNode($eachNode_withResults, TRUE));
                                } elseif (isset($eachNode_withResults) && is_string($eachNode_withResults)) {
                                    $wrd_eachNode_withResults = $targetNodeInDoc->ownerDocument->createDocumentFragment();
                                    $wrd_eachNode_withResults->appendXML($eachNode_withResults);
                                    $docFragment->appendChild($wrd_eachNode_withResults);
                                }
                            } else
                                $docFragment->appendChild($newnode);
                        }
                    }
                } else {
                    //iau sursele nodului returnat de interogare
                    $interogationSource = "";

                    $res = "";
                    $documentFrom->q($xpath);

                    foreach ($documentFrom->results as $result) {
                        $newnode = $targetNodeInDoc->ownerDocument->importNode($result, TRUE);

                        if (function_exists($withResults)) {

                            $eachNode_withResults = $withResults($newnode);

                            if (is_bool($eachNode_withResults)) {
                                if ($eachNode_withResults)
                                    $docFragment->appendChild($newnode);
                            } elseif ($eachNode_withResults instanceOf DOMNode) {
                                if ($eachNode_withResults->ownerDocument === $targetNodeInDoc->ownerDocument)
                                    $docFragment->appendChild($eachNode_withResults);
                                else
                                    $docFragment->appendChild($targetNodeInDoc->ownerDocument->importNode($eachNode_withResults, TRUE));
                            } elseif (isset($eachNode_withResults) && is_string($eachNode_withResults)) {
                                $wrd_eachNode_withResults = $targetNodeInDoc->ownerDocument->createDocumentFragment();
                                $wrd_eachNode_withResults->appendXML($eachNode_withResults);
                                $docFragment->appendChild($wrd_eachNode_withResults);
                            }
                        } else
                            $docFragment->appendChild($newnode);
                    }
                }
                return $docFragment;
            }
        };
    }

    static function is_closure($callback)
    {
        $itis = FALSE;

        if (is_callable($callback, FALSE, $callback_name)) {

            switch (gettype($callback)) {
                case "object" :
                    if ($callback instanceof Closure)
                        $itis = TRUE;
                    break;
                case "array" :
                    if (sizeof($callback) == 2)
                        $toRet = FALSE;

                    if (gettype($callback[0]) == "object") {
                        if (!method_exists($callback[0], $callback[1]))
                            $toRet = TRUE;
                        if (property_exists($callback[0], $callback[1]) && is_callable($callback[0]->{$callback[1]}))
                            $toRet = TRUE;
                    }

                    $itis = $toRet;
                    break;
                case "string" :
                    if (function_exists($callback) && empty($callback_name))
//is Lambda not Closure
                        $itis = FALSE;
                    break;
            }
        }
        return $itis;
    }

    static function xmsLogRotate($fileName, $message, $maxSize)
    {
        if (!$maxSize)
            $maxSize = constant("AWS_LOG_ROTATE_MAX_FILESIZE");

        if (file_exists($fileName))
            if (filesize($fileName) >= $maxSize)
                rename($fileName, dirname($fileName) . DIRECTORY_SEPARATOR . "." . date("Y-m-d-H-i-s") . "-" . basename($fileName));

        file_put_contents($fileName, $message, FILE_APPEND);
    }

    static function FriendlyErrorType($type)
    {
        switch ($type) {
            case E_ERROR :
// 1 //
                return 'E_ERROR';
            case E_WARNING :
// 2 //
                return 'E_WARNING';
            case E_PARSE :
// 4 //
                return 'E_PARSE';
            case E_NOTICE :
// 8 //
                return 'E_NOTICE';
            case E_CORE_ERROR :
// 16 //
                return 'E_CORE_ERROR';
            case E_CORE_WARNING :
// 32 //
                return 'E_CORE_WARNING';
            case E_CORE_ERROR :
// 64 //
                return 'E_COMPILE_ERROR';
            case E_CORE_WARNING :
// 128 //
                return 'E_COMPILE_WARNING';
            case E_USER_ERROR :
// 256 //
                return 'E_USER_ERROR';
            case E_USER_WARNING :
// 512 //
                return 'E_USER_WARNING';
            case E_USER_NOTICE :
// 1024 //
                return 'E_USER_NOTICE';
            case E_STRICT :
// 2048 //
                return 'E_STRICT';
            case E_RECOVERABLE_ERROR :
// 4096 //
                return 'E_RECOVERABLE_ERROR';
            case E_DEPRECATED :
// 8192 //
                return 'E_DEPRECATED';
            case E_USER_DEPRECATED :
// 16384 //
                return 'E_USER_DEPRECATED';
        }
        return type;
    }

    static function xmsCaptureErrors($number, $message, $file, $line)
    {

        $error = array('type' => $number . "::" . self::FriendlyErrorType($number), 'message' => $message, 'file' => $file, 'line' => $line);

        $drop = false;

        if (constant("AWS_DEBUG_ERROR_HANDLERS_DROP_NOTICES") && $number == E_NOTICE)
            $drop = true;

        if (constant("AWS_DEBUG_ERROR_HANDLERS_DROP_WARNINGS") && $number == E_WARNING)
            $drop = true;

        if (!$drop)
            self::xmsLogRotate(constant("AWS_DEBUGGING_ERRORS_HANDLER"), str_replace("Array", date("Y-m-d H:i:s"), print_r($error, TRUE)) . "\n");
    }

    static function xmsCaptureExceptions($exception)
    {
        self::xmsLogRotate(constant("AWS_DEBUGGING_EXCEPTIONS_HANDLER"), "In file " . basename($exception->getFile()) . " @Line#" . $exception->getLine() . ": " . $exception->getMessage() . "\n");
    }

    static function xmsCaptureShutdown()
    {
        $isError = FALSE;
        if ($error = error_get_last()) {
            switch ($error['type']) {
                case E_ERROR :
                case E_CORE_ERROR :
                case E_COMPILE_ERROR :
                case E_USER_ERROR :
                    $isError = true;
                    break;
            }
        }

        if ($isError)
            self::xmsLogRotate(constant("AWS_DEBUGGING_EXCEPTIONS_HANDLER"), "Script execution halted: " . print_r($error, TRUE) . "\n");
        else
            return TRUE;
    }

    static function is_assoc_array($var)
    {
        return is_array($var) && array_diff_key($var, array_keys(array_keys($var)));
    }

//quote DB indentifiers to prevent sql injection
//See: http://www.php.net/manual/ro/pdo.quote.php#112169
    static function quoteIdent($field)
    {
        return "`" . str_replace("`", "``", $field) . "`";
    }
}
