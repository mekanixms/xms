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

//0.7 propagate : using while instead of foreach

/*
 * Defines the DOMEvent in Xms
 */
class XmsDomEvent extends XmsEvent implements XmsEventSupport
{

    const VERSION = 0.8;

    function propagate()
    {
        if (!$this->stopPropagation)
            switch ($this->propagate) {
                case XmsDomEvent::BUBBLE_CHILDS :
                    if ($this->currentTarget->hasChildNodes()) {
                        $child = $this->currentTarget->firstChild;
                        while ($child) {
                            if ($child instanceof XmsEventHandler) {
                                $this($child, $this->data, XmsDomEvent::BUBBLE_CHILDS);
                            }
                            $child = $child->nextSibling;
                        }
                    }
                    break;

                case XmsDomEvent::BUBBLE_CANCEL :
                    //NOTHING TO DO FURTHER - STOPS HERE
                    break;

                case XmsDomEvent::BUBBLE_DEFAULT :
                case XmsDomEvent::BUBBLE_PARENT :
                    if ($this->currentTarget->getParentNode() instanceof XmsEventHandler) {
                        $DDEPN = $this->currentTarget->getParentNode();
                        $this($DDEPN, $this->data, XmsDomEvent::BUBBLE_PARENT);
                    }
                    break;
            }
    }
}
