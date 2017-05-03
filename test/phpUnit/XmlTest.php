<?php

class XmlTest extends PHPUnit\Framework\TestCase
{

    protected $XmlInstance;

    public function setUp()
    {
        if (!defined("AWS_DEBUG"))
            define('AWS_DEBUG', FALSE);
    }

    public function testInstanceAndQuery()
    {
        print "\n";
        $c = file_get_contents("templates/designer.xml");
        print "Testing Xpath query\n";
        $this->XmlInstance = $a = new Xms\Core\Xml($c);
        $this->assertInstanceOf("Xms\Core\Xml", $this->XmlInstance, "failed");

        $a("//processing-instruction()[1]");

        print "Testing Xpath query\n";
        $this->assertInstanceOf("DOMProcessingInstruction", $a->get(0), "failed");

        print "Testing setContext and getContext\n";
        $a("//header[1]");
        $a->setContext($a->get(0));
        $this->assertTrue($a->getContext() instanceof DOMElement, "failed");

        print "Testing xpath query against the new context\n";
        $this->assertTrue($a("title")->get(0) instanceof DOMElement, "failed");
    }

    public function testXmlClone()
    {
        print "\n";
        $c = file_get_contents("templates/designer.xml");
        print "Creating a new instance\n";
        $this->XmlInstance = new Xms\Core\Xml($c);
        $this->XmlInstance->q("//header[1]");
        $this->XmlInstance->setContext($this->XmlInstance->get(0));
        print "Cloning\n";
        $a = clone $this->XmlInstance;
        $this->assertInstanceOf("Xms\Core\Xml", $a, "failed");
        print "Testing new context is null\n";
        $this->assertNull($this->XmlInstance->getContext(), "failed");
    }

    public function testCommonXmlCoreMethods()
    {
        print "\n";
        $c = file_get_contents("templates/designer.xml");
        print "Testing Xpath query\n";
        $a = new Xms\Core\Xml($c);
        $this->assertInstanceOf("Xms\Core\Xml", $a, "failed");

        print "Testing each and transfer by reference\n";
        $a->q("//header")->each(function($el, $optParam) {
            $optParam["a"][] = $el->nodeName;
            $optParam["a"][] = $this->nodeName;
            $optParam["a"][] = $optParam["val"];
        }, ["a" => &$array, "val" => 10]);

        $this->assertEquals($array[0], $array[1], "failed");
        $this->assertInternalType("integer", $array[2], "failed");

        print "Testing all method\n";
        $a->all(function($results, $a) {
            //$this is our Xml object
            $a["external"] = $this->get(0)->nodeName;
        }, ["external" => &$ext]);
        $this->assertEquals($ext, "header", "failed");

        print "Testing filter method\n";
        $a->setContext($a->get(0))->q("node()")->filter(function($el, $opt) {
            //$this is our Xml object
            if ($el->nodeType == 1) {
                //get Only DOMElements
                $opt["external"][] = $el;
                $opt["externalString"].=$el->nodeName . "\n";
                return TRUE;
            }
        }, ["external" => &$ext1, "externalString" => &$extS]);
        $this->assertEquals($ext1, $a->results, "failed");

        print "Testing find method\n";
        $a("//header");
        $a->find("title", function($el, $context, $opt) {
            //$this == $el and is each node found in $context which is our header element
            $opt["external"].=$this->nodeName . " found in " . $context->nodeName;
        }, ["external" => &$extString]);
        $this->assertEquals($extString, "title found in header", "failed");

        print "Testing has method\n";
        $header = $a->has("title");
        $this->assertEquals($header[0]->nodeName, "header", "failed");
        $a->has("title", TRUE);
        $this->assertEquals($a->get(0)->nodeName, "title", "failed");

        print "Testing add method\n";
        $a->add("//load[@src='js/xmlEditor.js']")->each(function($el, $out) {
            $out["ext"].=$this->nodeName . " ";
        }, ["ext" => &$outString]);
        $this->assertEquals(trim($outString), "title load", "failed");
    }

    public function testFilterMethods()
    {
        print "\n";
        $c = file_get_contents("templates/designer.xml");
        $a = new Xms\Core\Xml($c);
        $a->q("/app");
        print "Testing descendantsAndSelf method\n";
        print "Since the similar, methods: parents, childern, preceding, next,... work the same I assume they work as well\n";

        $a->descendantsAndSelf("*", function($el, $context, $opt) {
            $opt["ext"][] = $this;
        }, ["ext" => &$els1]);
        $a->descendantsAndSelf("*")->each(function($el, $opt) {
            $opt["ext"][] = $this;
        }, ["ext" => &$els2]);

        $this->assertEquals($els1, $a->results, "failed");
        $this->assertEquals($els1, $els2, "failed");
    }

    public function testPropMethod()
    {
        print "\n";
        $c = file_get_contents("templates/designer.xml");
        $a = new Xms\Core\Xml($c);
        print "Testing prop method\n";
        $a->q("//processing-instruction()[1]")->prop("data", "SOME DATA");
        $this->assertEquals("SOME DATA", $a->get(0)->data, "failed");
    }

    public function testClassMethods()
    {
        print "\n";
        $c = file_get_contents("templates/designer.xml");
        $a = new Xms\Core\Xml($c);
        print "Testing class methods\n";
        $a->q("//client")->addClass("TEST");
        $this->assertTrue((boolean) (sizeof($a->hasClass("TEST")->results)), "failed");

        $a->q("//client")->addClass("TOREMOVE");
        $a->removeClass("TOREMOVE", ",");
        $this->assertTrue(!(boolean) (sizeof($a->hasClass("TOREMOVE")->results)), "failed");
    }

    public function testAttributesMethods()
    {
        print "\n";
        $c = file_get_contents("templates/designer.xml");
        $a = new Xms\Core\Xml($c);
        print "Testing attr, removeAttr and removeAttributes\n";
        $a->q("//client")->attr("TEST", "VALUE")->attr("TEST1", "VALUE1");
        $this->assertTrue($a->get(0)->getAttribute("TEST") == "VALUE", "failed");
        $a->removeAttr("TEST");
        $this->assertFalse($a->get(0)->hasAttribute("TEST"), "failed");
        $a->removeAttributes();
        $this->assertFalse($a->get(0)->hasAttribute("TEST1"), "failed");
    }

    public function testNormalizedInput()
    {
        print "\n";
        $c = file_get_contents("templates/designer.xml");
        $a = new Xms\Core\Xml($c);
        print "Testing normalizeOperationsInput method\n";
        $a->q("//app");
        $i1 = $a->normalizeOperationsInput("<TEST/>");
        //add a documentFragment
        $i1 = array_merge($i1, $a->normalizeOperationsInput($a->get(0)->getElementsByTagName("case")));
        //add a DOMNodeList
        $i1 = array_merge($i1, $a->normalizeOperationsInput($a->get(0)->getAttributeNode("outputxsl")));
        //add a dom attribute
        $i1 = array_merge($i1, $a->normalizeOperationsInput($a->children("*")->results));
        //add an array of elements

        $out = [11 => 0, 1 => 0, 2 => 0];

        foreach ($i1 as $c) {
            //count by node type
            $out[$c->nodeType]+=1;
        };

        $out[$i1[0]->firstChild->nodeType]+=1;
        //count the TEST child element of our DF
        //we now should have an array of 5 DOMElements, 1 DOMAttribute and 1 DocumentFragment
        $this->assertTrue($out[11] == 1, "failed creating the document fragment");
        $this->assertTrue($out[1] == 5, "failed not all DOMElements");
        $this->assertTrue($out[2] == 1, "failed DOMAttribute not found");
    }

    public function testBulkOps()
    {
        print "\n";
        print "Testing append, prepend, before, after\n";
        $c = "<root/>";
        $a = new Xms\Core\Xml($c);
        $a("/root")->append("<TARGET/>");
        $a("//TARGET")->before("<before/>")->after($a->doc->createElement("after"))->append("<append/>")->prepend("<prepend/>");
        $this->assertEquals($a("/root")->xml(), "<root><before></before><TARGET><prepend></prepend><append></append></TARGET><after></after></root>", "failed");

        $a = new Xms\Core\Xml;
        $c = "<r><EXTERNAL/>TEXT<?PI some instructions?><CONTENT/></r>";
        $b = new Xms\Core\Xml($c);
        $b->q("/r/node()");
        $a->doc->appendChild($a->doc->createElement("root"));
        $a("/root")->append("<TARGET/>");
        $a("//TARGET")->before("<before/>")->after("<after/>")->append("<append/>")->prepend("<prepend/>")->prepend($b->results);
        $this->assertEquals($a("/root")->xml(), "<root><before></before><TARGET><CONTENT></CONTENT><?PI some instructions?>TEXT<EXTERNAL></EXTERNAL><prepend></prepend><append></append></TARGET><after></after></root>", "failed");
    }

    public function testReplaceRemoveOps()
    {
        print "\n";
        print "Testing replace, replaceContent, remove, removeChilds\n";
        $c = "<root/>";
        $a = new Xms\Core\Xml($c);
        $a("/root")->append("<TARGET/>");
        $a("//TARGET")->before("<before/>")->after("<after/>")->append("<append/>")->prepend("<prepend/>")->before("<TOREPLACE/>")->after("<TOREMOVE/>");
        $a("//TOREMOVE")->remove()->q("//TOREPLACE")->replace("REPLACED");
        $a("//TARGET")->replaceContent("REPLACED <TOO/>")->removeChilds();
        $this->assertEquals($a("/root")->xml(), "<root><before></before>REPLACED<TARGET></TARGET><after></after></root>", "failed");
    }

    public function testElements()
    {
        print "\n";
        $c = file_get_contents("templates/designer.xml");
        $a = new Xms\Core\Xml($c);
        print "Testing elements method\n";
        $a->q("//client")->elements("setAttribute", ["ELEMENTS", "WORKS"]);
        $this->assertTrue($a->get(0)->getAttribute("ELEMENTS") == "WORKS", "failed");
    }

    public function testOutputMethods()
    {
        print "\n";
        print "Testing xml, resultsAsSource, resultsAsDocumentFragment\n";
        $c = "<r>TEXT<?PI some instructions?><content/></r>";
        $a = new Xms\Core\Xml($c);
        $a->q("//node()");
        $o1 = $a->xml();
        $o2 = $a->resultsAsSource();
        $this->assertEquals($o1, "<r>TEXT<?PI some instructions?><content></content></r>TEXT<?PI some instructions?>\n<content></content>", "failed");
        $this->assertEquals($o2, "<r>TEXT<?PI some instructions?><content></content></r><content></content>", "failed");
    }

    public function testReturnByReference()
    {
        print "\n";
        print "Testing to method\n";
        $c = file_get_contents("templates/designer.xml");
        $a = new Xms\Core\Xml($c);
        print "Testing prop method\n";
        $a->q("//processing-instruction()[1]")->to($data);
        $a("//client");
        $this->assertInstanceOf("DOMProcessingInstruction", $data[0], "failed");
        $this->assertFalse($data[0]->nodeType == $a->get(0)->nodeType);
    }

    public function testRemaining()
    {
        print "\n";
        print "Testing text, first, last, getRootElement\n";
        $c = "<r>TEXT<?PI some instructions?><content/></r>";
        $a = new Xms\Core\Xml($c);
        $a("//content")->text("SOME TEXT");
        $this->assertEquals($a->text(), "SOME TEXT");
        $this->assertEquals($a->getRootElement()->nodeName, "r");
        $a("//node()");
        $this->assertEquals($a->first()->nodeName, "r");
        $this->assertEquals($a->last()->nodeType, 3);
    }

    public function testGet()
    {
        print "\n";
        print "Testing get method\n";
        $c = file_get_contents("templates/designer.xml");
        $a = new Xms\Core\Xml($c);
        $a("//client")->get(0, function(&$el, $results, $ext) {
            $ext[0][] = $this->nodeName;
        }, [&$rec])->q("//header")->get(0, function(&$el, $results, $ext) {
            $ext[0][] = $this->nodeName;
        }, [&$rec]);

        $this->assertEquals($rec, ["client", "header"], "failed");

        $client = $a("//client")->get(0);
        $this->assertEquals($client->nodeName, "client", "failed");
    }

    public function testElementsSequence()
    {
        print "\n";
        print "Testing Utils::createElementsSequence\n";
        $c = '<app><client/></app>';
        $a = new Xms\Core\Xml($c);
        $app = $a("/app")->get(0);

        Xms\Core\Utils::createElementsSequence("client/header/link", $app);
        Xms\Core\Utils::createElementsSequence("TEST/client/header/link", $app);

        $this->assertEquals($app->C14N(), '<app><client><header><link></link></header></client><TEST><client><header><link></link></header></client></TEST></app>');
    }
}
