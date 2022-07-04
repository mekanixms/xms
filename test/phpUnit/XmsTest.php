<?php

class XmsTest extends PHPUnit_Framework_TestCase
{

    public function setUp()
    {
//TESTING XSL PROCESSOR LOADED
        if (!extension_loaded("xsl"))
            die("XSL Extension not loaded.<br/>Please install php xslt extension");

        ini_set("display_errors", "Off");

        ini_set("error_reporting", "E_ALL");

        ini_set("magic_quotes_gpc", "Off");

        ini_set('include_path', ini_get('include_path') . ':' . dirname($_SERVER['SCRIPT_FILENAME']) . PATH_SEPARATOR . "includes");

        ini_set('default_charset', 'utf-8');

//thanks to Christian Roy
//http://christian.roy.name/blog/detecting-modrewrite-using-php
        if (function_exists('apache_get_modules')) {
            $MOD_REWRITE = in_array('mod_rewrite', apache_get_modules());
        } else {
            $MOD_REWRITE = getenv('HTTP_MOD_REWRITE') == 'On' ? TRUE : FALSE;
            $MOD_REWRITE = $_SERVER['HTTP_MOD_REWRITE'] == 'On' ? TRUE : FALSE;
        }

        define('MOD_REWRITE_ENABLED', $MOD_REWRITE);

//// 3.0
        define('XMS_RESOURCE_ACCESS', 'access.xml');
        define('XMS_RESOURCE_CONFIG', 'config.xml');
        define('XMS_RESOURCE_ROUTER', 'router.xml');
        define('XMS_RESOURCE_PARSERS', 'parsers.xml');
        define('XMS_RESOURCE_LANG', 'lang.xml');

////
//APPLICATION
        define('XMS_APPS_LOCKED_IN_CWD', FALSE);

        define('AWS_HOME', "templates/index.xml");

        define('AWS_DEFAULTS_LOADED', TRUE);

//DESIGNER's USER NAME AND PASSWORD
        define('AWS_DESIGNER_ADMIN', "admin");

        define('AWS_DESIGNER_PASSWORD', "admin");

//USER ACCESS
        define('XMS_USER_ACCESS_VAR', $_SESSION['XMS_CURRENT_USER'] ? $_SESSION['XMS_CURRENT_USER'] : "guest");
        define("AWS_USER_ACCESS_DISABLED", FALSE);

//DESIGNER THEME - FULL LIST IN CSS FOLDER
        define('AWS_DESIGNER_THEME', "redmond");

        define('AWS_HTML_XSL_NAMESPACE_FIX', TRUE);

//FOR MATCH AND MATCHITERATOR DIRECTIVES
        define("AWS_ITERATOR_MATCH_PREFIX", '/\{-\{');

        define("AWS_ITERATOR_MATCH_SUFFIX", '\}-\}/');

//CACHE FOLDER
//define('AWS_CACHE_LOCATION',	 		"cache".DIRECTORY_SEPARATOR.session_id());
        define('AWS_CACHE_LOCATION', "cache");

//if apache_mod_rewrite, this holds the file where to record the streamed resources by urlhandler.php
        define('AWS_STREAM_FILE', FALSE);

//////////////////
//ERROR HANDLING//
//////////////////
//403 FORBIDDEN APPLICATION
        define('AWS_ERROR_403', "templates/403.xml");
//404 NOT FOUND ERROR APPLICATION
        define('AWS_ERROR_404', "templates/404.xml");

//LOG LAMDA FUNCTIONS TO BE RECORDED - FOR TESTING ONLY, SLOWS DOWN THE APPLICATION
//IF ENABLED SEE THE FILES IN log FOLDER
        define('AWS_DEBUG', FALSE);

        define('AWS_DEBUG_USE_XMS_ERROR_HANDLERS', TRUE);

        define('AWS_LOG_ROTATE_MAX_FILESIZE', 50000);

        define('AWS_DEBUG_ERROR_HANDLERS_DROP_NOTICES', TRUE);

        define('AWS_DEBUG_ERROR_HANDLERS_DROP_WARNINGS', FALSE);

        if (AWS_DEBUG_USE_XMS_ERROR_HANDLERS) {
            set_error_handler('Utils::xmsCaptureErrors');
            set_exception_handler('Utils::xmsCaptureExceptions');
            register_shutdown_function('Utils::xmsCaptureShutdown');
        }

//set to FALSE if you want Xms::appConfig to use
//Xms::TEMPLATE_FILE_SOURCE instead of Xms::name
        define("AWS_APP_CONFIG_USE_APP_NAME", FALSE);

//SEO TOOLS
        define("AWS_SEO_PARSERS_ENABLED", TRUE);

//THE STREAMS TO USE FOR LOGS
        define('XMS_WORKING_FOLDER', __DIR__);
        define('XMS_SERVER_CONSOLE', __DIR__ . DIRECTORY_SEPARATOR . "log" . DIRECTORY_SEPARATOR . ".XMS_SERVER_CONSOLE");
        define('AWS_DEBUG_GLOBAL_FILENAME', __DIR__ . DIRECTORY_SEPARATOR . "log" . DIRECTORY_SEPARATOR . ".GLOBAL.log");
        define('AWS_DEBUG_FILENAME', __DIR__ . DIRECTORY_SEPARATOR . "log" . DIRECTORY_SEPARATOR . "." . session_id() . ".log");
        define('AWS_DEBUGGING_ERRORS_HANDLER', __DIR__ . DIRECTORY_SEPARATOR . "log" . DIRECTORY_SEPARATOR . ".xmsErrors.log");
        define('AWS_DEBUGGING_EXCEPTIONS_HANDLER', __DIR__ . DIRECTORY_SEPARATOR . "log" . DIRECTORY_SEPARATOR . ".xmsExceptions.log");
        define('AWS_DEBUGGING_SHUTDOWN_HANDLER', __DIR__ . DIRECTORY_SEPARATOR . "log" . DIRECTORY_SEPARATOR . ".xmsShutdown.log");
    }

    public function testInstanceAndOutput()
    {
        print "\n";
        print "Testing Xms instance\n";
        $xms = new Xms\Core\Xms(["XMS_INPUT" => "/index.php?use=templates/designer.xml"]);
        $this->assertInstanceOf("Xms\Core\Xms", $xms, "failed");
        $xms->run();

        $out = $xms->get();
        $html = new Xms\Core\Html($out);

        $html("//div[@id='xmlEditorContainer']");
        $this->assertEquals(sizeof($html->results), 0, "failed");

        $html("//script[@src='js/xmleditorlogin.js']");
        $this->assertEquals(sizeof($html->results), 1, "failed");
    }

    public function testRemoteTemplate1()
    {
        print "\n";
        print "Testing remotetemplate 1\n";
        $xms = new Xms\Core\Xms(["XMS_INPUT" => "/index.php?use=test/docs.ex.remotetemplate.1.xml"]);
        $this->assertInstanceOf("Xms\Core\Xms", $xms, "failed");
        $xms->run();

        $out = $xms->get();
        $html = new Xms\Core\Html($out);

        //check if the menu was removed
        $html("//div")->hasClass("NO_MENU", TRUE);
        $this->assertEquals(sizeof($html->results), 1, "failed");

        //check if the sidebar was removed
        $html("//div")->hasClass("NO_SIDEBAR", TRUE);
        $this->assertEquals(sizeof($html->results), 1, "failed");

        //check if styles have been set to point to the remote location
        $html("//link[@rel='stylesheet']/@href")->each(function($el, $ext) {
            $ext[0][] = (FALSE !== strpos($this->value, "http://www.casa-lucan.ro/"));
        }, [&$external]);

        $result = TRUE;

        foreach ($external as $ret)
            if ($ret != TRUE)
                $result = FALSE;

        $this->assertTrue($result, "failed");
    }

    public function testRemoteTemplate2()
    {
        print "\n";
        print "Testing remotetemplate 2\n";

        //load a custom router where we need to set $_GET as we run in cli
        $xms = new Xms\Core\Xms([
            "XMS_INPUT" => "/index.php?use=test/docs.ex.remotetemplate.2.xml&thisone=tarife",
            "XMS_RESOURCE_ROUTER" => "test/router.xml"
        ]);
        $this->assertInstanceOf("Xms\Core\Xms", $xms, "failed");

        $xms->run();

        $out = $xms->get();
        $html = new Xms\Core\Html($out);
        $this->assertEquals($_GET, Array(
            "use" => "test/docs.ex.remotetemplate.2.xml",
            "thisone" => "tarife"), "failed");

        //check if styles and img@src have been set to point to the remote location
        $html("//link[@rel='stylesheet']/@href|//img/@src")->each(function($el, $ext) {
            $ext[0][] = strpos($this->value, "http://");
        }, [&$external]);

        $result = TRUE;
        foreach ($external as $ret)
            if ($ret != FALSE)
                $result = FALSE;

        $this->assertTrue($result, "failed");

        $external["xms"] = &$xms;
        $external["data"] = [];
        //check if anchors have been set to point to the script
        $html("//nav//a/@href")->each(function($el, $ext) {
            $xms = $ext["xms"];
            $ext["data"][] = strpos($this->value, "/?use=" . $xms->TEMPLATE_FILE_SOURCE);
        }, $external);

        $result = TRUE;
        foreach ($external["data"] as $ret)
            if ($ret != 0)
                $result = FALSE;
        $this->assertTrue($result, "failed");

        //check if sapi was set to the page footer and is cli
        $php_SAPI = trim($html("//strong")->hasClass("SAPI")->get(0)->textContent);
        $this->assertEquals($php_SAPI, "cli", "failed");
    }

    public function testCase1()
    {
        print "\n";
        print "Testing case 1\n";

        $xms = new Xms\Core\Xms([
            "XMS_INPUT" => "/index.php?use=test/docs.ex.case.1.xml"
        ]);
        $this->assertInstanceOf("Xms\Core\Xms", $xms, "failed");

        $xms->run();

        $out = $xms->get();
        $html = new Xms\Core\Html($out);

        $html("//div[@class='parentcase']//div[@class='childcase']");
        $this->assertTrue(sizeof($html->results) > 0, "failed");
    }

    public function testCase2()
    {
        print "\n";
        print "Testing case 2\n";

        $xms = new Xms\Core\Xms([
            "XMS_INPUT" => "/index.php?use=test/docs.ex.case.2.xml"
        ]);
        $this->assertInstanceOf("Xms\Core\Xms", $xms, "failed");

        $xms->run();

        $out = $xms->get();
        $html = new Xms\Core\Html($out);

        $this->assertTrue($html("//body")->text() == "DESKTOP", "failed");
    }

    public function testDomiterator1()
    {
        print "\n";
        print "Testing domiterator 1\n";

        $xms = new Xms\Core\Xms([
            "XMS_INPUT" => "/?use=test/docs.ex.domiterator.1.xml"
        ]);
        $this->assertInstanceOf("Xms\Core\Xms", $xms, "failed");

        $xms->run();

        $out = $xms->get();
        $html = new Xms\Core\Html($out);

        //domiterator tabel has at least 2 rows
        $html("//table")->children("node()")->is("tr");
        $this->assertTrue(sizeof($html->results) > 2, "failed");
        $rowsCount = sizeof($html->results);

        $html->children("node()")->is("td")->each(function($el, $ext) {
            $ext[0]["works"][] = $this->getAttribute("works");
        }, [&$external]);

        $content = [];

        //only for the first pair of rows
        for ($i = 0; $i < $rowsCount; $i++) {
            //id=1 id=4
            $s1 = $external["works"][$i];
            $s2 = $external["works"][$i + $rowsCount];
            //[id,1] [id,4]
            $sp1 = explode("=", $s1);
            $sp2 = explode("=", $s2);
            //test
            $this->assertEquals($sp1[0], $sp2[0], "failed");
        }

        //get the first td of each row>1
        $html("//table/tr[position()>1]/td[1]")->each(function($el, $ext) {
            //check for # added in eachnamedreference/id
            $ext[0]["testtd1"][] = FALSE !== strpos($this->textContent, "#");
        }, [&$external]);
        foreach ($external["testtd1"] as $test)
            $this->assertTrue($test);
        
        //get the 2nd td of each row>1 and test for @skip and @append
        $html("//table/tr[position()>1]/td[2]")->each(function($el, $ext) {
            //check for # added in eachnamedreference/id
            $ext[0]["testtd2"][] = FALSE !== strpos($this->textContent, "Name:");
        }, [&$external]);
        foreach ($external["testtd2"] as $test)
            $this->assertTrue($test);

        //get the last td of each row>1 and test for @skip and @prepend
        //by looking for button
        $html("//table/tr[position()>1]/td[4]/button")->each(function($el, $ext) {
            //check if buttons @recordsettest == parent@recordsettest
            $ext[0]["testtd4button"][] = $this->getAttribute("recordsettest") == $this->parentNode->getAttribute("recordsettest");
            //check if sibling text is the one in parent's @works
            $ext[0]["testtd4buttonsibling"][] = [trim(str_replace("position=", "", $this->parentNode->getAttribute("works"))), trim($this->previousSibling->textContent)];
        }, [&$external]);
        foreach ($external["testtd4button"] as $test)
            $this->assertTrue($test);
        foreach ($external["testtd4buttonsibling"] as $test)
            $this->assertEquals($test[0], $test[1]);

        //get the 3rd td and check if normal domiterator operation works: it should replace content: default home changed to location
        $html("//table/tr[position()>1]/td[3]")->each(function($el, $ext) {
            //check if buttons @recordsettest == parent@recordsettest
            $ext[0]["testtd3home"][] = FALSE === strpos($this->textContent, "HOME");
            //check if sibling text is the one in parent's @works
            $ext[0]["testtd3contentinattrworks"][] = trim($this->textContent) == str_replace("location=", "", $this->getAttribute("works"));
        }, [&$external]);
        foreach ($external["testtd3home"] as $test)
            $this->assertTrue($test);
        foreach ($external["testtd3contentinattrworks"] as $test)
            $this->assertTrue($test);

        //check if eachreference works
        $html("//table/tr[position()>1]")->descendants("*[@reference]")->each(function($el, $ext) {
            $ext[0]["testtdeachreference"][] = $this->hasAttribute("works");
        }, [&$external]);
        foreach ($external["testtdeachreference"] as $test)
            $this->assertTrue($test);

        //check if eachnamedreference works for reference=name
        $html("//table/tr[position()>1]")->descendants("*[@reference='name']/@eachnamedreference")->each(function($el, $ext) {
            $ext[0]["testtdeachnamedreferenceforname"][] = $this->value == "WORKS FOR NAME";
        }, [&$external]);
        foreach ($external["testtdeachnamedreferenceforname"] as $test)
            $this->assertTrue($test);
    }

    public function testDomiterator2()
    {
        print "\n";
        print "Testing domiterator 2\n";

        $xms = new Xms\Core\Xms([
            "XMS_INPUT" => "/?use=test/docs.ex.domiterator.2.xml"
        ]);
        $this->assertInstanceOf("Xms\Core\Xms", $xms, "failed");

        $xms->run();

        $out = $xms->get();
        $html = new Xms\Core\Html($out);

        $html("//table/tr")->children("td[1]");
        //create the name of the file and check if it exists
        $html->is("td")->each(function($el, $ext) {
            $sib = new Xms\Core\Xml($this);
            $file = __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . trim($this->textContent) . "." . trim($sib($this->getNodePath())->next("td")->get(0)->textContent);
            $ext[0][] = file_exists($file);
        }, [&$external]);
        foreach ($external as $test)
            $this->assertTrue($test);
    }

    public function testPhppi1()
    {
        print "\n";
        print "Testing php pi 1\n";

        $xms = new Xms\Core\Xms([
            "XMS_INPUT" => "/?use=test/docs.ex.phppi.1.xml"
        ]);
        $this->assertInstanceOf("Xms\Core\Xms", $xms, "failed");

        $xms->run();

        $out = $xms->get();

        $xml = new Xms\Core\Xml($out);
        $this->assertInstanceOf("Xms\Core\Xml", $xml, "failed");

        $test = [
            (sizeof($xml("//root/externalContent")->results) > 0),
            (sizeof($xml("//TEST")->results) > 0),
            (sizeof($xml("//@EXEC_PI_TEST[contains(.,'WORKS')]")->results) > 0)
        ];
        foreach ($test as $t)
            $this->assertTrue($t);
    }

    public function testModRewrite()
    {
        print "\n";
        print "Testing mod rewrite\n";

        $xms = new Xms\Core\Xms([
            "XMS_INPUT" => "/?use=test/docs.ex.mod_rewrite.1.xml"
        ]);
        $this->assertInstanceOf("Xms\Core\Xms", $xms, "failed");

        $xms->run();

        $out = $xms->get();

        $html = new Xms\Core\Html($out);
        $this->assertTrue(sizeof($html("//body[contains(.,'MOD_REWRITE_ENABLED disabled')]")->results) > 0);
    }

    public function testModJsPI()
    {
        print "\n";
        print "Testing mod js pi\n";

        $xms = new Xms\Core\Xms([
            "XMS_INPUT" => "/?use=test/docs.ex.typicalhtml.1.xml"
        ]);
        $this->assertInstanceOf("Xms\Core\Xms", $xms, "failed");

        $xms->run();

        $out = $xms->get();

        $html = new Xms\Core\Html($out);
        $this->assertTrue(sizeof($html("//div/script[contains(.,'console.log(\"SOME OTHER JS\");')]")->results) > 0);
    }

    public function testImport1()
    {
        print "\n";
        print "Testing import 1\n";

        $xms = new Xms\Core\Xms([
            "XMS_INPUT" => "/?use=test/docs.ex.import.1.xml"
        ]);
        $this->assertInstanceOf("Xms\Core\Xms", $xms, "failed");

        $xms->run();

        $out = $xms->get();

        $html = new Xms\Core\Html($out);
        $testEx1to7 = [
            (sizeof($html("//root/externalcontent")->results) > 0),
            (sizeof($html("//test")->results) > 0),
            (sizeof($html("//@exec_pi_test[contains(.,'WORKS')]")->results) > 0),
            (sizeof($html("//fieldset/table//td[contains(.,'Camere')]")->results) > 0),
            (sizeof($html("//li[@remove='from example app']")->results) == 0),
            file_exists(__DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "cache" . DIRECTORY_SEPARATOR . ".descriereLaCerereCacheFile"),
            (sizeof($html("//fieldset[@name='EX7']//fieldset[@id='laCerere']")->results) > 0)
        ];
        foreach ($testEx1to7 as $t)
            $this->assertTrue($t);
    }

    public function testImport2()
    {
        print "\n";
        print "Testing import 2\n";

        $xms = new Xms\Core\Xms([
            "XMS_INPUT" => "/?use=test/docs.ex.import.2.xml"
        ]);
        $this->assertInstanceOf("Xms\Core\Xms", $xms, "failed");

        $xms->run();

        $out = $xms->get();

        $html = new Xms\Core\Html($out);
        $testEx1to7 = [
            (sizeof($html("//root/externalcontent")->results) > 0),
            (sizeof($html("//test")->results) > 0),
            (sizeof($html("//@exec_pi_test[contains(.,'WORKS')]")->results) > 0),
            (sizeof($html("//fieldset/table//td[contains(.,'Camere')]")->results) > 0),
            (sizeof($html("//li[@remove='from example app']")->results) == 0),
            file_exists(__DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "cache" . DIRECTORY_SEPARATOR . ".descriereLaCerereCacheFile"),
            (sizeof($html("//fieldset[@name='EX6']//fieldset[@id='laCerere']")->results) > 0)
        ];

        foreach ($testEx1to7 as $t)
            $this->assertTrue($t);
    }

    public function testImport3Invokable()
    {
        print "\n";
        print "Testing import 3\n";

        $xms = new Xms\Core\Xms([
            "XMS_INPUT" => "/?use=test/docs.ex.import.3.xml"
        ]);
        $this->assertInstanceOf("Xms\Core\Xms", $xms, "failed");

        $xms->run();

        $out = $xms->get();

        $html = new Xms\Core\Html($out);
        $testEx1to7 = [
            (sizeof($html("//root/externalcontent")->results) > 0),
            (sizeof($html("//test")->results) > 0),
            (sizeof($html("//@exec_pi_test[contains(.,'WORKS')]")->results) > 0),
            (sizeof($html("//fieldset/table//td[contains(.,'Camere')]")->results) > 0),
            (sizeof($html("//li[@remove='from example app']")->results) == 0),
            file_exists(__DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "cache" . DIRECTORY_SEPARATOR . ".descriereLaCerereCacheFile"),
            (sizeof($html("//fieldset[@name='EX6']//fieldset[@id='laCerere']")->results) > 0)
        ];
        foreach ($testEx1to7 as $t)
            $this->assertTrue($t);
    }

    public function testInitDirective()
    {
        print "\n";
        print "Testing init 1\n";

        $xms = new Xms\Core\Xms([
            "XMS_INPUT" => "/?use=test/docs.ex.init.1.xml"
        ]);
        $this->assertInstanceOf("Xms\Core\Xms", $xms, "failed");

        $xms->run();

        $out = $xms->get();

        $html = new Xms\Core\Html($out);
        //testing if what we generated inside init is found in the output
        $test = [
            (sizeof($html("//text()[contains(.,'" . $GLOBALS["APPINIT"]["INIT_DIRECTIVE1"] . "')]")->results) > 0),
            (sizeof($html("//text()[contains(.,'" . $xms->INIT_DIRECTIVE2 . "')]")->results) > 0)
        ];
        foreach ($test as $t)
            $this->assertTrue($t);
    }

    public function testParsersApp()
    {
        print "\n";
        print "Testing app parsers\n";

        $xms = new Xms\Core\Xms([
            "XMS_INPUT" => "/?use=test/docs.ex.parsers.app.1.xml"
        ]);
        $this->assertInstanceOf("Xms\Core\Xms", $xms, "failed");

        $xms->run();

        $out = $xms->get();

        $xml = new Xms\Core\Xml($out);
        //testing if what we generated inside init is found in the output
        $test = [
            (sizeof($xml("//div[@id='footer']/text()[contains(.,'" . get_class($xms) . " " . Xms\Core\Xms::VERSION . "')]")->results) > 0)
        ];
        foreach ($test as $t)
            $this->assertTrue($t);
    }

    public function testUse1()
    {
        print "\n";
        print "Testing use 1\n";

        $xms = new Xms\Core\Xms([
            "XMS_INPUT" => "/index.php?use=test/docs.ex.use.1.xml"
        ]);
        $this->assertInstanceOf("Xms\Core\Xms", $xms, "failed");

        $xms->run();

        $out = $xms->get();
        $xml = new Xms\Core\Xml($out);

        $xml("//div[@class='parentcase']//div[@class='childcase']");
        $this->assertTrue(sizeof($xml->results) > 0, "failed");

        $xml("//text()[contains(.,'YOU SHOULD NOT SEE THIS')]");
        $this->assertTrue(sizeof($xml->results) == 0, "failed");
    }

    public function testXpath1()
    {
        print "\n";
        print "Testing xpath 1\n";

        $xms = new Xms\Core\Xms([
            "XMS_INPUT" => "/?use=test/docs.ex.xpath.1.xml"
        ]);
        $this->assertInstanceOf("Xms\Core\Xms", $xms, "failed");

        $xms->run();

        $out = $xms->get();

        $xml = new Xms\Core\Xml($out);

        $test = [
            (sizeof($xml("//p/text()[contains(.,'TEST')]")->results) > 0),
            (sizeof($xml("//em/text()[contains(.,'XPATH FILTER')]")->results) > 0)
        ];
        foreach ($test as $t)
            $this->assertTrue($t);
    }

    public function testGlobalParsers()
    {
        print "\n";
        print "Testing global parsers\n";

        $xms = new Xms\Core\Xms([
            "XMS_INPUT" => "/?use=test/doc.ex.global.parsers.1.xml",
            "XMS_RESOURCE_CONFIG" => __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "config.xml",
            "XMS_RESOURCE_PARSERS" => __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "parsers.xml"
        ]);
        $this->assertInstanceOf("Xms\Core\Xms", $xms, "failed");

        $xms->run();

        $out = $xms->get();

        $xml = new Xms\Core\Html($out);

        $test = [
            trim($xml("//title")->text()) == "Demo global parsers"
        ];
        foreach ($test as $t)
            $this->assertTrue($t);
    }

    public function testExecutionOrder()
    {
        print "\n";
        print "Testing global parsers\n";

        $xms = new Xms\Core\Xms([
            "XMS_INPUT" => "/?use=test/docs.ex.execution.order.1.xml"
        ]);
        $xms->bind("change", "EXECUTION_ORDER", function($n, $o) {
            $GLOBALS["EXECUTION_ORDER"][] = $n;
        });
        $this->assertInstanceOf("Xms\Core\Xms", $xms, "failed");

        $xms->run();

        $out = $xms->get();

        $xml = new Xms\Core\Html($out);
        $this->assertEquals($GLOBALS["EXECUTION_ORDER"], array(
            0 => '/client/content/div',
            1 => '/client/content/div/div',
            2 => '/client/content/div/div/div',
            3 => '/client/content/div/div/div/div',
            4 => '/client/content/div/div/div/div/strong',
            5 => '/client/content/strong'
        ));
    }

    public function testDirectiveDFOrder()
    {
        print "\n";
        print "Testing directive document fragment return order\n";

        $xms = new Xms\Core\Xms([
            "XMS_INPUT" => "/?use=test/docs.ex.directive.df.order.1.xml"
        ]);

        $xms->run();

        $out = $xms->get();

        $html = new Xms\Core\Html($out);
        $html("//*")->hasClass("case")->each(function($el, $ext) {
            $ext[0][] = $this->nodeName;
        }, [&$extCase]);
        $this->assertEquals($extCase, ["div", "span"]);

        $html("//*")->hasClass("phppi")->each(function($el, $ext) {
            $ext[0][] = $this->nodeName;
        }, [&$extPi]);
        $this->assertEquals($extPi, ["div", "span"]);

        $html("//*")->hasClass("localimport")->each(function($el, $ext) {
            $ext[0][] = $this->nodeName;
        }, [&$extImport]);
        $this->assertEquals($extImport, ["div", "span"]);
    }
}
