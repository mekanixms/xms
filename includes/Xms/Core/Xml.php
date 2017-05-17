<?php namespace Xms\Core;

use ErrorException;
use DOMNode;
use DOMElement;
use DOMDocument;
use XSLTProcessor;
use DOMXPath;

/*
 * XMS - Online Web Development
 *
 * Copyright (c) 2010 Cezar Lucan cezar.lucan@aws-dms.com
 * Licensed under GPL license.
 * http://www.aws-dms.com
 *
 * Date: 2010-10-24
 */

//0.14 ::construct to use instanceOf for to work with _HTML_ and XmsDomElement
//0.13 removed Zend css class
//0.8: namespace fix when saving (::content()) xml  file with XSLT transformer
//0.8: context set up after instance type; further queries made on this context if no other specified
//0.8: using gets the document from dom object , instead dumping and using the source; this way it will affect the existing object, without creating another document
//0.8: cssq and csse - css query and css evaluate; transformer provided by Zend_Dom_Query_Css2Xpath/ZendFramework-1.10.8

/*
 * Simple class to handle XML documents
 */
class Xml extends CommonXml implements XmlInterface
{

    const VERSION = 0.16;
    const RELEASE_DATE = "2015-04-04";

    public $encoding;

    public function __construct(&$context = null, $encoding = 'UTF-8')
    {

        $this->encoding = $encoding;

        $this->results = array();

        if (func_num_args() == 1) {
            if (gettype($context) == "string") {
                $this->doc = new DOMDocument("1.0", $this->encoding);
                $this->doc->encoding = $this->encoding;

                if (!$this->doc->loadXML($context))
                    throw new ErrorException("\nError loading document in " . get_class($this) . "\n");
                else
                    $this->context = &$this->doc;
            }

            if (gettype($context) == "object") {
                if ($context instanceOf DOMDocument) {
                    $this->doc = $context;
                    $this->context = &$this->doc;
                } else if ($context instanceOf DOMNode || $context instanceOf DOMElement) {
                    $this->doc = $context->ownerDocument;
                    $this->context = $context;
                } else if ($context instanceOf Xml) {
                    $this->doc = $context->doc;
                    $this->context = &$this->doc;
                }
            }
        } else {
            $this->doc = new DOMDocument("1.0", $this->encoding);
            $this->doc->encoding = $this->encoding;
            $this->context = &$this->doc;
        }

        $this->xpath = new DOMXPath($this->doc);
    }

    final public function content($xstyle = 'xsl/namespacefix-xmldoc.xsl')
    {
        if (AWS_HTML_XSL_NAMESPACE_FIX) {
            // Load the XML source
            $xml = $this->doc;

            $xsl = new DOMDocument("1.0", $this->encoding);
            $this->doc->encoding = $this->encoding;
            $xsl->load($xstyle);

            // Configure the transformer
            $proc = new XSLTProcessor;
            // attach the xsl rules
            $proc->importStyleSheet($xsl);

            return $proc->transformToXML($xml);
        } else
            return $this->doc->saveXML();
    }

    final public function contentAs($outputType)
    {
        if (!$outputType)
            $outputType = "xml";
        if (AWS_HTML_XSL_NAMESPACE_FIX) {
            // Load the XML source
            $xml = $this->doc;

            $xsl = new DOMDocument("1.0", $this->encoding);
            $this->doc->encoding = $this->encoding;
            $xsl->load('xsl/namespacefix-' . $outputType . 'doc.xsl');

            // Configure the transformer
            $proc = new XSLTProcessor;
            // attach the xsl rules
            $proc->importStyleSheet($xsl);

            return $proc->transformToXML($xml);
        } else
            return $this->doc->saveXML();
    }

    public function parentVersion()
    {
        return parent::VERSION;
    }

    public function __version__()
    {
        return array(
            __CLASS__ => self::VERSION,
            get_parent_class($this) => parent::VERSION
        );
    }
}
