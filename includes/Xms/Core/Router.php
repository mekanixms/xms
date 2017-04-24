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
 * Xms simple Router
 */
class Router extends XmsXml
{

    const VERSION = 0.2;
    const RELEASE_DATE = "2015-04-24";

    //holds the reference of the lambda function of the user defined router
    public $logic;

    public function __construct($source)
    {
        parent::__construct($source);
        $this->getLogic();
    }

    private function getLogic()
    {
        $this->q("/router/processing-instruction('aws')[1]")->to($routerLogic);
        $this->logic = create_function('$router,$route,$query,$accessControl', $routerLogic[0]->data);
    }

    private function getWorkingDirectory()
    {
        $toRet = pathinfo($_SERVER["SCRIPT_NAME"]);
        return $toRet['dirname'];
    }

    public function getPathInfo($route)
    {
        $toRet = explode("?", $route);
        if ($this->getWorkingDirectory() != '/')
            return trim(str_replace($this->getWorkingDirectory(), "", $toRet[0]), "/");
        else
            return trim($toRet[0], "/");
    }

    public function init($route, $accessObject)
    {
        $parsedRoute = parse_url($route);
        parse_str($parsedRoute["query"], $__get__);

        return call_user_func_array($this->logic, array($this, $route, $__get__, $accessObject));
    }

    public function stream($file)
    {
        
    }
}
