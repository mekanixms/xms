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

//TODO termina pushTo
//0.2 pushTo
//VERSION  0.4
trait Overload
{

    protected $_XMS_DATA_ = array(
        "XMS_propertyChanged" => array(),
        "XMS_methodCalled" => array(
            "BEFORE" => array(),
            "AFTER" => array()
        )
    );

    /**
     * get the stack of object callbacks
     *
     * @param	array $from
     * @param	string $key - stack name
     * @return	array
     */
    protected function getCallbacks($from, $key)
    {
        if (is_array($from))
            if (array_key_exists($key, $from))
            //daca avem elemente in property changed pt proprietate
                if (is_array($from[$key]) && sizeof($from[$key]) > 0)
                    return $from[$key];
    }

    /**
     * pushes a value or pair key, value to an array type member of object's $_XMS_DATA_
     * $obj->pushTo("label","someVal")
     * $obj->pushTo("name","key","someVal")
     *
     * @param	string $name
     * @return	mixed
     */
    final public function pushTo()
    {
        switch (func_num_args()) {
            case 2 :
                $name = func_get_arg(0);
                $value = func_get_arg(1);
                if (!is_array($this->_XMS_DATA_[$name]))
                    $this->_XMS_DATA_[$name] = array();
                $this->_XMS_DATA_[$name][] = $value;
                break;
            case 3 :
                $name = func_get_arg(0);
                $key = func_get_arg(1);
                $value = func_get_arg(2);
                if (!is_array($this->_XMS_DATA_[$name]))
                    $this->_XMS_DATA_[$name] = array();
                $this->_XMS_DATA_[$name][$key] = $value;
                break;
            default :
                //TODO termina: $this->pushTo(label1,label2,label3,....,valoare,tipArraySauNu)
                if (func_num_args() > 2)
                    for ($index = 0; $index < func_num_args() - 1; $index++) {
                        if (!array_key_exists(func_get_arg($index), $this->_XMS_DATA_))
                            if ($index == func_num_args() - 2)
                                $this->_XMS_DATA_[func_get_arg($index)] = func_get_arg(func_num_args() - 1);
                            else
                                $this->_XMS_DATA_[func_get_arg($index)] = array();
                    }
                break;
        }
        return $this;
    }

    /**
     * sets a member of object's $_XMS_DATA_
     *
     * @param	string $name
     * @param	mixed $value
     * @return	void
     */
    final public function __set($name, $value)
    {
        $oldValue = FALSE;

        if (array_key_exists($name, $this->_XMS_DATA_))
        //if already set and we have a value
            $oldValue = $this->_XMS_DATA_[$name];
        //save it for later use

        if ($value instanceof Closure)
            //if we set an instance method
            $this->_XMS_DATA_[$name] = $value->bindTo($this, $this);
        else
            $this->_XMS_DATA_[$name] = $value;

        if (!$value instanceof Closure) {
            //if we set an instance property
            $cbks = $this->getCallbacks($this->_XMS_DATA_["XMS_propertyChanged"], $name);
            if (is_array($cbks) && sizeof($cbks) > 0)
                foreach ($cbks as $callback)
                //pt fiecare element
                    if (is_callable($callback))
                    //daca este callable
                        $callback($value, $oldValue);
            //execut cu noua si vechea valoare
        }
    }

    /**
     * gets a member of object's $_XMS_DATA_
     *
     * @param	string $name
     * @return	mixed
     */
    final public function __get($name)
    {
        if (array_key_exists($name, $this->_XMS_DATA_))
            return $this->_XMS_DATA_[$name];
    }

    /**
     * deletes a member of object's $_XMS_DATA_
     *
     * @param	string $name
     * @return	void
     */
    final public function __unset($name)
    {
        if (array_key_exists($name, $this->_XMS_DATA_))
            unset($this->_XMS_DATA_[$name]);
    }

    /**
     * calls a callable stack member
     *
     * @param	string $name
     * @param	mixed $arguments - callback arguments
     * @return	mixed
     */
    final public function __call($method, $arguments)
    {
        if (isset($this->_XMS_DATA_[$method]) && is_callable($this->_XMS_DATA_[$method])) {
            //only if method is defined
            $toRet = FALSE;
            //BEFORE
            $cbks = $this->getCallbacks($this->_XMS_DATA_["XMS_methodCalled"]["BEFORE"], $method);
            if (is_array($cbks) && sizeof($cbks) > 0)
                foreach ($cbks as $callback)
                //each callback
                    if (is_callable($callback)) {
                        //if callable callable only
                        if ($callback instanceof Closure)
                        //bind to this object if is a closure
                            $callback = $callback->bindTo($this, $this);

                        call_user_func_array($callback, $arguments);
                    }

            //CALL
            $toRet = call_user_func_array($this->_XMS_DATA_[$method], $arguments);

            //AFTER
            $cbks = $this->getCallbacks($this->_XMS_DATA_["XMS_methodCalled"]["AFTER"], $method);
            if (is_array($cbks) && sizeof($cbks) > 0)
                foreach ($cbks as $callback)
                //each callback
                    if (is_callable($callback)) {
                        //if callable callable only
                        if ($callback instanceof Closure)
                        //bind to this object if is a closure
                            $callback = $callback->bindTo($this, $this);

                        call_user_func_array($callback, $arguments);
                    }

            return $toRet;
        } else
            trigger_error(__METHOD__ . "\tCalling undefined method " . get_class($this) . "::$method() - No handlers defined\n", E_USER_WARNING);
    }

    /**
     * creates and adds to the stack a callback to be invoked when a
     * _XMS_DATA_
     * property is changed
     * OR
     * before/after callable method is executed
     *
     * Ex:
     * - Property
     * $this -> testProperty = "SOME VALUE";
     * $tp = $this -> bind("change", "testProperty", function() {//DO SOMETHING});
     *
     * - Method
     * $this -> testMethod = function($var) {//DO SOMETHING};
     * $this -> testMethod($argv1,$argv2,...)
     * $this -> bind("before", "testMethod", function($argv1,$argv2,...) {//DO SOMETHING BEFORE});
     * $tmb = $this -> bind("after", "testMethod", function($argv1,$argv2,...) {//DO SOMETHING BEFORE});
     *
     * Above $tmb can now be used with unbind or unbindAll to remove it from the stack
     * For all above Closures function(){} - $this is a reference to the object itself
     * All argumentspassed to $this -> testMethod when is invoked are passed to all before/after callbacks
     *
     * This works for any property or method created with __set / basically by overloading the object
     *
     * To work with builtin object methods do as follows:
     * $this->fakeAppendChild = function($c){$this -> appendChild($c);}
     * $this -> bind("before", "fakeAppendChild",....
     *
     * @param	string $name
     * @param	mixed $arguments - callback arguments
     * @return	callback
     */
    final public function bind($action, $targetKey, $callback)
    {
        //TODO adaug callback in array pt metoda sau proprietate
        if ($callback instanceof Closure)
            $callback = $callback->bindTo($this, $this);

        if ($action == "change") {
            //property
            $target = "XMS_propertyChanged";
            if (is_callable($callback))
                $this->_XMS_DATA_[$target][$targetKey][] = $callback;
        } else {
            //method
            $target = "XMS_methodCalled";
            if (is_callable($callback))
                $this->_XMS_DATA_[$target][strtoupper(trim($action))][$targetKey][] = $callback;
        }

        return $callback;
    }

    /**
     * removes a callback for change/before/after from stack
     *
     * Ex
     * $this -> unbind("before", "testMethod", $tmb);
     * $this -> unbind("change","testProperty",$tp);
     *
     * @param	string $name
     * @param	mixed $arguments - callback arguments
     * @return	mixed
     */
    final public function unbind($action, $targetKey, $callback)
    {
        if ($action == "change") {
            $target = "XMS_propertyChanged";
            foreach ($this->_XMS_DATA_[$target][$targetKey] as $k => $c)
                if ($c == $callback)
                    unset($this->_XMS_DATA_[$target][$targetKey][$k]);
        } else {
            $target = "XMS_methodCalled";
            foreach ($this->_XMS_DATA_[$target][strtoupper(trim($action))][$targetKey] as $k => $c)
                if ($c == $callback)
                    unset($this->_XMS_DATA_[$target][strtoupper(trim($action))][$targetKey][$k]);
        }
    }

    /**
     * removes all callbacks for change/before/after from stack
     *
     * Ex;
     * $this -> unbindAll("before", "testMethod");
     * $this -> unbindAll("change", "testProperty");
     *
     * @param	string $name
     * @param	mixed $arguments - callback arguments
     * @return	mixed
     */
    final public function unbindAll($action, $targetKey)
    {
        //TODO: test
        if ($action == "change") {
            $target = "XMS_propertyChanged";
            foreach ($this->_XMS_DATA_[$target][$targetKey] as $k => $c)
                unset($this->_XMS_DATA_[$target][$targetKey][$k]);
        } else {
            $target = "XMS_methodCalled";
            foreach ($this->_XMS_DATA_[$target][strtoupper(trim($action))][$targetKey] as $k => $c)
                unset($this->_XMS_DATA_[$target][strtoupper(trim($action))][$targetKey][$k]);
        }
    }
}

?>