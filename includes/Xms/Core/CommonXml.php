<?php namespace Xms\Core;

use ErrorException;
use DOMNode;
use DOMNodeList;
use DOMElement;
use DOMDocument;
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

//0.47 ::append,::prepend,::replaceWith,::before,::after - removed support for ->check()
//0.46 $GLOBALS["XMS_SERVER_CONSOLE"] now observable instance property Xms::XMS_SERVER_CONSOLE
//0.45 ::has fixed to return array when $commit = false
//0.40 ::context moved here; ::setContext() and ::getContext()
//0.40 ::siblings
//0.37 ::elements(), __invoke direct call to return $obj->q()
//0.37: removed elements operations like ::bind(),.. from versions 0.34-36; use ::elements() instead
//0.36 ::detachAllEventHandlers(), ::detachEventHandler()
//0.35 ::trigger(),::on()
//0.34 ::bind(),::unbind(),::unbindAll() to support same XmsDomElement methods
//0.31 updated comments - minimal changes
//0.30 ::filter() , ::all(), ::find() to accept additional parameters to invoke the callback
//0.29 ::prop($name,$value) to change properties of DOMNodes; only works on pi() and text() like ::prop("data","SOME DATA")
//0.27 2015-03-14: properly commented
//0.24 2015-03-14: ::find($selector,$callback[,$optionalArg1,$optionalArg2,])
//0.20 2015-03-12: ::filter() , ::all() , ::add(), ::has(selector) and ::has(selector,commit), ::lastQuery
//0.20 2015-03-12: old version of ::filter() removed, ::each() simplified
//0.20 2015-02-28: ::addClass(), ::removeClass(), ::hasClass(), ::has()
//0.18 2015-02-27 ::remove(), ::cloneResults()
//0.16 2015-02-27 ::append(),::prepend(),::before(),::after(),::replace(),::replaceContent() argumente parsate cu  normalizeOperationsInput: EX: append(string) sau append(DOMNode) sau append(DOMNodeList) sau append(array(string,domNode,DOMNodeList,array))
//0.14 2015-02-26 ::each() - if callback is closure it passes first argument as $this of the callback
//0.14 2015-02-26 trows exception on ::q() and ::e() malformed xpath or context
//0.14 2015-02-25 extends XmsOverload
//0.13 2015-1-30: replaceContent fixed not append if document fragment is empty
//0.12 ::removeAttributes()
//0.12 removed copyElement()
//0.12 returns attr value of first item of results if only attr name specified
//0.12 removed cssq() and csse()
//0.11-2013-06-01: fixed call time pass by reference for append, prepend lambda functions
//0.10-2010-11-03: dirty output fixes
//0.9: ::filter(xpath) - query on a clone of $this;
//0.9: check , filter(function) - works, filter(xpath) - works
//0.8: ::each() - now support multiple arguments; these will be transmitted to the function; first arg will be always $el

/*
 * Abstract class providing extended xml functionality
 */
abstract class CommonXml extends XmsOverload
{

    const version = "0.46";
    const releaseDate = "2015-05-03";

    public $doc;
    public $results = array();
    public $xpath;
    public $lastQuery;
    protected $context;
    private $check;

    /**
     * executes  xpath query over the xml document
     *
     * @param	string $query
     * @param	DOMNode $context - optional - the context node if needed
     * @return	CommonXml
     */
    final public function q($query = ".", $context = FALSE)
    {
        $this->lastQuery = $query;

        if (!$context)
            $this->results = $this->normalizeOperationsInput($this->xpath->query($query, $this->context));
        else
            $this->results = $this->normalizeOperationsInput($this->xpath->query($query, $context));

        $this->topmost()->XMS_SERVER_CONSOLE = get_class($this) . "::" . __FUNCTION__ . " executing xpath query\t" . $query . "\n\t" . sizeof($this->results) . " results \n";

        if ($this->results === FALSE) {
            $this->results = array();
            throw new ErrorException("\n Expression is malformed or the contextnode is invalid in " . __FUNCTION__ . " of " . get_class($this) . "\n");
        }
        return $this;
    }

    /**
     * evaluates  xpath query over the xml document
     *
     * @param	string $query
     * @param	DOMNode $context - optional - the context node if needed
     * @return	CommonXml
     */
    final public function e($query = ".", $context = FALSE)
    {
        $this->lastQuery = $query;
        if (!$context)
            $this->results = $this->normalizeOperationsInput($this->xpath->evaluate($query, $this->context));
        else
            $this->results = $this->normalizeOperationsInput($this->xpath->evaluate($query, $context));

        $this->topmost()->XMS_SERVER_CONSOLE = get_class($this) . "::" . __FUNCTION__ . " executing xpath query\t" . $query . "\n\t" . sizeof($this->results) . " results \n";

        if ($this->results === FALSE) {
            $this->results = array();
            throw new ErrorException("\n Expression is malformed or the contextnode is invalid in " . __FUNCTION__ . " of " . get_class($this) . "\n");
        }
        return $this;
    }

    /**
     * if invoked directly after instance created, execute q method with given parameters
     *
     * @param	DOMNode $context
     * @return	CommonXml
     */
    function __invoke()
    {
        return call_user_func_array(array(
            $this,
            "q"
            ), func_get_args());
    }

    function __clone()
    {
        $this->results = array();
        $this->check = null;
        $this->context = null;
    }

    /**
     * sets the default query cotext
     *
     * @param	DOMNode $context
     * @return	CommonXml
     */
    final public function setContext(&$context)
    {
        $this->context = $context;
        return $this;
    }

    /**
     * retrieve the default query context
     *
     * @return	DOMNode
     */
    final public function getContext()
    {
        return $this->context;
    }

    /**
     * executes a callback for each result
     * if $callback is closure $this is the current DOMElement
     *
     * @param	callback $callback
     * @param	mixed optional $params - extra parameters to pass to the $callback
     * @return	CommonXml
     */
    final public function each($callback)
    {
        //TODO: schimb each cu while
        if (func_num_args() > 0) {
            $params = func_get_args();
            if (is_callable($callback)) {
                if (sizeof($this->results) > 0)
                    foreach ($this->results as $result) {
                        //& de mai jos e important altfel avem warning;
                        $params[0] = &$result;
                        $this->topmost()->XMS_SERVER_CONSOLE = get_class($this) . "::" . __FUNCTION__ . " executing callback " . ($params[0] instanceof DOMNode ? "on " . $params[0]->nodeName : "") . "\n";
                        //daca este closure
                        if (Utils::is_closure($callback)) {
                            //if($callback instanceof Closure)
                            //si este definit parametrul 0 (aka $el)
                            if (gettype($params[0]) == "object" && $params[0] instanceof DOMNode) {
                                //apeleaza funtia cu $this = $el
                                $callback = $callback->bindTo($params[0]);
                                $this->topmost()->XMS_SERVER_CONSOLE = get_class($this) . "::" . __FUNCTION__ . " binding callback to " . $params[0]->nodeName . "\n";
                            }
                        } else {
                            $this->topmost()->XMS_SERVER_CONSOLE = get_class($this) . "::" . __FUNCTION__ . " NOT a closure\n";
                        }

                        $fres = call_user_func_array($callback, $params);
                        if ($fres === FALSE)
                            $this->topmost()->XMS_SERVER_CONSOLE = get_class($this) . "::" . __FUNCTION__ . " was NOT ABLE TO EXECUTE given callback\n";
                    }
            } else {
                $this->topmost()->XMS_SERVER_CONSOLE = get_class($this) . "::" . __FUNCTION__ . " ERROR executing callback: NONE CALLABLE\n";
            }
        } else {
            $this->topmost()->XMS_SERVER_CONSOLE = get_class($this) . "::" . __FUNCTION__ . " NO callback supplied\n";
        }
        return $this;
    }

    /**
     * executes a callback with paramaters $this->results
     * if $callback is closure $this is the CommonXml object that filter methods belongs to
     *
     * @param	callback $callback
     * @param	mixed $param1,$param2,... additional parameters to invoke the callback with;
     * @return	CommonXml
     */
    final public function all($callback)
    {
        $params = func_get_args();
        if (is_callable($callback)) {
            if (Utils::is_closure($callback))
                $callback = $callback->bindTo($this);
            $params[0] = &$this->results;
            $checkForResults = call_user_func_array($callback, $params);

            if ($checkForResults === FALSE)
                $this->topmost()->XMS_SERVER_CONSOLE = get_class($this) . "::" . __FUNCTION__ . " callback could not be executed\n";
        }
        return $this;
    }

    /**
     * executes $toCheck callback before executing code in below methods; $toCheck needs to return TRUE for method to execute
     * used in methods like append, perpend, before, after, text, attr, removeAttr, replace, replaceContent, text, removeChilds
     *
     * @param	callback $toCheck
     * @return	CommonXml
     */
    final public function check($toCheck)
    {
        if (is_callable($toCheck))
            $this->check = $toCheck;
        else
            $this->check = FALSE;

        return $this;
    }

    /**
     * reduces results to the ones that pass the test of the $callback;
     * $callback returns TRUE to keep the element;
     * $callback can be either function, lambda or closure
     * $callback only argument is current result
     * if $callback is closure $this is the CommonXml object that filter methods belongs to
     *
     * @param	callback $callback ($el,$param1,$param2,....){$this is the DOMNode;$param1,$param2,... are the optional ones of ::filter;}
     * @param	mixed $param1,$param2,... additional parameters to invoke the callback with;
     * @return	CommonXml
     */
    final public function filter($callback)
    {
        $params = func_get_args();
        if (is_callable($callback)) {
            if (Utils::is_closure($callback))
                $callback = $callback->bindTo($this);
            $theyDo = [];
            foreach ($this->results as $result) {
                if ($result instanceof DOMNode) {
                    $params[0] = &$result;
                    $checkForResults = call_user_func_array($callback, $params);
                    if ($checkForResults === TRUE)
                        $theyDo[] = $result;
                    else {
                        $this->topmost()->XMS_SERVER_CONSOLE = get_class($this) . "::" . __FUNCTION__ . " either the callback could not be executed or the element did not passed the test\n";
                    }
                }
            }
            $this->results = $theyDo;
        }
        return $this;
    }

    /**
     * executes the given callback for all nodes given by selector in the context of each Xml::results
     * if callback is closure $this is the current DOMElement
     *
     * @param	string $selector
     * @param	callback $callback ($el,$context,$param1,$param2,....){$this is the DOMNode;$param1,$param2,... are the optional ones of ::find;}
     * @param	mixed $param1,$param2,... additional parameters to invoke the callback with;
     * @return	CommonXml
     */
    final public function find($selector, $callback)
    {
        $params = func_get_args();
        if ($selector && is_callable($callback)) {
            //only executes below if we have a $selector and a callable $callback
            $selector = trim($selector);
            //trim whitespace if any
            foreach ($this->results as $result) {
                //for each result
                if ($result instanceof DOMNode) {
                    //if is DOMNode
                    $checkForResults = $this->xpath->query($selector, $result);
                    //find nodes given by $selector in context $result
                    if ($checkForResults === FALSE)
                    //if query returns FALSE
                        throw new ErrorException("\n Expression is malformed or invalid context " . __FUNCTION__ . " of " . get_class($this) . "\n");
                    else if ($checkForResults instanceof DOMNodeList && $checkForResults->length > 0) {
                        //if we have nodes in context
                        $params[1] = &$result;
                        //second parameter of our callback is the contextNode we run the query to
                        $checkForResults = $this->normalizeOperationsInput($checkForResults);
                        foreach ($checkForResults as $subquery_result) {
                            //for each node in context
                            $params[0] = &$subquery_result;
                            if (Utils::is_closure($callback))
                                $callback = $callback->bindTo($subquery_result);
                            //if is closure bind it to the Xml
                            call_user_func_array($callback, $params);
                            //and execute the callback
                        }
                    }
                }
            }
        }
        return $this;
    }

    /**
     * filters the results with the ones having elements to match the given @$selector
     *
     * @param	string $selector
     * @param	bool $commit if TRUE - the results of the subquery replace the result used as context; if FALSE returns an array with nodes matching $selector
     * @return	CommonXml
     */
    final public function has($selector, $commit = FALSE)
    {
        if ($selector) {
            $selector = trim($selector);
            $theyDo = [];
            foreach ($this->results as $result) {
                if ($result instanceof DOMNode) {
                    $checkForResults = $this->xpath->query($selector, $result);

                    if ($checkForResults === FALSE)
                        throw new ErrorException("\n Expression is malformed or invalid context " . __FUNCTION__ . " of " . get_class($this) . "\n");
                    else if ($checkForResults instanceof DOMNodeList && $checkForResults->length > 0) {
                        if ($commit) {
                            foreach ($checkForResults as $subquery_result)
                                $theyDo[] = $subquery_result;
                        } else
                            $theyDo[] = $result;
                    }
                }
            }
        }
        if ($commit) {
            $this->results = $theyDo;
            return $this;
        } else
            return $theyDo;
    }

    /**
     * retrieve the $index element of the results
     * if $callback is given run it for the $index element of the results and return $this
     *
     * @param	integer $index
     * @param	callback $callback ($el,$results,$param1,$param2,....){$this is the DOMNode if $callback is closure;$param1,$param2,... are the optional ones}
     * @param	mixed $param1,$param2,... additional parameters to invoke the callback with;
     * @return	CommonXml
     * @return	DOMNode
     */
    final public function get($index, $callback = null)
    {
        if (is_callable($callback)) {
            $params = func_get_args();
            if ($callback instanceof Closure)
                $callback = $callback->bindTo($this->results[$index]);

            $params[0] = &$this->results[$index];
            $params[1] = &$this->results;

            call_user_func_array($callback, $params);
            return $this;
        }
        else {
            if ($this->results[$index] instanceof DOMNode)
                return $this->results[$index];
        }
    }

    /**
     * find if current node is matching given selector; if a callback is provided, run it for each result, otherwise commit changes in CommonXml::results
     * applies to CommonXml::results and not CommonXml::context
     *
     * @param	string $selector
     * @param	callback $callback ($el,$context,$param1,$param2,....){$this is the DOMNode;$param1,$param2,... are the optional ones of ::find;}
     * @param	mixed $param1,$param2,... additional parameters to invoke the callback with;
     * @return	CommonXml
     */
    final public function is($selector, $callback = null)
    {
        if (!is_callable($callback))
            $this->has("self::" . $selector, TRUE);
        else {
            $params = func_get_args();
            $params[0] = "self::" . $selector;

            call_user_func_array(array(
                $this,
                "find"
                ), $params);
        }

        return $this;
    }

    /**
     * find any descendants or self matching given selector; if a callback is provided, run it for each result, otherwise commit changes in CommonXml::results
     * applies to CommonXml::results and not CommonXml::context
     *
     * @param	string $selector
     * @param	callback $callback ($el,$context,$param1,$param2,....){$this is the DOMNode;$param1,$param2,... are the optional ones of ::find;}
     * @param	mixed $param1,$param2,... additional parameters to invoke the callback with;
     * @return	CommonXml
     */
    final public function descendantsAndSelf($selector, $callback = null)
    {
        if (!is_callable($callback))
            $this->has("descendant-or-self::" . $selector, TRUE);
        else {
            $params = func_get_args();
            $params[0] = "descendant-or-self::" . $selector;

            call_user_func_array(array(
                $this,
                "find"
                ), $params);
        }

        return $this;
    }

    /**
     * find any descendants matching given selector; if a callback is provided, run it for each result, otherwise commit changes in CommonXml::results
     * applies to CommonXml::results and not CommonXml::context
     *
     * @param	string $selector
     * @param	callback $callback ($el,$context,$param1,$param2,....){$this is the DOMNode;$param1,$param2,... are the optional ones of ::find;}
     * @param	mixed $param1,$param2,... additional parameters to invoke the callback with;
     * @return	CommonXml
     */
    final public function descendants($selector, $callback = null)
    {
        if (!is_callable($callback))
            $this->has("descendant::" . $selector, TRUE);
        else {
            $params = func_get_args();
            $params[0] = "descendant::" . $selector;

            call_user_func_array(array(
                $this,
                "find"
                ), $params);
        }

        return $this;
    }

    /**
     * find parent nodes, including self, matching given selector; if a callback is provided, run it for each result, otherwise commit changes in CommonXml::results
     * applies to CommonXml::results and not CommonXml::context
     *
     * @param	string $selector
     * @param	callback $callback ($el,$context,$param1,$param2,....){$this is the DOMNode;$param1,$param2,... are the optional ones of ::find;}
     * @param	mixed $param1,$param2,... additional parameters to invoke the callback with;
     * @return	CommonXml
     */
    final public function parentsAndSelf($selector, $callback = null)
    {
        if (!is_callable($callback))
            $this->has("ancestor-or-self::" . $selector, TRUE);
        else {
            $params = func_get_args();
            $params[0] = "ancestor-or-self::" . $selector;

            call_user_func_array(array(
                $this,
                "find"
                ), $params);
        }

        return $this;
    }

    /**
     * find parent nodes matching given selector; if a callback is provided, run it for each result, otherwise commit changes in CommonXml::results
     * applies to CommonXml::results and not CommonXml::context
     *
     * @param	string $selector
     * @param	callback $callback ($el,$context,$param1,$param2,....){$this is the DOMNode;$param1,$param2,... are the optional ones of ::find;}
     * @param	mixed $param1,$param2,... additional parameters to invoke the callback with;
     * @return	CommonXml
     */
    final public function parents($selector, $callback = null)
    {
        if (!is_callable($callback))
            $this->has("ancestor::" . $selector, TRUE);
        else {
            $params = func_get_args();
            $params[0] = "ancestor::" . $selector;

            call_user_func_array(array(
                $this,
                "find"
                ), $params);
        }

        return $this;
    }

    /**
     * find child nodes matching given selector; if a callback is provided, run it for each result, otherwise commit changes in CommonXml::results
     * applies to CommonXml::results and not CommonXml::context
     *
     * @param	string $selector
     * @param	callback $callback ($el,$context,$param1,$param2,....){$this is the DOMNode;$param1,$param2,... are the optional ones of ::find;}
     * @param	mixed $param1,$param2,... additional parameters to invoke the callback with;
     * @return	CommonXml
     */
    final public function children($selector, $callback = null)
    {
        if (!is_callable($callback))
            $this->has("child::" . $selector, TRUE);
        else {
            $params = func_get_args();
            $params[0] = "child::" . $selector;

            call_user_func_array(array(
                $this,
                "find"
                ), $params);
        }

        return $this;
    }

    /**
     * find following nodes matching given selector; if a callback is provided, run it for each result, otherwise commit changes in CommonXml::results
     * applies to CommonXml::results and not CommonXml::context
     *
     * @param	string $selector
     * @param	callback $callback ($el,$context,$param1,$param2,....){$this is the DOMNode;$param1,$param2,... are the optional ones of ::find;}
     * @param	mixed $param1,$param2,... additional parameters to invoke the callback with;
     * @return	CommonXml
     */
    final public function following($selector, $callback = null)
    {
        if (!is_callable($callback))
            $this->has("following::" . $selector, TRUE);
        else {
            $params = func_get_args();
            $params[0] = "following::" . $selector;

            call_user_func_array(array(
                $this,
                "find"
                ), $params);
        }

        return $this;
    }

    /**
     * find preceding nodes matching given selector; if a callback is provided, run it for each result, otherwise commit changes in CommonXml::results
     * applies to CommonXml::results and not CommonXml::context
     *
     * @param	string $selector
     * @param	callback $callback ($el,$context,$param1,$param2,....){$this is the DOMNode;$param1,$param2,... are the optional ones of ::find;}
     * @param	mixed $param1,$param2,... additional parameters to invoke the callback with;
     * @return	CommonXml
     */
    final public function preceding($selector, $callback = null)
    {
        if (!is_callable($callback))
            $this->has("preceding::" . $selector, TRUE);
        else {
            $params = func_get_args();
            $params[0] = "preceding::" . $selector;

            call_user_func_array(array(
                $this,
                "find"
                ), $params);
        }

        return $this;
    }

    /**
     * find the attribute nodes matching given selector; if a callback is provided, run it for each result, otherwise commit changes in CommonXml::results
     * applies to CommonXml::results and not CommonXml::context
     *
     * @param	string $selector
     * @param	callback $callback ($el,$context,$param1,$param2,....){$this is the DOMNode;$param1,$param2,... are the optional ones of ::find;}
     * @param	mixed $param1,$param2,... additional parameters to invoke the callback with;
     * @return	CommonXml
     */
    final public function attribute($selector, $callback = null)
    {
        if (!is_callable($callback))
            $this->has("attribute::" . $selector, TRUE);
        else {
            $params = func_get_args();
            $params[0] = "attribute::" . $selector;

            call_user_func_array(array(
                $this,
                "find"
                ), $params);
        }

        return $this;
    }

    /**
     * find next siblings matching given selector; if a callback is provided, run it for each result, otherwise commit changes in CommonXml::results
     * applies to CommonXml::results and not CommonXml::context
     *
     * @param	string $selector
     * @param	callback $callback ($el,$context,$param1,$param2,....){$this is the DOMNode;$param1,$param2,... are the optional ones of ::find;}
     * @param	mixed $param1,$param2,... additional parameters to invoke the callback with;
     * @return	CommonXml
     */
    final public function next($selector, $callback = null)
    {
        if (!is_callable($callback))
            $this->has("following-sibling::" . $selector, TRUE);
        else {
            $params = func_get_args();
            $params[0] = "following-sibling::" . $selector;

            call_user_func_array(array(
                $this,
                "find"
                ), $params);
        }

        return $this;
    }

    /**
     * find prev siblings matching given selector; if a callback is provided, run it for each result, otherwise commit changes in CommonXml::results
     * applies to CommonXml::results and not CommonXml::context
     *
     * @param	string $selector
     * @param	callback $callback ($el,$context,$param1,$param2,....){$this is the DOMNode;$param1,$param2,... are the optional ones of ::find;}
     * @param	mixed $param1,$param2,... additional parameters to invoke the callback with;
     * @return	CommonXml
     */
    final public function prev($selector, $callback = null)
    {
        if (!is_callable($callback))
            $this->has("preceding-sibling::" . $selector, TRUE);
        else {
            $params = func_get_args();
            $params[0] = "preceding-sibling::" . $selector;

            call_user_func_array(array(
                $this,
                "find"
                ), $params);
        }

        return $this;
    }

    /**
     * find siblings matching given selector; if a callback is provided, run it for each result, otherwise commit changes in CommonXml::results
     * applies to CommonXml::results and not CommonXml::context
     *
     * @param	string $selector
     * @param	callback $callback ($el,$context,$param1,$param2,....){$this is the DOMNode;$param1,$param2,... are the optional ones of ::find;}
     * @param	mixed $param1,$param2,... additional parameters to invoke the callback with;
     * @return	CommonXml
     */
    final public function siblings($selector, $callback = null)
    {
        if (!is_callable($callback))
            $this->has("preceding-sibling::" . $selector . "|" . "following-sibling::" . $selector, TRUE);
        else {
            $params = func_get_args();
            $params[0] = "preceding-sibling::" . $selector . "|" . "following-sibling::" . $selector;

            call_user_func_array(array(
                $this,
                "find"
                ), $params);
        }

        return $this;
    }

    /**
     * adds the  results  of xpath query for selector to existing set of results
     *
     * @param	string $selector
     * @return	CommonXml
     */
    final public function add($selector)
    {
        if ($selector) {
            $selector = trim($selector);

            $newResults = $this->xpath->query($selector);

            if ($newResults instanceof DOMNodeList && $newResults->length > 0)
                foreach ($newResults as $result) {
                    if ($result instanceof DOMNode)
                        $this->results[] = $result;
                }
        }
        return $this;
    }

    /**
     * changes a native property of DOMNode if possible, for each results
     *
     * @param	string $name
     * @param	string $value
     * @return	CommonXml
     */
    final public function prop($name, $value)
    {
        if (!empty($name)) {
            $name = trim($name);
            foreach ($this->results as $result) {
                if ($result instanceof DOMNode)
                    $result->$name = $value;
            }
        }
        return $this;
    }

    /**
     * filters the results to the ones having given class
     *
     * @param	string $c
     * @return	CommonXml
     */
    final public function hasClass($c)
    {
        if (!empty($c)) {
            $c = trim($c);
            $theyDo = [];
            foreach ($this->results as $result) {
                if ($result instanceof DOMNode && method_exists($result, "hasAttribute"))
                    if ($result->hasAttribute("class")) {
                        $attrVals = preg_split("/[\s,]+/", $result->getAttribute("class"));
                        foreach ($attrVals as $class)
                            if ($class == $c)
                                $theyDo[] = $result;
                    }
            }
            $this->results = $theyDo;
        }
        return $this;
    }

    /**
     * removes given class
     *
     * @param	string $c
     * @param	string $glue - default space character; used to implode the class names
     * @return	CommonXml
     */
    final public function removeClass($c, $glue = " ")
    {

        if (!$this->removeClass_helper instanceof Closure)
            $this->removeClass_helper = function(&$el, $class, $g) {
                $cs = array();
                if ($this instanceof DOMNode && method_exists($this, "hasAttribute"))
                    if ($this->hasAttribute("class")) {
                        $attrVals = preg_split("/[\s,]+/", $this->getAttribute("class"));
                        foreach ($attrVals as $c)
                            if ($class != $c)
                                $cs[] = $c;
                        $this->setAttribute("class", implode($g, $cs));
                    }
            };

        if (!empty($c)) {
            $c = trim($c);
            $this->each($this->removeClass_helper, $c, $glue);
        }
        return $this;
    }

    /**
     * adds given class
     *
     * @param	string $c
     * @param	string $glue - default space character
     * @return	CommonXml
     */
    final public function addClass($c, $glue = " ")
    {
        if (!$this->addClass_helper instanceof Closure)
            $this->addClass_helper = function(&$el, $class, $g) {
                if ($this instanceof DOMNode && method_exists($this, "hasAttribute")) {
                    if ($this->getAttribute("class"))
                        $attrVals = preg_split("/[\s,]+/", $this->getAttribute("class"));
                    else
                        $attrVals = [];

                    if (!in_array($class, $attrVals)) {
                        $attrVals[] = $class;
                        $this->setAttribute("class", implode($g, $attrVals));
                    }
                }
            };

        if (!empty($c)) {
            $c = trim($c);
            $this->each($this->addClass_helper, $c, $glue);
        }
        return $this;
    }

    /**
     * returns class instance for 2 arguments or attr value for one argument (attr name)
     *
     * @param	string $name
     * @param	string $value
     * @return	CommonXml if both $name and $value are provided;
     * @return	string if only $nameis provided
     */
    final public function attr()
    {

        $attrName = func_get_arg(0);
        $attrValue = func_get_arg(1);

        if (!$this->attr_helper instanceof Closure)
            $this->attr_helper = function(&$el, $attrName, $attrValue) {
                if ($el->nodeType == 1)
                    $el->setAttribute($attrName, $attrValue);
            };

        if (func_num_args() == 2) {
            $this->each($this->attr_helper, $attrName, $attrValue);
            return $this;
        } else if (func_num_args() == 1) {
            if (gettype($this->get(0)) == "object" && $this->get(0) instanceof DOMNode)
                if ($this->get(0)->nodeType == 1)
                    return $this->get(0)->getAttribute($attrName);
        }
    }

    /**
     * removes given attribute
     *
     * @param	string $name
     * @return	CommonXml
     */
    final public function removeAttr($aN)
    {
        if (func_num_args() >= 1) {

            if (!$removeAttr_helper instanceof Closure)
                $removeAttr_helper = function(&$el, $attrName) {
                    if ($el->nodeType == 1)
                        if ($el->hasAttribute($attrName))
                            $el->removeAttribute($attrName);
                };

            $this->each($removeAttr_helper, $aN);
        }
        return $this;
    }

    /**
     * removes all atributes
     *
     * @return	CommonXml
     */
    final public function removeAttributes()
    {
        if (!$this->removeAttributes_helper instanceof Closure)
            $this->removeAttributes_helper = function(&$el) {
                if ($el->nodeType == 1)
                    while ($el->hasAttributes())
                        $el->removeAttributeNode($el->attributes->item(0));
            };

        $this->each($this->removeAttributes_helper, FALSE);

        return $this;
    }

    /**
     * creates an array of DOMNodes
     *
     * @param	mixed $input - can be either string, DOMNode, DOMNodeList, array of them
     * @return	array
     */
    final public function normalizeOperationsInput($input)
    {
        $output = array();
        $doc = $this->doc;
        if (sizeof(func_num_args()) > 0) {
            //folosesc DOMDocument daca a fost dat ca parametru al functiei
            if (sizeof(func_num_args()) > 1)
                if (!func_get_arg(1) instanceof DOMDocument)
                    $doc = func_get_arg(1);

            switch (gettype($input)) {
                case "string" :
                    //daca input ="" este tot string
                    if (!empty($input)) {
                        $df = $doc->createDocumentFragment();
                        $df->appendXML($input);
                        $output[] = $df;
                    }
                    break;
                case "object" :
                    //DOMNodeList DOMNode
                    if ($input instanceof DOMNode) {
                        $output[] = $input;
                    } else if ($input instanceof DOMNodeList) {
                        foreach ($input as $node)
                            $output[] = $node;
                    }
                    break;
                case "array" :
                    foreach ($input as $v)
                        $output = array_merge($output, $this->normalizeOperationsInput($v));
                    break;
            }
        }
        return $output;
    }

    /**
     * clones all nodes in results
     *
     * @return	array
     */
    final public function cloneResults()
    {
        $output = [];
        foreach ($this->results as $res)
            $output[] = $res->cloneNode(TRUE);
        return $output;
    }

    /**
     * appends to all nodes in results
     *
     * @param	mixed - can be either string, DOMNode, DOMNodeList, array of them
     * @return	CommonXml
     */
    final public function append($with)
    {
        if (func_num_args() >= 1) {
            $nodes = $this->normalizeOperationsInput($with);

            $append_helper = function(&$el, $df, $cloneNode) {
                if ($cloneNode) {
                    if (method_exists($df, "cloneNode"))
                        $newdf = $df->cloneNode(TRUE);
                    else
                        $newdf = $df;
                } else
                    $newdf = $df;

                if ($newdf->ownerDocument !== $el->ownerDocument)
                    if ($newdf instanceof DOMNode)
                        $newdf = $el->ownerDocument->importNode($newdf, TRUE);

                if ($newdf instanceof DOMNode)
                    $el->appendChild($newdf);
            };

            foreach ($nodes as $node)
                $this->each($append_helper, $node, (sizeof($this->results) > 1 ? TRUE : FALSE));
        }
        return $this;
    }

    /**
     * prepends to all nodes in results
     *
     * @param	mixed - can be either string, DOMNode, DOMNodeList, array of them
     * @return	CommonXml
     */
    final public function prepend($with)
    {
        if (func_num_args() >= 1) {
            $nodes = $this->normalizeOperationsInput($with);

            if (!$prepend_helper instanceof Closure)
                $prepend_helper = function(&$el, $df, $cloneNode) {
                    if ($cloneNode) {
                        if (method_exists($df, "cloneNode"))
                            $newdf = $df->cloneNode(TRUE);
                        else
                            $newdf = $df;
                    } else
                        $newdf = $df;

                    if ($newdf->ownerDocument !== $el->ownerDocument)
                        if ($newdf instanceof DOMNode)
                            $newdf = $el->ownerDocument->importNode($newdf, TRUE);

                    if ($el->hasChildNodes()) {
                        if ($newdf instanceof DOMNode)
                            $el->insertBefore($newdf, $el->firstChild);
                    } else {
                        if ($newdf instanceof DOMNode)
                            $el->appendChild($newdf);
                    }
                };

            foreach ($nodes as $node)
                $this->each($prepend_helper, $node, (sizeof($this->results) > 1 ? TRUE : FALSE));
        }
        return $this;
    }

    /**
     * inserts before all nodes in results
     *
     * @param	$with - mixed  - can be either string, DOMNode, DOMNodeList, array of them
     * @return	CommonXml
     */
    final public function before($with)
    {
        if (func_num_args() >= 1) {
            $nodes = $this->normalizeOperationsInput($with);
            if (!$before_helper instanceof Closure)
                $before_helper = function(&$el, $df, $cloneNode) {
                    if ($cloneNode) {
                        if (method_exists($df, "cloneNode"))
                            $newdf = $df->cloneNode(TRUE);
                        else
                            $newdf = $df;
                    } else
                        $newdf = $df;

                    if ($newdf->ownerDocument !== $el->ownerDocument)
                        if ($newdf instanceof DOMNode)
                            $newdf = $el->ownerDocument->importNode($newdf, TRUE);

                    if ($newdf instanceof DOMNode)
                        $el->parentNode->insertBefore($newdf, $el);
                };

            foreach ($nodes as $node)
                $this->each($before_helper, $node, (sizeof($this->results) > 1 ? TRUE : FALSE));
        }
        return $this;
    }

    /**
     * inserts after all nodes in results
     *
     * @param	$with - mixed - can be either string, DOMNode, DOMNodeList, array of them
     * @return	CommonXml
     */
    final public function after($with)
    {
        if (func_num_args() >= 1) {
            $nodes = $this->normalizeOperationsInput($with);

            if (!$after_helper instanceof Closure)
                $after_helper = function(&$el, $df, $cloneNode) {
                    if ($cloneNode) {
                        if (method_exists($df, "cloneNode"))
                            $newdf = $df->cloneNode(TRUE);
                        else
                            $newdf = $df;
                    } else
                        $newdf = $df;

                    if ($newdf->ownerDocument !== $el->ownerDocument)
                        if ($newdf instanceof DOMNode)
                            $newdf = $el->ownerDocument->importNode($newdf, TRUE);

                    if ($newdf instanceof DOMNode)
                        $el->parentNode->insertBefore($newdf, $el->nextSibling);
                };

            foreach ($nodes as $node)
                $this->each($after_helper, $node, (sizeof($this->results) > 1 ? TRUE : FALSE));
        }
        return $this;
    }

    /**
     * replaces all nodes in results
     *
     * @param	mixed - can be either string, DOMNode, DOMNodeList, array of them
     * @return	CommonXml
     */
    final public function replace()
    {
        if (func_num_args() == 1) {
            $df = $this->doc->createDocumentFragment();

            $nodes = $this->normalizeOperationsInput(func_get_arg(0));

            //creez document fragment din arg(0); fac clona si import daca e nevoie
            if (sizeof($this->results) > 1)
            //daca sunt mai multe elemente in results facem clone
                foreach ($nodes as $node)
                    if ($node->ownerDocument === $this->doc)
                        $df->appendChild($node->cloneNode(TRUE));
                    else
                        $df->appendChild($this->doc->importNode($node->cloneNode(TRUE), TRUE));
            else
            //avem doar un singur resultat al query
                foreach ($nodes as $node)
                    if ($node->ownerDocument === $this->doc)
                        $df->appendChild($node);
                    else
                        $df->appendChild($this->doc->importNode($node, TRUE));

            //cu df creat, fac replace, clona daca sunt mai multe results df initial daca results->length = 1
            if (sizeof($this->results) > 1)
                foreach ($this->results as $tor)
                    $tor->parentNode->replaceChild($df->cloneNode(TRUE), $tor);
            else
                foreach ($this->results as $tor)
                    $tor->parentNode->replaceChild($df, $tor);
        }
        return $this;
    }

    /**
     * replaces content of all nodes in results
     *
     * @param	$with - mixed - can be either string, DOMNode, DOMNodeList, array of them
     * @return	CommonXml
     */
    final public function replaceContent($with)
    {

        if (func_num_args() >= 1) {
            $nodes = $this->normalizeOperationsInput($with);
            if (!$replaceContent_helper_removeContent instanceof Closure)
                $replaceContent_helper_removeContent = function(&$el) {
                    while ($el->hasChildNodes())
                        $el->removeChild($el->firstChild);
                    foreach ($nodes as $node)
                        $el->appendChild($node->cloneNode(TRUE));
                };
            $this->each($replaceContent_helper_removeContent);
        }
        return $this;
    }

    /**
     * removes child nodes of all nodes in results
     *
     * @return	CommonXml
     */
    final public function removeChilds()
    {
        foreach ($this->results as $tor)
            if (method_exists($tor, "hasChildNodes"))
                while ($tor->hasChildNodes())
                    $tor->removeChild($tor->childNodes->item(0));

        return $this;
    }

    /**
     * removes all nodes in results
     *
     * @return	CommonXml
     */
    final public function remove()
    {
        $this->each(function() {
            $this->parentNode->removeChild($this);
        });
        return $this;
    }

    /**
     * retrive or set the text content of all nodes in results
     *
     * @param	string to set the text
     * @return	CommonXml
     */
    final public function text()
    {

        if (func_num_args() == 1) {
            $textContent = func_get_arg(0);

            if (!$this->text_helper instanceof Closure)
                $this->text_helper = function(&$el, $check, $textContent) {
                    if (!$check || ($check && is_callable($check) && call_user_func($check, $el))) {
                        $done = false;
                        if ($el->nodeType == XML_ELEMENT_NODE) {
                            if ($el->hasChildNodes())
                                foreach ($el->childNodes as $child)
                                    if ($child->nodeType == XML_TEXT_NODE) {
                                        $child->replaceData(0, strlen($child->wholeText), $textContent);
                                        $done = true;
                                    }
                            if (!$done)
                                $el->appendChild($el->ownerDocument->createTextNode($textContent));
                            $done = false;
                        }
                    }
                };

            if (function_exists($this->check))
                $this->each($this->text_helper, $this->check, $textContent);
            else
                $this->each($this->text_helper, FALSE, $textContent);

            return $this;
        } else {
            $toReturn = "";
            foreach ($this->results as $result) {
                //elemente
                if ($result->nodeType == XML_ELEMENT_NODE)
                    $toReturn .= $result->textContent;
            }
            return $toReturn;
        }
    }

    /**
     * get a string of concatenated source of all DOMElements in results
     *
     * @param	mixed - can be either string, DOMNode, DOMNodeList, array of them
     * @return	CommonXml
     */
    final public function resultsAsSource()
    {
        $toReturn = "";
        foreach ($this->results as $result) {
            //elemente
            if ($result->nodeType == XML_ELEMENT_NODE)
                $toReturn .= $result->C14N();
        }
        return $toReturn;
    }

    /**
     * get a string with concatenated source of all nodes in results
     *
     * @return	string
     */
    final public function xml()
    {
        $toReturn = "";

        foreach ($this->results as $result)
            $toReturn .= $result->C14N();

        return $toReturn;
    }

    /**
     * retrieve a documentFragment containing all nodes in results
     *
     * @return	DOMDocumentFragment
     */
    final public function resultsAsDocumentFragment()
    {
        $docFragment = $this->doc->createDocumentFragment();

        foreach ($this->results as $result)
            $docFragment->appendChild($result);

        return $docFragment;
    }

    /**
     * use to call a method of a DOMElement with given args
     *
     * @param	string $method
     * @param	array $args - method arguments
     * @return	CommonXml
     */
    final public function elements($method, $args = array())
    {
        if (!empty($method))
            foreach ($this->results as $result)
                if ($result instanceof DOMElement)
                    if (method_exists($result, $method))
                        call_user_func_array(array(
                            $result,
                            $method
                            ), $args);
                    else {
                        trigger_error(get_class($result) . "::$method doesn't exists; trying if any callable property is available", E_USER_WARNING);
                        if (is_callable(array(
                                $result,
                                $method
                            ))) {
                            trigger_error(get_class($result) . "::$method callable property found, executing", E_USER_NOTICE);
                            call_user_func_array(array(
                                $result,
                                $method
                                ), $args);
                        } else
                            trigger_error(get_class($result) . "::$method callable property not found either", E_USER_WARNING);
                    }
        return $this;
    }

    /**
     * get the document root node
     *
     * @return	DOMNode
     */
    final public function getRootElement()
    {
        return $this->doc->documentElement;
    }

    /**
     * retrieve the results as array to a variable
     *
     * @param	array $destination - name of the variable
     * @return	CommonXml
     */
    final public function to(&$destination)
    {
        $destination = $this->results;
        return $this;
    }

    /**
     * retrieve the first element of results
     *
     * @return	DOMNode or FALSE
     */
    final public function first()
    {
        if (gettype($this->results) == "array" && sizeof($this->results) > 0) {
            if (gettype($this->get(0)) == "object" && $this->get(0) instanceof DOMNode)
                return $this->get(0);
        } else
            return FALSE;
    }

    /**
     * retrieve the last element of results
     *
     * @return	DOMNode or FALSE
     */
    final public function last()
    {
        if (gettype($this->results) == "array" && sizeof($this->results) > 0) {
            if (gettype($this->get(sizeof($this->results) - 1)) == "object" && $this->get(sizeof($this->results) - 1) instanceof DOMNode)
                return $this->get(sizeof($this->results) - 1);
        } else
            return FALSE;
    }

    public function parentVersion()
    {
        return parent::version;
    }

    public function __version__()
    {
        return array(
            __CLASS__ => self::version,
            get_parent_class($this) => parent::version
        );
    }
}
