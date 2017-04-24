<?php namespace Xms\Core;

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
 * Class providing events support and observable methods and properties
 */
class SmartObject extends XmsOverload implements XmsEventHandler
{

    public $parentNode = null;
    public $childNodes = [];

    use EventHandlerPredefinedMethods;

    public function __construct()
    {
        
    }

    final public function getParentNode()
    {
        //required by XmsEventHandler
        //$this -> _parentNode is null and readonly; we need a writable property
        return $this->parentNode;
    }

    final public function getChildNodes()
    {
        //required by XmsEventHandler
        return $this->childNodes;
    }

    final public function hasChildNodes()
    {
        //required by XmsEventHandler
        return sizeof($this->childNodes);
    }
}
