<?php namespace Xms\Core;

use Closure;

/*
 * XMS - Online Web Development
 *
 * Copyright (c) 2010 Cezar Lucan cezar.lucan@aws-dms.com
 * Licensed under GPL license.
 * http://www.aws-dms.com
 *
 * Date: 2010-10-24
 */

//0.9 $GLOBALS["XMS_SERVER_CONSOLE"] now observable instance property Xms::XMS_SERVER_CONSOLE
//0.7 propagate : using while instead of foreach
//0.2 implements XMS_EVENT_CONSTANTS

/*
 * Provides an event implementation in Xms
 */
abstract class XmsEvent implements XmsEventSupport
{

    const VERSION = 0.9;

    public $type;
    protected $target;
    protected $currentTarget;
    public $data;
    public $propagate;
    protected $stopPropagation = FALSE;
    public $result;
    public $callbacks;

    /**
     * Create an instance
     *
     * @return void
     */
    public function __construct($type, &$target)
    {
        $this->type = $type;
        $this->target = $target;
        $this->currentTarget = $target;
    }

    /**
     * Execute the event handlers if any and propagate if needed
     *
     * @return void
     */
    public function __invoke(&$target, $data = array(), $bubble = Xms\Core\XmsEvent::BUBBLE_DEFAULT)
    {
        $this->data = $data;
        $this->propagate = $bubble;
        $this->result = "";

        if ($target !== $this->target)
        //no new target or diferent than the one evt created with
            $this->currentTarget = $target;

        if ($this->currentTarget->respondsToEvent($this->type)) {

            $this->callbacks = $this->currentTarget->getEventCallback($this->type);

            if (is_array($this->callbacks) && sizeof($this->callbacks) > 0)
                foreach ($this->callbacks as $callback)
                    if ($callback instanceof Closure) {
                        $callback = $callback->bindTo($this->currentTarget);

                        $this->runCallbacksFor($this->currentTarget->getEventCallbacks_on("BEFORE", $this->type));

                        $this->result = call_user_func_array($callback, array($this));

                        $this->runCallbacksFor($this->currentTarget->getEventCallbacks_on("AFTER", $this->type));
                    }
        }

        $this->currentTarget->topmost()->XMS_SERVER_CONSOLE = "\n\n\n\nEvent Type \t" . $this->type . "\nC Target\t" . (method_exists($this->currentTarget, "getNodePath") ? $this->currentTarget->getNodePath() : get_class($this->currentTarget)) . "\n" . "I Target\t" . (method_exists($this->target, "getNodePath") ? $this->target->getNodePath() : get_class($this->target)) . "\n" . "Propagate\t" . $bubble . "\n" . "DATA\n" . print_r($data, TRUE) . "\n\n\n\n";

        $this->propagate();
    }

    /**
     * run before/after callback for this event
     *
     * @return void
     */
    final protected function runCallbacksFor($a)
    {
        if (is_array($a) && sizeof($a) > 0)
            foreach ($a as $callback) {
                if ($callback instanceof Closure)
                    $callback = $callback->bindTo($this);
                //pt fiecare element
                if (is_callable($callback))
                //daca este callable
                    $callback($this);
                //call with @$this for compatibility with lambda functions
            }
    }

    /**
     * get initial target - the XmsDomElement that triggered the event in the first place
     *
     * @return XmsDomElement
     */
    final public function target()
    {
        return $this->target;
    }

    /**
     * get current target
     *
     * @return XmsDomElement
     */
    final public function currentTarget()
    {
        return $this->currentTarget;
    }

    /**
     * stop propagation
     *
     * @return void
     */
    final public function stopPropagation()
    {
        $this->stopPropagation = TRUE;
    }

    /**
     * Is propagation stopped?
     *
     * @return bool
     */
    final public function propagationIsStopped()
    {
        return $this->stopPropagation;
    }

    /**
     * propagate event
     *
     * @return void
     */
    function propagate()
    {
        if (!$this->stopPropagation)
            switch ($this->propagate) {
                case Xms\Core\XmsDomEvent::BUBBLE_CHILDS :
                    if ($this->currentTarget->hasChildNodes()) {
                        $child = $this->currentTarget->firstChild;
                        while ($child) {
                            if ($child instanceof Xms\Core\XmsEventHandler) {
                                $this($child, $this->data, Xms\Core\XmsDomEvent::BUBBLE_CHILDS);
                                //TODO varianta doi fac trigger pe $this->currentTarget
                                //$child -> trigger($this -> type, $this -> data, $this -> propagate);
                            }
                            $child = $child->nextSibling;
                        }
                    }
                    break;

                case Xms\Core\XmsEvent::BUBBLE_CANCEL :
                    //NOTHING TO DO FURTHER - STOPS HERE
                    break;

                case Xms\Core\XmsEvent::BUBBLE_DEFAULT :
                case Xms\Core\XmsEvent::BUBBLE_PARENT :
                    if ($this->currentTarget->getParentNode() instanceof Xms\Core\XmsEventHandler) {
                        $DDEPN = $this->currentTarget->getParentNode();
                        $this($DDEPN, $this->data, Xms\Core\XmsEvent::BUBBLE_PARENT);
                        //TODO varianta doi fac trigger pe $this->currentTarget
                        //$this -> currentTarget -> getParentNode() -> trigger($this -> type, $this -> data, $this -> propagate);
                    }
                    break;
            }
    }
}

?>