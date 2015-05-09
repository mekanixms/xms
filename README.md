### Xms

Xms is a php content management framework using xml as web application support. It provides an event based DOM infrastructure as well as observable methods and properties.

Why xml? Easy, is fast, reliable and everywhere...

Since it is a CM framework, *Xms defines* **case** and **import** *directives* to use on the client in order *to manage the source code*, which can be imported from *local or remote resources*.

*To execute php code Xms provides* the php processing instruction *<?php myFunction();?>* - looks familiar? So, what about this?
Well, the beauty is that *with Xms you can access the DOM directly* meaning above can do 
```php
<?php
	$el->setAttribute("myAttribute","someVal");
	$el->trigger("anEvent");
	$el->on("someEvent",function($evt){
	//do something
	});
	?> 
```
and take advantage of the features above: events and observable methods and properties.

Note:
- for above example $el is the parentNode of the php processing instruction

Ok, what about observable methods and properties? By default, the native objects in php don't offer support to add instance properties and methods, so:
```php
//$myDOMElement is an instance of DOMElement
$myDOMElement->myVar = "some val";
```
Would not work and trigger a notice "*PHP Notice:  Undefined property: DOMElement::$myVar in...*".

But with Xms
```php
//$myDOMElement is an instance of XmsDomElement
$myDOMElement->myVar = "some val";
```
Works just fine, moreover you can bind a callback to observe when the value of the property changes
```php
//$myDOMElement is an instance of XmsDomElement
$myDOMElement->myVar = "some val";
$myDOMElement->bind("change","myVar",function($newVal,$oldVal){
$this->setAttribute("property","changed");
print $newVal;
});
```

Similar for instance methods, just that you can add callback for before and after the instance method is invoked
```php
//$myDOMElement is an instance of XmsDomElement
$myDOMElement->myMethod = function($someParameter){
//do something
};

$myDOMElement->bind("before","myMethod",function(someParameter){
//receives the same parameters that $myDOMElement->myMethod is invoked with
});

$myDOMElement->bind("after","myMethod",function(someParameter){
});
//add as many callbacks as needed
$myDOMElement->bind("before","myMethod",function(someParameter){
});

$myDOMElement->myMethod("someValue");
```

An example is like a thousand words…
```xml
<app outputxsl="xsl/aws2html5.xsl">
    <init>
        <?aws 
            //set an event handler
            $el->topmost()->on("anEvent",function($evt){
            //do something
            });

            //initialize the observable instance property
            $el->topmost()->someInstanceProperty = "";

            $el->topmost()->bind("change","someInstanceProperty",function(){
            //do something

            });

            //$el->topmost() is the topmost object instanceof  XmsEventHandler - in this case is an instance of Xms class which is the web app engine?></init>
    <client>
        <header>
			<?js console.log("running some javascript");?>
		</header>
        <content>
            <strong>
                <?php 
                    $el->trigger("anEvent");
                    $el->topmost()->someInstanceProperty = "newValue";

                    $newTextContent = $el->ownerDocument->createTextNode("new content of strong element");

                    $el->appendChild($newTextContent);

                    return "<em>em text</em> too";?>
             </strong>
            <case>
                <filter>
                    <?aws if($condition) return "show";?>
                </filter>
                <show>some xml code</show>
                <default>other xml code or import from showhere<import source="http://some/place/page.html" importashtml="" xpath="//div[@id='myid']"/></default>
            </case>
            <import xpath="/app/templates/somecode/*"/>
        </content>
    </client>
    <templates>
        <somecode>
            <strong>
                <?php //do something ?></strong>
            <import source="http://someotherplace/Page.html" importashtml="" xpath="//table[1]"/>
        </somecode>
    </templates>
</app>
```

As *case, import and php processing instruction* are client directives, in Xms we have application directives to help us initialize the application or use additional resources.
- *remotetemplate* - think that you might already have an application and need to do only some minor changes, basically offer some sort of mirror - this is when remotetemplate comes in place; see *test/docs.ex.remotetemplate.1.xml*,*test/docs.ex.remotetemplate.2.xml*,*test/docs.ex.remotetemplate.3.xml*; Note: - I am not responsible for whatpeople are using this for - this is a functionality implemented to help not harm anyone
- *use* - when code from another Xms application is needed to be used in current application; See *test/docs.ex.use.1.xml* and *test/docs.ex.use.2.xml*
- *init* - is a directive to be used to initialize the application; additionally it can return a value in the global context but is recommended to use a more local context ($el->topmost()); See *test/docs.ex.domiterator.2.xml* or other examples

Now, what if remotetemplate or use directives bring some elements that need some change but since they are not in the current application I don't have access to them? This is where *filters* join the game.

In Xms 5.x we have 3 filters:
- *xpath* - helps to execute some code for each node given by the xpath; see *test/docs.ex.xpath.1.xml*
- *domiterator* - use it to generate repeating xml using an array of assoc arrays (like generate multiple tr on a table); see *test/docs.ex.domiterator.1.xml* and *test/docs.ex.domiterator.2.xml*
- *import* - does exactly the same thing like the directive just that is defined somewhere else - see *test/docs.ex.import.3.xml*

Usually filters are executed automatically after Xms executes all directives in client (/app/client) however if needed a filter can be invoked from your code to execute when needed only; for a filter to be invokable it has to have the invokable class and an id set to it. See *test/docs.ex.import.3.xml* 

Last but not least, Xms has what I call *parsers* which are very similar with xpath filter but they *executed for all applications* - see parsers.xml in the root directory of Xms; there is also the possibility to define application parsers in /app/parsers however they are rarely used since xpath filter provide the same functionality

Like all other cm frameworks, Xms has a router which is to be found in *router.xml*; there are a couple of models but you have all freedom to make your own.

*access.xml* is a script that tells Xms if an application can be accessed or not given the circumstances - I wrote a simple implementation but again, you can be creative and make your own or modify existing to meet your needs.

Multilanguage support is a work in progress however Xms uses lang.xml to match predefined dom elements in the client side and alter the content - very likely this approch to change in later releases.

Xms uses it's own xml editor called **Designer**, enforcing the developers to code online, without needing any other tool.

Additional resources can be found on my website http://aws-dms.com
Classes documentation can be found at http://doc.aws-dms.com

Since the documentation is a work in progress don't hesitate to ask any questions directly via email or on the website. 

[![Build Status](https://travis-ci.org/mekanixms/xms.svg?branch=master)](https://travis-ci.org/mekanixms/xms)