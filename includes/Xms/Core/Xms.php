<?php namespace Xms\Core;

use DOMNode;
use Exception;
use DOMDocumentFragment;

/*
 * XMS - Online Web Development
 *
 * Copyright (c) 2010 Cezar Lucan cezar.lucan@aws-dms.com
 * Licensed under GPL license.
 * http://www.aws-dms.com
 *
 * Date: 2010-10-24
 */

//4.20 $GLOBALS["XMS_SERVER_CONSOLE"] now observable instance property Xms::XMS_SERVER_CONSOLE
//4.3 XMS::APP,CONFIG,LANG,FILTERS now XmsXml
//4.2 XMS::CLIENT now XmsXml
//3.0-beta1-2015-01-31: domiterator after #php-pi
//3.0-alpha5-2013-08-25: set the engine to run as standalone xms server with all parameters from the user
//ex: $e = new XMS(Array("XMS_INPUT"=>$_SERVER["REQUEST_URI"]))
//XMS_INPUT
//XMS_RESOURCE_ROUTER
//XMS_RESOURCE_CONFIG
//XMS_RESOURCE_ACCESS
//XMS_RESOURCE_LANG
//XMS_RESOURCE_PARSERS;
//3.0-alpha4: parsers work

/*
 * Xms web application engine
 */

class Xms implements XmsEventHandler
{

    const VERSION = 4.20;
    const releaseDate = "2015-05-03";

    use Overload;

use EventHandlerPredefinedMethods;

use XmsHelpers;

    public $name;
    private $XMS_INPUT;
    private $XMS_RESOURCE_ROUTER = XMS_RESOURCE_ROUTER;
    private $XMS_RESOURCE_CONFIG = XMS_RESOURCE_CONFIG;
    private $XMS_RESOURCE_ACCESS = XMS_RESOURCE_ACCESS;
    private $XMS_RESOURCE_LANG = XMS_RESOURCE_LANG;
    private $XMS_RESOURCE_PARSERS = XMS_RESOURCE_PARSERS;
    protected $CLIENT_TEMPLATE = "<client><header/><content/></client>";
    protected $errLogMessage;
    protected $translator = array();
    //OUTPUT TRANSLATOR ARRAY

    public $APP;
    public $CLIENT;
    protected $XMS_ACCESS_CONTROL;
    //access.xml

    public $CONFIG;
    //config.xml

    protected $ROUTER;
    //router.xml

    protected $LANG;
    //lang.xml

    protected $FILTERS;
    //parsers.xml

    protected $PARSERS = array();
    //user defined parsers

    protected $childNodes = array();
    public $firstChild;
    protected $step1 = [
        [
            "alias" => "remotetemplate",
            "check" => "",
            "target" => "APP",
            "xpath" => "//*[local-name()='app']/*[local-name()='remotetemplate']",
            "callback" => "loadRemoteTemplate"
        ],
        [
            "alias" => "use",
            "check" => "",
            "target" => "APP",
            "xpath" => "//*[local-name()='app']/*[local-name()='use']",
            "callback" => "doFilterImport"
        ],
        [
            "alias" => "name",
            "check" => "",
            "target" => "APP",
            "xpath" => "//*[local-name()='app']/*[local-name()='name']",
            "callback" => "getAppName"
        ],
        [
            "alias" => "init",
            "check" => "",
            "target" => "APP",
            "xpath" => "//*[local-name()='app']/*[local-name()='init']",
            "callback" => "appInitDirective"
        ],
        [
            "alias" => "createClient",
            "check" => "",
            "target" => "APP",
            "xpath" => "/*[local-name()='app']/*[local-name()='client'][1]",
            "callback" => "createClient"
        ],
        [
            "alias" => "import",
            "check" => "",
            "target" => "APP",
            "xpath" => "//*[local-name()='app']/*[local-name()='filters']/*[local-name()='dom']/*[local-name()='filter' and not(contains(@class,'invokable'))]/*[local-name()='import']",
            "callback" => "execDirectiveFromFilter"
        ]
    ];
    protected $step2 = [
        [
            "alias" => "domiterator",
            "check" => "",
            "target" => "APP",
            "xpath" => "//*[local-name()='app']/*[local-name()='filters']/*[local-name()='dom']/*[local-name()='filter' and not(contains(@class,'invokable'))]/*[local-name()='domiterator']",
            "callback" => "processDomIterator"
        ],
        [
            "alias" => "xpath",
            "check" => "",
            "target" => "APP",
            "xpath" => "//*[local-name()='app']/*[local-name()='filters']/*[local-name()='dom']/*[local-name()='filter' and not(contains(@class,'invokable'))]/*[local-name()='xpath']",
            "callback" => "processXpath"
        ]
    ];
    protected $step3;
    protected $executionTime;
    public $TEMPLATE_FILE_SOURCE;
    public $builtinDirectives = [
        XML_ELEMENT_NODE => [
            "Xms\Core\Utils::directiveIMPORT" => ["localName" => "import"],
            "Xms\Core\Utils::directiveCASE" => ["localName" => "case"]
        ],
        XML_PI_NODE => [
            "Xms\Core\Utils::directivePHP" => ["target" => "php"],
            "Xms\Core\Utils::directiveJS" => ["target" => "js"]
        ]
    ];

    public function __construct()
    {
        //set default input to request uri for default functionality/router
        $this->XMS_INPUT = filter_input(INPUT_SERVER, "REQUEST_URI");

        //overwrite startup options for diferent instances
        //the parameter is an assoc array with any of the following keys:
        //XMS_INPUT,XMS_RESOURCE_ROUTER,XMS_RESOURCE_CONFIG,XMS_RESOURCE_ACCESS,XMS_RESOURCE_LANG,XMS_RESOURCE_PARSERS
        if (func_num_args() > 0)
            foreach (func_get_arg(0) as $k => $v)
                if (property_exists(get_class($this), $k))
                    $this->$k = $v;

        $this->step3 = [
            [
                "alias" => "langsys",
                "check" => function() {
                    return $_SESSION["lang"];
                },
                "target" => "LANG",
                "xpath" => '//lang/' . $_SESSION["lang"] . '/' . $this->name . '/sys/*',
                "callback" => "langSysMessages"
            ],
            [
                "alias" => "langui",
                "check" => function() {
                    return $_SESSION["lang"];
                },
                "target" => "LANG",
                "xpath" => '//lang/' . $_SESSION["lang"] . '/' . $this->name . '/ui/*',
                "callback" => "langSysMessages"
            ]
            ,
            [
                "alias" => "langerr",
                "check" => function() {
                    return $_SESSION["lang"];
                },
                "target" => "LANG",
                "xpath" => '//lang/' . $_SESSION["lang"] . '/' . $this->name . '/err/*',
                "callback" => "langSysMessages"
            ]
        ];
        $this->XMS_SERVER_CONSOLE = [];

        $this->bind("change", "XMS_SERVER_CONSOLE", function($n) {
            if (constant("AWS_DEBUG"))
                Utils::xmsLogRotate(constant('XMS_SERVER_CONSOLE'), $n . "\n");
        });

        $this->on("loaded", function() {
            if (!file_exists(constant("XMS_WORKING_FOLDER") . DIRECTORY_SEPARATOR . "cache"))
                mkdir(constant("XMS_WORKING_FOLDER") . DIRECTORY_SEPARATOR . "cache");

            if (!file_exists(constant("XMS_WORKING_FOLDER") . DIRECTORY_SEPARATOR . "log"))
                mkdir(constant("XMS_WORKING_FOLDER") . DIRECTORY_SEPARATOR . "log");
        });

        $this->initResources();
    }

    function __invoke($child)
    {
        if (array_key_exists($child, $this->childNodes))
            return $this->childNodes[$child];
        else
            return call_user_func_array(array($this->APP, "q"), func_get_args());
    }

    public function run()
    {
        $this->executionTime = -microtime(true);

        $this->getGlobalParsers();
        $this->getAppParsers();

        $this->runBuiltInDirectives();
        $this->runParsers();

        $this->executionTime+=microtime(true);
        return $this;
    }

    public function getET()
    {
        return $this->executionTime;
    }

    public static function _create_function(&$e, $args, $ft)
    {

        $toRet = create_function($args, $ft);


        if ($e instanceof XmsEventHandler)
            $e->topmost()->XMS_SERVER_CONSOLE = __METHOD__ . " $toRet from " . $e->getNodePath() . " ;\n With code:\n" . $ft . "\n\n";
        else
            $GLOBALS["XMS_SERVER_CONSOLE"] .= __METHOD__ . " $toRet\nWith code:\n" . $ft . "\n\n";

        if (is_callable($toRet))
            return $toRet;
        else {
            if ($e instanceof XmsEventHandler)
                $e->topmost()->XMS_SERVER_CONSOLE = __METHOD__ . " Unable to create anonymous function\n";
            else
                $GLOBALS["XMS_SERVER_CONSOLE"] .= "Unable to create anonymous function\n";
        }
    }

    private function initResources()
    {
        ///////////////////////////////////
        ///////////////ACCESS//////////////
        ///////////////////////////////////
        if (file_exists($this->XMS_RESOURCE_ACCESS)) {
            $awsaccessfile = file_get_contents($this->XMS_RESOURCE_ACCESS);
            $this->childNodes["XMS_ACCESS_CONTROL"] = $this->XMS_ACCESS_CONTROL = new XmsAccessControl($awsaccessfile);
            $this->XMS_ACCESS_CONTROL->parentNode = $this;
        } else
            define("AWS_USER_ACCESS_DISABLED", TRUE);

        ///////////////////////////////////
        ///////////////CONFIG//////////////
        ///////////////////////////////////
        if (file_exists($this->XMS_RESOURCE_CONFIG))
            $awsappconfigurationFile = file_get_contents($this->XMS_RESOURCE_CONFIG);

        $this->childNodes["CONFIG"] = $this->CONFIG = new XmsXml($awsappconfigurationFile);
        $this->CONFIG->parentNode = $this;

        ///////////////////////////////////
        ///////////////ROUTER//////////////
        ///////////////////////////////////
        if (file_exists($this->XMS_RESOURCE_ROUTER)) {
            $awsapprouterFile = file_get_contents($this->XMS_RESOURCE_ROUTER);
            $this->childNodes["ROUTER"] = $this->ROUTER = new Router($awsapprouterFile);
            $this->ROUTER->parentNode = $this;
            ///////////////////////////////////////
            ///////////////LOAD APP////////////////
            ///////////////////////////////////////
            $appFromRouter = $this->ROUTER->init($this->XMS_INPUT, $this->XMS_ACCESS_CONTROL);

            $this->APP = $this->childNodes["APP"] = new XmsXml($appFromRouter);
            $this->APP->parentNode = $this;
        } else
            throw new Exception($this->XMS_RESOURCE_ROUTER . " is missing");

        ///////////////////////////////////
        ///////////////LANG////////////////
        ///////////////////////////////////
        if (file_exists($this->XMS_RESOURCE_LANG))
            $awsapplanguageFile = file_get_contents($this->XMS_RESOURCE_LANG);
        $this->childNodes["LANG"] = $this->LANG = new XmsXml($awsapplanguageFile);
        $this->LANG->parentNode = $this;

        ///////////////////////////////////
        ////////////USER PARSERS///////////
        ///////////////////////////////////

        if (file_exists($this->XMS_RESOURCE_PARSERS))
            $awsappglobalparsersFile = file_get_contents($this->XMS_RESOURCE_PARSERS);
        $this->childNodes["FILTERS"] = $this->FILTERS = new XmsXml($awsappglobalparsersFile);
        $this->FILTERS->parentNode = $this;

        ///////////////////////////////////////
        /////////////////HTML//////////////////
        ///////////////////////////////////////

        $this->childNodes["CLIENT"] = $this->CLIENT = new XmsXml($this->CLIENT_TEMPLATE);
        $this->CLIENT->parentNode = $this;

        $this->firstChild = $this->childNodes["APP"];
        $this->lastChild = $this->childNodes["CLIENT"];

        $this->trigger("loaded", [], XmsEvent::BUBBLE_CANCEL);
    }

    private function runBuiltInDirectives()
    {
        $this->runStep($this->step1);

        $this->trigger("ready", [], XmsEvent::BUBBLE_CANCEL);

        Utils::clientrun($this->CLIENT->doc->documentElement);

        $this->trigger("documentdone", [], XmsEvent::BUBBLE_CANCEL);

        $this->runStep($this->step2);
        $this->runStep($this->step3);

        $this->trigger("done", [], XmsEvent::BUBBLE_CANCEL);
    }

    private function runStep($step)
    {
        foreach ($step as $directive) {
            if (is_string($directive["callback"]))
                $this->XMS_SERVER_CONSOLE = "RUN_STEP:\n\t" . $directive["alias"] . ":\t" . $directive["xpath"] . "\n\n";
            $check = TRUE;

            if (is_callable($directive["check"]))
                $check = call_user_func($directive["check"]);

            if ($check)
                $this($directive["target"])->q($directive["xpath"])->each(array(
                    $this,
                    $directive["callback"]
                ));

            $this->trigger($directive["alias"], array(
                $directive["target"],
                $directive["xpath"]
                ), XmsEvent::BUBBLE_CANCEL);
        }
    }

    private function getGlobalParsers()
    {
        if ($this->FILTERS instanceOf Xml)
            $this->FILTERS->q("//*[local-name()='parsers']/*[local-name()='item']")->each(array(
                $this,
                "getParser"
            ));
    }

    private function getAppParsers()
    {
        $this->APP->q("//*[local-name()='app']/*[local-name()='parsers']/*[local-name()='item']")->each(array(
            $this,
            "getParser"
        ));
    }

    private function runParsers()
    {
        $this->XMS_SERVER_CONSOLE = "RUNNING PARSERS:\n" . print_r($this->PARSERS, TRUE) . "\n";

        foreach ($this->PARSERS as $parser) {
            $check = TRUE;

            if (function_exists($parser["check"]))
                $check = call_user_func($parser["check"]);

            if ($check)
                $this->CLIENT->q($parser["xpath"])->each($parser["callback"]);
            $this->trigger("parser", array(
                $parser["xpath"],
                ($parser->ownerDocument === $this("APP")->doc ? "local" : "global")
                ), XmsEvent::BUBBLE_CANCEL);
        }
    }

    function invokeFilters($id)
    {
        $ff = new Xml($this->APP->doc);
        $ff->q("//*[local-name()='app']/*[local-name()='filters']/*[local-name()='dom']/*[local-name()='filter' and contains(@class,'invokable')]");
        //get all invokable dom filters
        $ff->add("//*[local-name()='app']/*[local-name()='filters']/*[local-name()='ob']/*[local-name()='filter' and contains(@class,'invokable')]");
        //add all invokable ob filters
        $ff->filter(function(&$el, $id) {
            //filter only those with required id
            if ($el->hasAttribute("id") && $el->getAttribute("id") == $id)
                return TRUE;
            else
                return FALSE;
        }, $id);

        $ff->children("*[1]", function(&$el, &$context, $XMS) {
            //execute them
            $allfilters = array_merge($XMS->step1, $XMS->step2);
            foreach ($allfilters as $directive)
                if ($directive["alias"] == strtolower($this->localName)) {
                    call_user_func_array(array(
                        $XMS,
                        $directive["callback"]
                        ), array(&$this));
                }
        }, $this);
    }

    public function get()
    {

        //using a custom xstyle for output
        $outputxsl = $this("APP")->doc->documentElement->getAttribute('outputxsl');

        if ($outputxsl)
            $output = $this->CLIENT->content($outputxsl);
        else
            $output = $this->CLIENT->content();

        //if output not disabled
        if ($this("APP")->doc->documentElement->getAttribute('outputdisabled') != "TRUE")
            return $output;
    }

    final public function appConfig($query, $context = FALSE, $json = FALSE, $callback = FALSE)
    {
        if (constant("AWS_APP_CONFIG_USE_APP_NAME"))
            $prefix = '//config/' . $this->name;
        else
            $prefix = "//config/app[@path='" . $this->TEMPLATE_FILE_SOURCE . "']";

        if (is_callable($callback)) {
            $appNodeInConfig = $this->CONFIG->q($prefix, $context)->get(0);
            $args = func_get_args();
            $args[1] = $appNodeInConfig;
            $args[3] = $prefix;
            //callback params: $query,$node,$json,$prefix,$allOtherParams
            call_user_func_array($callback, $args);
        }

        if ($json)
            return json_decode(trim($this->CONFIG->q($prefix . $query, $context)->get(0)->textContent));
        else
            return trim($this->CONFIG->q($prefix . $query, $context)->get(0)->textContent);
    }

    final public function getParentNode()
    {
        //required by XmsEventHandler
        //$this -> _parentNode is null and readonly; we need a writable property
        return null;
    }

    final public function getChildNodes()
    {
        //required by XmsEventHandler
        return $this->childNodes;
    }

    final public function hasChildNodes()
    {
        //required by XmsEventHandler
        return sizeof($this->childNodes);
    }
}
