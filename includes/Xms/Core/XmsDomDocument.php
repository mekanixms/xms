<?php namespace Xms\Core;

use DOMDocument;

/*
 * XMS - Online Web Development
 *
 * Copyright (c) 2010 Cezar Lucan cezar.lucan@aws-dms.com
 * Licensed under GPL license.
 * http://www.aws-dms.com
 *
 * Date: 2010-10-24
 */

//0.4 traits
//0.3 ::detachAllEventHandlers(), ::detachEventHandler()
//0.3 implements XmsEventHandler
//0.3 using XmsDomEvent instead of XmsEvent

/*
 * Provide additional functionality to native class
 */
class XmsDomDocument extends DOMDocument implements XmsEventHandler
{

    const VERSION = 0.4;

    use Overload;

use EventHandlerPredefinedMethods;

    final public function getParentNode()
    {
        //$this -> _parentNode is null and readonly; we need a writable property
        return $this->_parentNode;
    }

    final public function getChildNodes()
    {
        return $this->childNodes;
    }
}

?>