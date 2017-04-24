<?php namespace Xms\Core;

use DOMElement;

/*
 * XMS - Online Web Development
 *
 * Copyright (c) 2010 Cezar Lucan cezar.lucan@aws-dms.com
 * Licensed under GPL license.
 * http://www.aws-dms.com
 *
 * Date: 2010-10-24
 */

//0.7 ::hasClass,::addClass,::removeClass
//0.6 traits
//0.3 ::detachAllEventHandlers(), ::detachEventHandler()
//0.3 implements XmsEventHandler
//0.3 using XmsDomEvent instead of XmsEvent

/*
 * Provide additional functionality to native class
 */
class XmsDomElement extends DOMElement implements XmsEventHandler
{

    const VERSION = 0.7;

    use Overload;

use EventHandlerPredefinedMethods;

    /**
     * get the parent node; required by event implementation
     *
     * @return	mixed parent node
     */
    final public function getParentNode()
    {
        return $this->parentNode;
    }

    /**
     * get the child nodes; required by event implementation
     *
     * @return	DOMNodeList
     */
    final public function getChildNodes()
    {
        return $this->childNodes;
    }

    /**
     * check if the XmsDomElement has a class or not
     *
     * @param	string $c class name
     * @return	bool
     */
    final public function hasClass($c)
    {
        if ($this->hasAttribute("class")) {
            $classes = preg_split("/[\s,]+/", $this->getAttribute("class"));
            if (in_array($c, array_values($classes)))
                return TRUE;
            else
                return FALSE;
        } else
            return FALSE;
    }

    /**
     * adds a class
     *
     * @param	string $c class name
     * @param	string $glue class separator - optional
     * @return	void
     */
    final public function addClass($c, $glue = " ")
    {
        if ($this->hasAttribute("class"))
            $attrVals = preg_split("/[\s,]+/", $this->getAttribute("class"));
        else
            $attrVals = [];

        if (!in_array($c, $attrVals)) {
            $attrVals[] = $c;
            $this->setAttribute("class", implode($glue, $attrVals));
        }
    }

    /**
     * removes a class
     *
     * @param	string $class class name
     * @param	string $glue class separator - optional
     * @return	void
     */
    final public function removeClass($class, $glue = " ")
    {
        $cs = array();
        if ($this->hasAttribute("class")) {
            $attrVals = preg_split("/[\s,]+/", $this->getAttribute("class"));

            foreach ($attrVals as $c)
                if ($class != $c)
                    $cs[] = $c;
            $this->setAttribute("class", implode($glue, $cs));
        }
    }
}
