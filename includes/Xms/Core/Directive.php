<?php namespace Xms\Core;

use DOMNode;

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
 * Class to create and handle Xms directives
 */

class Directive
{

    const VERSION = 0.4;
    const RELEASE_DATE = "2015-04-18";

    public $callback;
    public $result;
    private $parent;
    private $target;

    public function __construct(&$parent, &$target = FALSE)
    {
        $this->target = $target;
        if ($parent instanceof DOMNode) {
            $this->parent = $parent;
            $this->callback = call_user_func(self::getDirectiveHandler($parent));
        }
    }

    function __invoke()
    {
        $cbk = $this->callback;
        $this->result = $cbk($this->parent, $this->target);
        return $this->result;
    }

    static function getDirectiveHandler(&$el)
    {
        $toRet = false;

        if ($el->nodeType == XML_ELEMENT_NODE)
            $lookin = $el->topmost()->builtinDirectives[$el->nodeType];
        else
            $lookin = $el->parentNode->topmost()->builtinDirectives[$el->nodeType];

        if (is_array($lookin) && sizeof($lookin) > 0)
            foreach ($lookin as $cb => $props)
                foreach ($props as $pk => $pv) {
                    if (property_exists($el, $pk) && strtolower($el->{$pk}) == $pv)
                        $toRet = $cb;
                }

        return $toRet;
    }

    static function isDirective(&$el)
    {
        if (is_callable(self::getDirectiveHandler($el)))
            return TRUE;
        else
            return FALSE;
    }
}
