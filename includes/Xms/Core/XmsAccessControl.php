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
 * Application access control in Xms
 */
class XmsAccessControl extends XmsXml
{

    const VERSION = 0.2;
    const RELEASE_DATE = "2015-04-24";

    public $logic;

    public function __construct($source)
    {
        parent::__construct($source);
        $this->getLogic();
    }

    private function getLogic()
    {
        $this->q("/access/processing-instruction('aws')[1]")->to($logic);
        $this->logic = create_function('$access,$app,$user', $logic[0]->data);
    }

    public function hasAccess($app)
    {
        return call_user_func_array($this->logic, array(&$this, $app, constant('XMS_USER_ACCESS_VAR')));
    }
}
