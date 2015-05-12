<?php namespace Xms\Core;

use DOMNode;
use DOMDocumentFragment;

/*
 * XMS - Online Web Development
 *
 * Copyright (c) 2010 Cezar Lucan cezar.lucan@aws-dms.com
 * Licensed under GPL license.
 * http://www.aws-dms.com
 *
 * Date: 2010-10-24
 */

/* TODO
 * tot ce este cu _create_function functii interne (de aici) si se poate schimba cu closure
 * */

//0.3: 2015-04-04 - minor change
//0.3: 2015-03-29 - removed $this-data as parameter to all lambda functions in order tp send user data towards the directives/filters/parsers
//0.2: 2015-01-30 - import and advancedImport - fixed for when the documentFragment is empty
//0.1: 2013-08-26 - add $this-data as parameter to all lambda functions in order tp send user data towards the directives/filters/parsers
trait XmsHelpers
{

    public function loadRemoteTemplate(&$el)
    {
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

        //doar in cazul in care se da xpath facem modificarile
        if ($el->hasAttribute("source")) {
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
                $sursaDefaultImport = file_get_contents($el->getAttribute("source"));

            if ($el->hasAttribute("importasxml"))
                $documentFrom = new Xml($sursaDefaultImport);
            else
                $documentFrom = new Html($sursaDefaultImport);
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
                            case "finally" :
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
                    $DTS = $documentFrom->content("xsl/html2aws.xsl");
                    $documentTo = new Xml($DTS);

                    if ($el->hasAttribute("xpath") && function_exists($withResults))
                        $documentTo->q($el->getAttribute("xpath"))->each($withResults);

                    $el->parentNode->replaceChild($el->ownerDocument->importNode($documentTo->doc->documentElement, TRUE), $el);
                } else {
                    //in acest caz inlocuiesc element(import aici) cu nimic :D
                    $docFragment = $el->ownerDocument->createDocumentFragment();
                    //adaugam sursa nodului la fragment
                    $docFragment->appendXML(" ");

                    //inlocuim elementul import cu fragmentul generat
                    $el->parentNode->replaceChild($docFragment, $el);
                }
            } else {
                $DTS = $documentFrom->content("xsl/html2aws.xsl");
                $documentTo = new Xml($DTS);

                if ($el->hasAttribute("xpath") && function_exists($withResults))
                    $documentTo->q($el->getAttribute("xpath"))->each($withResults);

                $el->parentNode->replaceChild($el->ownerDocument->importNode($documentTo->doc->documentElement, TRUE), $el);
            }
        }
    }

    public function doFilterImport(&$el)
    {
        $hasCheck = false;

        if ($el->hasAttribute("mode"))
            $mode = trim($el->getAttribute("mode"));
        else
            $mode = "append";
        //$mode one of append,prepend,before,after,replace

        $parser = new Xml($el);

        //daca nu avem sursa  folosim drept sursa default template-ul
        if ($el->hasAttribute("source")) {
            $importFilterDocumentFromContent = file_get_contents($el->getAttribute("source"));
            $documentFrom = new Xml($importFilterDocumentFromContent);
        }

        //doar in cazul in care se da xpath facem modificarile
        if ($el->hasAttribute("xpath")) {
            $xpath = $el->getAttribute("xpath");

            //creez fragmentul de document in HTML-ul nostru
            $docFragment = $el->ownerDocument->createDocumentFragment();

            $documentFrom->q($xpath);

            foreach ($documentFrom->results as $result) {
                $newnode = $el->ownerDocument->importNode($result, TRUE);
                $docFragment->appendChild($newnode);
            }

            if ($el->hasChildNodes())
                foreach ($el->childNodes as $cn)
                    if ($cn->nodeType == 1)
                        switch ($cn->localName) {
                            case "check" :
                                if ($cn->hasChildNodes())
                                    foreach ($cn->childNodes as $child)
                                        if ($child->nodeType == 7)
                                            $functionText = $child->data;

                                $toRun = Xms::_create_function($el, '$doc,$el', $functionText);
                                $checkedFunctionReturnValue = $toRun($documentFrom, $el);

                                $hasCheck = true;
                                break;
                        }

            if (!$hasCheck || $hasCheck && $checkedFunctionReturnValue) {
                //inlocuim elementul import cu fragmentul generat
                if ($el->hasAttribute("where")) {
                    //daca avem @where

                    $parser($el->getAttribute("where"))->to($target);
                    //get targets if any, from query @where

                    if (sizeof($target) == 0) {
                        //if no existing targets, create the sequence from @where
                        $target = [Utils::createElementsSequence($el->getAttribute("where"), $parser("/app")->get(0))];
                    }
                }

                if (is_array($target) && sizeof($target) > 0) {
                    //if we have targets defined from @where
                    foreach ($target as $t) {
                        //replace each with a clone
                        //using $mode one of: append,prepend,before,after,replace
                        switch ($mode) {
                            case "append":
                                $t->appendChild($docFragment->cloneNode(true), $t);
                                break;
                            case "prepend":
                                $t->insertBefore($docFragment->cloneNode(true), $t->firstChild);
                                break;
                            case "before":
                                $t->parentNode->insertBefore($docFragment->cloneNode(true), $t);
                                break;
                            case "after":
                                $t->parentNode->insertBefore($docFragment->cloneNode(true), $t->nextSibling);
                                break;
                            case "replace":
                                $t->parentNode->replaceChild($docFragment->cloneNode(true), $t);
                                break;
                        }
                    }

                    $el->parentNode->removeChild($el);
                    //and delete use directive
                } else {
                    //no targets so replace the directive with df
                    //@mode doesn't have any effect
                    $el->parentNode->replaceChild($docFragment, $el);
                }
            }
        }
    }

    public function appInitDirective(&$el)
    {
        $functionText = "";
        $toReturnVarName = "";

        if ($el->hasChildNodes())
            foreach ($el->childNodes as $child) {
                if ($child->nodeType == 7)
                    $functionText = $child->data;
                else if ($child->nodeType == 1)
                    switch (strtolower($child->localName)) {
                        case "return" :
                            $toReturnVarName = $child->textContent;
                            break;
                    }
            }

        $toRun = Xms::_create_function($el, '&$el', $functionText);

        if ($toReturnVarName)
            $GLOBALS["APPINIT"][$toReturnVarName] = $toRun($el);
        else
            $toRun($el);

        //$el -> parentNode -> removeChild($el);
        //??STERG? nu e in client!
    }

    public function getAppName(&$el)
    {
        if (!empty($el->textContent))
            $this->name = trim($el->textContent);
        else
            $this->name = "unknown";
    }

    public function createClient(&$el)
    {
        $this->CLIENT->doc->replaceChild($this->CLIENT->doc->importNode($el, TRUE), $this->CLIENT->doc->documentElement);
    }

    function execDirectiveFromFilter(&$el)
    {
        if ($el->parentNode->hasChildNodes())
            foreach ($el->parentNode->childNodes as $child)
                if ($child->nodeType == 3)
                    $queryText = $child->nodeValue;

        $this->CLIENT->q($queryText);

        foreach ($this->CLIENT->results as $result)
            switch (strtolower($el->localName)) {
                case "import" :
                    $d = new Directive($el, $result);
                    $d();
                    if ($d->result instanceof DOMDocumentFragment)
                        $result->parentNode->replaceChild($d->result, $result);
                    else
                        $result->parentNode->removeChild($result);
                    break;
            }
    }

    //executa functia pentru cu parametru fiecare  element in parte
    //accesul la parametru se face: $el = func_get_arg(0); sau $el
    function processXpath(&$el)
    {
        $functionText = "";
        $queryText = "";

        if ($el->hasChildNodes())
            foreach ($el->childNodes as $child)
                if ($child->nodeType == 3)
                    $queryText = $child->nodeValue;

        if ($el->parentNode->hasChildNodes())
            foreach ($el->parentNode->childNodes as $child)
                if ($child->nodeType == 7)
                    $functionText = $child->data;

        $this->CLIENT->q($queryText)->each(Xms::_create_function($el, '&$el', $functionText));
    }

    // array(0=> array(eticheta=>valoare, ....), 1=>=> array(eticheta=>valoare, ....),...)
    function processDomIterator(&$el)
    {
        $elementXPATH = "";
        $unit = "";
        $functionText = "";
        $translator = "";
        $eachnamedreference = FALSE;
        $checkedFunctionReturnValue = TRUE;

        if ($el->hasChildNodes())
            foreach ($el->childNodes as $child) {
                if ($child->nodeType == 3)
                    $elementXPATH = $child->nodeValue;

                if ($child->localName == "check") {
                    if ($child->hasChildNodes())
                        foreach ($child->childNodes as $cn)
                            if ($cn->nodeType == 7)
                                $functionText = $cn->data;

                    $toRun = Xms::_create_function($el, '$doc,$el', $functionText);
                    $checkedFunctionReturnValue = $toRun($documentFrom, $el);
                }

                if ($child->localName == "eachreference")
                    foreach ($child->childNodes as $cne)
                        if ($cne->nodeType == 7)
                            $foreachreferenceFunction = Xms::_create_function($child, '&$el,$label,$value,$recordset', $cne->data);

                if ($child->localName == "eachnamedreference")
                    $eachnamedreference = $child;

                if ($child->localName == "norecords")
                    foreach ($child->childNodes as $cnn)
                        if ($cnn->nodeType == 7) {
                            $noRecordsFunctionText = $cnn->data;

                            $toRun = Xms::_create_function($child, '&$doc', $noRecordsFunctionText);

                            $noRecords = $this->CLIENT->doc->documentElement->ownerDocument->createDocumentFragment();
                            //adaugam sursa nodului la fragment
                            $noRecordsResult = $toRun($this->CLIENT->doc);

                            if ($noRecordsResult instanceof DOMNode) {
                                if ($noRecordsResult->ownerDocument === $this->CLIENT->doc)
                                    $noRecords->appendChild($noRecordsResult);
                                else
                                    $noRecords->appendChild($this->CLIENT->doc->importNode($noRecordsResult, TRUE));
                            } else
                                $noRecords->appendXML($noRecordsResult);
                        }
            }

        //continutul functiei care trebuie sa returneze array pt strtr
        if ($el->parentNode->hasChildNodes())
            foreach ($el->parentNode->childNodes as $child)
                if ($child->nodeType == 7)
                    $functionText = $child->data;

        $runMe = Xms::_create_function($el->parentNode, '$el', $functionText);
        $translator = $runMe($el);

        //caut element din XPATH si il pun in var element
        $sursaQ4UDinDocument = $this->CLIENT->q($elementXPATH)->get(0);

        if ($sursaQ4UDinDocument && $checkedFunctionReturnValue) {
            $q4u = new Html($sursaQ4UDinDocument);
            $q4u->q("descendant-or-self::*[@unit]")->to($unit);

            if (sizeof($translator) > 0)
                foreach ($translator as $pattern) {
                    $df = $unit[0]->ownerDocument->createDocumentFragment();
                    $df->appendXML($unit[0]->C14N());
                    $unitClone = $df->firstChild;

                    $unitClone->removeAttribute("unit");
                    $unitClone->setAttribute("clone", "TRUE");
                    $unit[0]->parentNode->insertBefore($unitClone, $unit[0]);

                    $unitQ = new Html($unitClone);

                    foreach ($pattern as $k => $v) {
                        $checkReplaceContent = Xms::_create_function($el, '&$el', 'if($el->hasAttribute("skip")) return false; else return true;');
                        $checkAppend = Xms::_create_function($el, '&$el', 'if($el->hasAttribute("modtype") && $el->getAttribute("modtype")=="append") return true; else return false;');
                        $checkPrepend = Xms::_create_function($el, '&$el', 'if($el->hasAttribute("modtype") && $el->getAttribute("modtype")=="prepend") return true; else return false;');

                        if (!function_exists($foreachreferenceFunction))
                            $unitQ->q('descendant-or-self::*[@reference="' . $k . '"]')->check($checkReplaceContent)->replaceContent($v)->check($checkAppend)->append($v)->check($checkPrepend)->prepend($v);
                        else
                            $unitQ->q('descendant-or-self::*[@reference="' . $k . '"]')->check($checkReplaceContent)->replaceContent($v)->check($checkAppend)->append($v)->check($checkPrepend)->prepend($v)->each($foreachreferenceFunction, $k, $v, $pattern);
                    }

                    foreach ($pattern as $k => $v) {
                        //$eachnamedreference
                        if ($eachnamedreference)
                            foreach ($eachnamedreference->childNodes as $namedreferencenode)
                                if ($namedreferencenode->localName == $k)
                                    foreach ($namedreferencenode->childNodes as $nrt)
                                        if ($nrt->nodeType == 7) {
                                            $namedReferenceFunction = Xms::_create_function($namedreferencenode, '&$el,$label,$value,$recordset', $nrt->data);
                                            $unitQ->q('descendant-or-self::*[@reference="' . $k . '"]')->each($namedReferenceFunction, $k, $v, $pattern);
                                        }
                    }
                } else if ($noRecords instanceof DOMNode)
                $unit[0]->parentNode->insertBefore($noRecords, $unit[0]);

            $q4u->q('descendant::*[@clone="TRUE"]')->removeAttr("clone");

            //unit remove
            $unit[0]->parentNode->removeChild($unit[0]);
        }
    }

    function langSysMessages(&$el)
    {
        if ($el->nodeType == 1) {
            $targetName = '//*[@id="' . $el->getAttribute("id") . '"]';
            //element folosit pentru selectarea copiilor dupa xpath dat in acest atribut; poate fi folosit pentru intreg tree-ul cu xpath
            $childPath = "";
            if ($el->hasAttribute("target"))
                $targetName = $el->getAttribute("target");

            $source = "";
            foreach ($el->childNodes as $child)
                $source .= $child->C14N();

            $this->CLIENT->q($targetName)->replaceContent($source);
        }
    }

    function getParser(&$el)
    {
        $tmpFilter = array();

        foreach ($el->childNodes as $child)
            if ($child->nodeType == 1)
                switch (strtolower($child->localName)) {
                    case "alias" :
                        foreach ($child->childNodes as $textNode)
                            if ($textNode->nodeType == 3)
                                $tmpFilter[strtolower($child->localName)] = $textNode->textContent;
                        break;
                    case "check" :
                        foreach ($child->childNodes as $textNode)
                            if ($textNode->nodeType == 7) {
                                $tmpFilter[strtolower($child->localName)] = Xms::_create_function($child, '', $textNode->data);
                                $tmpFilter["checkData"] = $textNode->data;
                            }
                        break;
                    case "xpath" :
                        foreach ($child->childNodes as $textNode)
                            if ($textNode->nodeType == 3)
                                $tmpFilter[strtolower($child->localName)] = $textNode->textContent;
                        break;
                    case "callback" :
                        foreach ($child->childNodes as $textNode)
                            if ($textNode->nodeType == 7) {
                                $tmpFilter[strtolower($child->localName)] = Xms::_create_function($child, '&$el', $textNode->data);
                                $tmpFilter["callbackData"] = $textNode->data;
                            }
                        break;
                }

        $this->PARSERS[] = $tmpFilter;
    }
}
