<?php

class XmsXmlTest extends PHPUnit_Framework_TestCase
{

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
        $a = new Xms\Core\XmsXml($c);
        $this->assertInstanceOf("Xms\Core\XmsXml", $a, "failed");

        $a("//processing-instruction()[1]");

        print "Testing Xpath query\n";
        $this->assertInstanceOf("DOMProcessingInstruction", $a->get(0), "failed");

        print "Testing XmsXml->doc instance\n";
        $this->assertInstanceOf("Xms\Core\XmsDomDocument", $a->doc, "failed");

        print "Testing setContext and getContext\n";
        $a("//header[1]");
        $a->setContext($a->get(0));
        $this->assertTrue($a->getContext() instanceof Xms\Core\XmsDomElement, "failed");

        print "Testing xpath query against the new context\n";
        $this->assertTrue($a("title")->get(0) instanceof Xms\Core\XmsDomElement, "failed");
    }

    /**
     * @covers EventHandlerPredefinedMethods::topmost
     * @covers EventHandlerPredefinedMethods::closest
     */
    public function testTopmostAndClosest()
    {

        print "\n";
        $c = file_get_contents("templates/designer.xml");
        $a = new Xms\Core\XmsXml($c);
        $a->parentNode = new Xms\Core\SmartObject();
        $a->parentNode->childNodes[] = $a;
        print "Testing topmost instance of Xms\Core\SmartObject\n";
        $this->assertInstanceOf("Xms\Core\SmartObject", $a("//case")->get(0)->topmost(), "failed");

        print "Testing closest instance of Xms\Core\XmsXml\n";
        $this->assertInstanceOf("Xms\Core\XmsXml", $a->get(0)->closest(), "failed");
    }

    /**
     * @covers XmsOverload::bind("change",...)
     */
    public function testPropertyBinding()
    {
        print "\n";
        $c = file_get_contents("templates/designer.xml");
        $a = new Xms\Core\XmsXml($c);
        $a->parentNode = new Xms\Core\SmartObject();
        $a->parentNode->childNodes[] = $a;

        $a->parentNode->iKnowMyChild = [];
        $a->parentNode->bind("change", "iKnowMyChild", function() {
            print "GOOD BOY!\n";
        });

        print "Testing property binding\n";
        $a->bind("change", "testProperty", function($newValue, $oldValue) {
            $this->parentNode->iKnowMyChild = ["new" => $newValue, "old" => $oldValue];
            $this->callbackAlwaysBoundTo = get_class($this);
        });
        $a->testProperty = rand();
//test if property was trasnfered to parent
        $this->assertTrue($a->testProperty == $a->parentNode->iKnowMyChild["new"], "failed");
//test if new value is not the old value
        $this->assertFalse($a->testProperty == $a->parentNode->iKnowMyChild["old"], "failed");
//test if the closure was bound to our instance
        $this->assertInstanceOf($a->callbackAlwaysBoundTo, $a, "failed");
    }

    /**
     * @covers XmsOverload::bind("before",...)
     * @covers XmsOverload::bind("after",...)
     */
    public function testMethodBinding()
    {
        print "\n";
        $c = file_get_contents("templates/designer.xml");
        $a = new Xms\Core\XmsXml($c);
        $a->parentNode = new Xms\Core\SmartObject();
        $a->parentNode->childNodes[] = $a;

        print "Testing method binding\n";
        $a->testMethod = function() {
            return get_class($this);
        };
        $a->bind("before", "testMethod", function() {
            $this->parentNode->beforeTestMethod = get_class($this);
        });
        $a->bind("after", "testMethod", function() {
            $this->parentNode->afterTestMethod = get_class($this);
        });
//test if the closure was bound to our instance
        $this->assertInstanceOf($a->testMethod(), $a, "failed");
//test if parent was notified on the execution
        $this->assertInstanceOf($a->parentNode->beforeTestMethod, $a, "failed");
        $this->assertInstanceOf($a->parentNode->afterTestMethod, $a, "failed");
    }

    /**
     * @covers XmsOverload::unbindAll("change",...)
     */
    public function testUnbindAll_testProperty()
    {
        print "\n";
        $c = file_get_contents("templates/designer.xml");
        $a = new Xms\Core\XmsXml($c);
        $a->parentNode = new Xms\Core\SmartObject();
        $a->parentNode->childNodes[] = $a;

        $a->parentNode->iKnowMyChild = [];
        $onChange = $a->parentNode->bind("change", "iKnowMyChild", function() {
            print "GOOD BOY!\n";
        });

        print "Testing property unbindAll\n";
        $a->bind("change", "testProperty", function($newValue, $oldValue) {
            $this->parentNode->iKnowMyChild = ["new" => $newValue, "old" => $oldValue];
            $this->callbackAlwaysBoundTo = get_class($this);
        });
        $a->testProperty = rand();
//test if property was trasnfered to parent
        $this->assertTrue($a->testProperty == $a->parentNode->iKnowMyChild["new"], "failed");
//test if new value is not the old value
        $this->assertFalse($a->testProperty == $a->parentNode->iKnowMyChild["old"], "failed");
//test if the closure was bound to our instance
        $this->assertInstanceOf($a->callbackAlwaysBoundTo, $a, "failed");

        $a->unbindAll("change", "testProperty", $onChange);
        $a->testProperty = "other value";
//test if property was trasnfered to parent
        $this->assertFalse($a->testProperty == $a->parentNode->iKnowMyChild["new"], "failed");
    }

    /**
     * @covers XmsOverload::unbindAll("before",...)
     */
    public function testUnbindAll_testMethod()
    {
        print "\n";
        $c = file_get_contents("templates/designer.xml");
        $a = new Xms\Core\XmsXml($c);
        $a->parentNode = new Xms\Core\SmartObject();
        $a->parentNode->childNodes[] = $a;

        print "Testing method unbindAll\n";
        $a->testMethod = function($value) {
            return get_class($this);
        };
        $a->bind("before", "testMethod", function($value) {
            $this->parentNode->beforeTestMethod = "before" . $value;
        });
        $a->bind("after", "testMethod", function($value) {
            $this->parentNode->afterTestMethod = "after" . $value;
        });
//test if the closure was bound to our instance
        $this->assertInstanceOf($a->testMethod("TEST"), $a, "failed");
//test if parent was notified on the execution
        $this->assertTrue($a->parentNode->beforeTestMethod == "beforeTEST", "failed");
        $this->assertTrue($a->parentNode->afterTestMethod == "afterTEST", "failed");

        $a->unbindAll("before", "testMethod");
        $a->testMethod("ANOTHER_TEST");
        $this->assertFalse($a->parentNode->beforeTestMethod == "beforeANOTHER_TEST", "failed");
        $this->assertTrue($a->parentNode->afterTestMethod == "afterANOTHER_TEST", "failed");
    }

    /**
     * @covers XmsOverload::unbind("before",...)
     * @covers XmsOverload::unbind("after",...)
     */
    public function testUnbind_testMethod()
    {
        print "\n";
        $c = file_get_contents("templates/designer.xml");
        $a = new Xms\Core\XmsXml($c);
        $a->parentNode = new Xms\Core\SmartObject();
        $a->parentNode->childNodes[] = $a;

        print "Testing method unbindAll\n";
        $a->testMethod = function($value) {
            return get_class($this);
        };
        $onBefore = $a->bind("before", "testMethod", function($value) {
            $this->parentNode->beforeTestMethod = "before" . $value;
        });
        $onAfter = $a->bind("after", "testMethod", function($value) {
            $this->parentNode->afterTestMethod = "after" . $value;
        });
//test if the closure was bound to our instance
        $this->assertInstanceOf($a->testMethod("TEST"), $a, "failed");
//test if parent was notified on the execution
        $this->assertTrue($a->parentNode->beforeTestMethod == "beforeTEST", "failed");
        $this->assertTrue($a->parentNode->afterTestMethod == "afterTEST", "failed");

        $a->unbind("before", "testMethod", $onBefore);
        $a->unbind("after", "testMethod", $onAfter);
        $a->testMethod("ANOTHER_TEST");
        $this->assertFalse($a->parentNode->beforeTestMethod == "beforeANOTHER_TEST", "failed");
        $this->assertFalse($a->parentNode->afterTestMethod == "afterANOTHER_TEST", "failed");
    }

    /**
     * @covers EventHandlerPredefinedMethods::on()
     * @covers EventHandlerPredefinedMethods::trigger()
     * @covers XmsOverload::pushTo
     */
    public function testEventsBasic()
    {
        print "\n";
        print "Testing event basic features\n";
        $c = file_get_contents("templates/designer.xml");
        $a = new Xms\Core\XmsXml($c);
        $a->childMessages = [];

        //when we receive a message we want to save it here
        $a->notifiedByChild = function($message) {
            $this->notification = $message;
        };

        //when there is a change of notification property
        //save it to a stack for later use
        $a->bind("change", "notification", function($n, $o) {
            $this->pushTo("childMessages", $this->notification);
        });

        //attach an event listener to header element
        $a("//header")->get(0)->on("notifyTopmost", function($evt) {
            //this is the DOMElement
            //$evt is our event instance
            $this->topmost()->notifiedByChild($this->getNodePath());
        });

        $a->get(0)->on("after", "notifyTopmost", function($evt) {
            //$evt === $this
        });

        //attach an event listener to content element using elements method to access results directly
        $a("//content")->elements("on", ["notifyTopmost", function($evt) {
                //this is the DOMElement
                //$evt is our event instance

                $this->topmost()->notifiedByChild($this->getNodePath());
            }]);

        //trigger the event on content element towards parents (default)
        $a->get(0)->trigger("notifyTopmost");

        //trigger the event top object element towards all its childs
        //and keep event in a variable to get some data of where it's been
        $event = $a->trigger("notifyTopmost", [], Xms\Core\XmsEvent::BUBBLE_CHILDS);

        $this->assertTrue($a->childMessages == ["/app/client/content", "/app/client/header", "/app/client/content"]);
    }

    /**
     * @covers EventHandlerPredefinedMethods::on()
     * @covers EventHandlerPredefinedMethods::trigger()
     * @covers XmsOverload::pushTo
     * @covers XmsDomEvent::currentTarget()
     * @covers XmsDomEvent::stopPropagation()
     */
    public function testEventsAdvanced()
    {
        print "\n";
        print "Testing event advanced features\n";
        $c = file_get_contents("templates/designer.xml");
        $a = new Xms\Core\XmsXml($c);
        $a->childMessages = [];

        //when we receive a message we want to save it here
        $a->notifiedByChild = function($message) {
            $this->notification = $message;
        };

        //when there is a change of notification property
        //save it to a stack for later use
        $a->bind("change", "notification", function($n, $o) {
            $this->pushTo("childMessages", $this->notification);
        });

        //attach an event listener to case element
        //but stop propagation so case won't ever intercept it
        $a("//case")->get(0)->on("notifyTopmost", function($evt) {
            //this is the DOMElement
            //$evt is our event instance
            $this->topmost()->notifiedByChild($this->getNodePath());
        });

        //attach an event listener to header element
        $a("//header")->get(0)->on("notifyTopmost", function($evt) {
            //this is the DOMElement
            //$evt is our event instance
            $this->topmost()->notifiedByChild($this->getNodePath());
        });

        $a->get(0)->on("after", "notifyTopmost", function($evt) {
            //$evt === $this
            $evt->data["recorder"][] = $evt->currentTarget()->getNodePath();
        });

        //attach an event listener to content element using elements method to access results directly
        $a("//content")->elements("on", ["notifyTopmost", function($evt) {
                //this is the DOMElement
                //$evt is our event instance
                $evt->stopPropagation();
                //stop propagation so case won't ever intercept it

                $evt->data["recorder"][] = $this->getNodePath();
                $this->topmost()->notifiedByChild($this->getNodePath());
            }]);

        //trigger the event on content element towards parents (default)
        $a->get(0)->trigger("notifyTopmost");

        //trigger the event top object element towards all its childs
        //and keep event in a variable to get some data of where it's been
        $event = $a->trigger("notifyTopmost", [], Xms\Core\XmsEvent::BUBBLE_CHILDS);

        $this->assertTrue($a->childMessages == ["/app/client/content", "/app/client/header", "/app/client/content"]);
        $this->assertTrue($event->data["recorder"] == ["/app/client/header", "/app/client/content"]);
    }

    /**
     * @covers EventHandlerPredefinedMethods::on()
     * @covers EventHandlerPredefinedMethods::trigger()
     * @covers XmsDomEvent::currentTarget()
     */
    public function testEventWithData()
    {
        print "\n";
        print "Testing event with data\n";
        $c = file_get_contents("templates/designer.xml");
        $a = new Xms\Core\XmsXml($c);

        //attach an event listener to all XmsDomElements
        $a("//*")->elements("on", ["notifyAllChilds", function($evt) {
                //this is the DOMElement
                //$evt is our event instance
                $evt->currentTarget()->setAttribute($evt->data["name"], $evt->data["value"]);
            }]);

        $a->trigger("notifyAllChilds", ["name" => "someattr", "value" => rand()], Xms\Core\XmsEvent::BUBBLE_CHILDS);

        $a->each(function($el, $rec) {
            //record current to $extRecorder
            if ($this->hasAttribute("someattr"))
                $rec[0][$this->getNodePath()] = TRUE;
            else
                $rec[0][$this->getNodePath()] = FALSE;

            //record current to $extRecorderAsItShouldBe
            $rec[1][$this->getNodePath()] = TRUE;
        }, [&$extRecorder, &$extRecorderAsItShouldBe]);

        $this->assertEquals($extRecorder, $extRecorderAsItShouldBe);
    }

    /**
     * @covers EventHandlerPredefinedMethods::detachEventHandler()
     */
    public function testDetachEventHandler()
    {
        print "\n";
        print "Testing detachEventHandler\n";
        $c = file_get_contents("templates/designer.xml");
        $a = new Xms\Core\XmsXml($c);

        //attach an event listener to all XmsDomElements
        $a("//*")->elements("on", ["notifyAllChilds", function($evt) {
                //this is the DOMElement
                //$evt is our event instance
                $evt->currentTarget()->setAttribute($evt->data["name"], $evt->data["value"]);
            }]);

        $a("//client")->elements("detachEventHandler", ["notifyAllChilds"]);

        $a->trigger("notifyAllChilds", ["name" => "someattr", "value" => rand()], Xms\Core\XmsEvent::BUBBLE_CHILDS);



        $a("//*")->each(function($el, $rec) {
            //record current to $extRecorder
            if ($this->hasAttribute("someattr"))
                $rec[0][$this->getNodePath()] = TRUE;
            else
                $rec[0][$this->getNodePath()] = FALSE;

            //record current to $extRecorderAsItShouldBe
            $rec[1][$this->getNodePath()] = TRUE;
        }, [&$extRecorder, &$extRecorderAsItShouldBe]);

        $this->assertNotEquals($extRecorder, $extRecorderAsItShouldBe);
        $this->assertFalse($extRecorder["/app/client"]);
    }

    /**
     * @covers EventHandlerPredefinedMethods::detachAllEventHandlers()
     */
    public function testDetachAllEventHandlers()
    {
        print "\n";
        print "Testing detachAllEventHandlers\n";
        $c = file_get_contents("templates/designer.xml");
        $a = new Xms\Core\XmsXml($c);

        //attach an event listener to all XmsDomElements
        $a("//*")->elements("on", ["notifyAllChilds", function($evt) {
                //this is the DOMElement
                //$evt is our event instance
                $evt->currentTarget()->setAttribute($evt->data["name"], $evt->data["value"]);
            }]);

        $a("//client")->elements("detachAllEventHandlers", ["notifyAllChilds"]);

        $a->trigger("notifyAllChilds", ["name" => "someattr", "value" => rand()], Xms\Core\XmsEvent::BUBBLE_CHILDS);

        $a("//*")->each(function($el, $rec) {
            //record current to $extRecorder
            if ($this->hasAttribute("someattr"))
                $rec[0][$this->getNodePath()] = TRUE;
            else
                $rec[0][$this->getNodePath()] = FALSE;

            //record current to $extRecorderAsItShouldBe
            $rec[1][$this->getNodePath()] = TRUE;
        }, [&$extRecorder, &$extRecorderAsItShouldBe]);

        $this->assertNotEquals($extRecorder, $extRecorderAsItShouldBe);
        $this->assertFalse($extRecorder["/app/client"]);
    }
}
