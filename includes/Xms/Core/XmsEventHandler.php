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

//use trait EventHandlerPredefinedMethods
interface XmsEventHandler
{

    //MEMBER VARS TO DEFINE if not already defined
    //$parentNode;
    //$childNodes = array();
    //$firstChild;
    //$lastChild;

    public function topmost();

    public function respondsToEvent($type);

    public function getEventCallback($type);

    public function getEventCallbacks_on($where, $evttype);

    public function hasChildNodes();

    public function getParentNode();

    public function getChildNodes();
    /* TODO
      public function hasChild();

      public function addChild();

      public function removeChild();
     */
}
