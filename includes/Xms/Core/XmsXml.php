<?php namespace Xms\Core;

use ErrorException;
use DOMNode;
use DOMElement;
use DOMDocument;
use DOMXpath;

/*
 * XMS - Online Web Development
 *
 * Copyright (c) 2010 Cezar Lucan cezar.lucan@aws-dms.com
 * Licensed under GPL license.
 * http://www.aws-dms.com
 *
 * Date: 2010-10-24
 */

//0.4 using trait
//2015-04-04 ::construct to use instanceOf for to work with XmsXml and XmsDomElement

/*
 * Class to handle XML documents and providing events support and observable methods and properties
 */
class XmsXml extends Xml implements XmsEventHandler
{

    const VERSION = 0.4;
    const RELEASE_DATE = "2015-04-15";

    use EventHandlerPredefinedMethods;

    /**
     * constructor
     *
     * @param  mixed $context - should be a value to create a DOMDocument
     * @param  string $encoding - optional - default charset
     * @return XmsXml
     */
    public function __construct(&$context, $encoding = 'UTF-8')
    {

        $this->encoding = $encoding;

        $this->results = array();

        if (func_num_args() == 1) {
            if (gettype($context) == "string") {
                $this->doc = new XmsDomDocument("1.0", $this->encoding);
                $this->doc->registerNodeClass('DOMElement', 'Xms\Core\XmsDomElement');
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
            $this->doc = new XmsDomDocument("1.0", $this->encoding);
            $this->doc->registerNodeClass('DOMElement', 'Xms\Core\XmsDomElement');
            $this->doc->encoding = $this->encoding;
            $this->context = &$this->doc;
        }

        $this->xpath = new DOMXPath($this->doc);
        $this->doc->_parentNode = $this;
        $this->childNodes = array(&$this->doc);
        $this->firstChild = $this->childNodes[0];
        $this->lastChild = $this->childNodes[0];
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

    public function getParentNode()
    {
        //required by XmsEventHandler interface
        //not final to be able to redeclare it if extended
        //to transmit an event further _parentNode needs to point to another class implementing XmsEventHandler
        return $this->parentNode;
    }

    public function getChildNodes()
    {
        //required by XmsEventHandler interface
        //to transmit an event to childNodes this property needs to de defined and point to a class implementing XmsEventHandler
        return $this->childNodes;
    }

    public function hasChildNodes()
    {
        //required by XmsEventHandler interface
        return sizeof($this->childNodes);
    }
}
