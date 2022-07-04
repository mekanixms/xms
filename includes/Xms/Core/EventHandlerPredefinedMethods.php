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

trait EventHandlerPredefinedMethods
{

    /**
     * get the highest level parent node
     *
     * @return	XmsEventHandler
     */
    final public function topmost()
    {
        $top = $this;
        while ($top->getParentNode() instanceof XmsEventHandler)
            $top = $top->getParentNode();

        return $top;
    }

    /**
     * find first parent not DOMNode nor XmsDomDocument
     *
     * @return	XmsEventHandler
     */
    final public function closest()
    {
        $top = $this;
        while ($top->getParentNode() instanceof DOMNode)
            $top = $top->getParentNode();

        return $top->getParentNode();
    }

    /**
     * check if this object is having a callback associated with $type event
     *
     * @param	string $type
     * @return	bool
     */
    final public function respondsToEvent($type)
    {
        if (!array_key_exists("EVENTS_STACK", $this->_XMS_DATA_))
            $this->EVENTS_STACK = array();

        if (array_key_exists($type, $this->_XMS_DATA_["EVENTS_STACK"]))
            if (is_array($this->_XMS_DATA_["EVENTS_STACK"][$type]) && sizeof($this->_XMS_DATA_["EVENTS_STACK"][$type]) > 0)
                return TRUE;
            else
                return FALSE;
        else
            return FALSE;
    }

    /**
     * get the callback associated with an event
     *
     * @param	string $type
     * @return	callback
     * @return	void
     */
    final public function getEventCallback($type)
    {
        return $this->_XMS_DATA_["EVENT_CALLBACK"][$type];
    }

    /**
     * get an array of callback for BEFORE/after of an event
     *
     * @param	string $where
     * @param	string $evttype
     * @return	array
     * @return	void
     */
    final public function getEventCallbacks_on($where, $evttype)
    {
        return $this->_XMS_DATA_["EVENT_CALLBACK_ON"][$where][$evttype];
    }

    /**
     * triggers an event on this object
     * if this object doesn't have an $action type event, it creates one, with no callback
     * so that the event is bubbled accordong to $bubble type
     * Ex
     *    Default bubbling type child->parent
     * 1. $someXmsDomElement -> trigger("anEvent", array("USER DATA"));
     * 2. $someXmsDomElement -> trigger("anEvent", array("USER DATA"), XmsEvent::BUBBLE_PARENT);
     *
     *    No bubling at all, only triggers the event on current object
     * 3. $someXmsDomElement -> trigger("anEvent", array("USER DATA"), XmsEvent::BUBBLE_CANCEL);
     *
     *    Bubble all child elements - event is transmitted down to all childs elements till none left
     * 4. $someXmsDomElement -> trigger("anEvent", array("USER DATA"), XmsEvent::BUBBLE_CHILDS);
     *
     * @param	string	$action - event name
     * @param	array	$data - optional data to pass to the event callback when invoked
     * @return	integer	$bubble - bubbling type; default XmsDomEvent::BUBBLE_DEFAULT (same with XmsDomEvent::BUBBLE_PARENT)
     * @return	void
     */
    final public function trigger($action, $data = array(), $bubble = XmsDomEvent::BUBBLE_DEFAULT)
    {
        $HANDLERS = $this->_XMS_DATA_["EVENTS_STACK"][$action];
        //get an array of event handlers

        if (sizeof($HANDLERS) == 0)
        //if we dont have any handler defined we still have to send propagate
            $HANDLERS[] = new XmsDomEvent($action, $this);
        //so we create one event without callback

        foreach ($HANDLERS as $EVT)
            $EVT($this, $data, $bubble);

        return $EVT;
    }

    /**
     * creates an event type $action with an $callback associated with this object to execute when the event is triggered
     * OR
     * creates before/after callback to execute before or after event's callback
     * Ex:
     * $this -> on("someEvent", function($evt) {
     * 	//this is the object instance of XmsDomElement
     *  //$evt is the event instance of XmsDomEvent
     * });
     * $this -> on("before", "someEvent", function($evt) {
     * //$evt and $this instance of XmsDomEvent
     * });
     *
     * @param	string	$action - event name
     * @param	string	$chain - before or after
     * @param	mixed	$callback - either Closure or anonymous function to for the event to run; if is Closure is binded to the object so $this inside Closure is this object
     * @return	XmsDomEvent
     * @return	FALSE
     * @return	null
     */
    final public function on()
    {
        //below $action is event type
        switch (func_num_args()) {
            case 2 :
                $action = func_get_arg(0);
                $callback = func_get_arg(1);
                //on(event,$callback)
                if (is_callable($callback)) {
                    $this->_XMS_DATA_["EVENT_CALLBACK"][$action][] = $callback;
                    //pun callback in stack pt apel din evt
                    $nE = new XmsDomEvent($action, $this);
                    //creez evenimentul de tip action cu target acest XmsDomElement

                    $this->_XMS_DATA_["EVENTS_STACK"][$action][] = $nE;

                    return $nE;
                } else
                    return FALSE;
                break;
            case 3 :
                $chain = strtoupper(trim(func_get_arg(0)));
                $action = func_get_arg(1);
                $callback = func_get_arg(2);
                //on(before,event,callback)
                //on(after,event,callback)
                switch ($chain) {
                    case "BEFORE" :
                    case "AFTER" :
                        if (is_callable($callback))
                            $this->_XMS_DATA_["EVENT_CALLBACK_ON"][$chain][$action][] = $callback;
                        break;
                }
                break;
        }
    }

    /**
     * NOT IMPLEMENTED
     */
    final public function touch()
    {
        
    }

    /**
     * removes an event handler (callback) of this object
     *
     * @param	string $action - event type
     * @return	void
     */
    final public function detachEventHandler($action)
    {
        if (array_key_exists($action, $this->_XMS_DATA_["EVENT_CALLBACK"]))
            $this->_XMS_DATA_["EVENT_CALLBACK"][$action] = [];
    }

    /**
     * removes all event handlers (callbacks) of this object
     *
     * @return	void
     */
    final public function detachAllEventHandlers()
    {
        $this->_XMS_DATA_["EVENT_CALLBACK"] = array();
    }
}
