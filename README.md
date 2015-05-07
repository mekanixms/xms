### Xms

Xms is a php content management framework using xml as web application support. It provides an event based DOM infrastructure as well as observable methods and properties.

Why xml? Easy, is fast, reliable and everywhere...

Since it is a CM framework, Xms defines case and import directives to use on the client in order to manage the source code, which can be imported from local or remote resources.

To execute php code Xms provides the php processing instruction <?php myFunction();?> - looks familiar? So, what about this?
Well, the beauty is that with Xms you can access the DOM directly meaning above can do 
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

Ok, what about observable methods and properties? By default, the native objects in php dont offer support to add instance properties and methods, so:
```php
//$myDOMElement is an instance of DOMElement
$myDOMElement->myVar = "some val";
```
Would not work but with Xms
```php
//$myDOMElement is an instance of XmsDomElement
$myDOMElement->myVar = "some val";
```
Works just fine, moreover you can bind a callback for when the value of the property changes
```php
//$myDOMElement is an instance of XmsDomElement
$myDOMElement->myVar = "some val";
$myDOMElement->bind("change","myVar",function($newVal,$oldVal){
$this->setAttribute("property","changed");
print $newVal;
});
```

Similar with instance methods just that you can add callback for before and after the instance method is invoked
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

An example is worth a thousand words…
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


Xms uses it's own xml editor called Designer, enforcing the developers to code online, without needeing any other tool.

Additional resources can be found on my website http://aws-dms.com
Classes documentation can be found at http://doc.aws-dms.com

Since the documentation is a work in progress don't hesitate to ask any questions directly via email or on the website. 

[![Build Status](https://travis-ci.org/mekanixms/xms.svg?branch=master)](https://travis-ci.org/mekanixms/xms)