<?php namespace Xms\Core;

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

/*
 * Provide additional functionality to native class
 */
class XmsDomDocumentFragment extends DOMDocumentFragment implements XmsEventHandler
{

    const VERSION = 0.1;

    use Overload;

use EventHandlerPredefinedMethods;

    final public function getParentNode()
    {
        return $this->parentNode;
    }

    final public function getChildNodes()
    {
        return $this->childNodes;
    }
}

?>