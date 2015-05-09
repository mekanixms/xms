/*

 XMS - Online Web Development

 Copyright (c) 2010 Cezar Lucan cezar.lucan@aws-dms.com
 Licensed under GPL license.
 http://www.aws-dms.com

 Date: 2010-10-24
*/
function typeOf(b){return{}.toString.call(b).match(/\s([a-zA-Z]+)/)[1]}function supports_canvas(){return!!document.createElement("canvas").getContext}function is_html_5_client(){if("function"==typeof JSON.parse&&window.localStorage&&window.sessionStorage&&supports_canvas())return!0}$.fn.xpe=function(b){$this=this.first();b=this[0].evaluate(b,this[0],null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null);for(var c=[];elem=b.iterateNext();)c.push(elem);return jQuery([]).pushStack(c)};
$.fn.bubble=function(b){var c={template:'<div class="ui-widget ui-state-highlight ui-corner-all"  style="font-weight:bold;padding:0px 10px 0px 10px;position:absolute; z-index:1500;"></div>',showEvent:"mouseover",hideEvent:"mouseout",message:$(this).attr("alt"),offsetX:10,offsetY:10,autoHideInterval:5E3},a=this;a.instanceOf="bubble";a.version="0.1";var e=$.extend({},c,b);0==$("div[id=bubble_Alert]").length&&$(e.template).attr("id","bubble_Alert").appendTo("body").hide();var d=$("div[id=bubble_Alert]");
this.showBubble=function(a){a||(a=e.message);d.html(a).show()};this.hideBubble=function(){d.html("").hide()};this.init=function(){a.mouseover(function(b){var c=$(window).scrollTop(),f=$(window).scrollLeft(),g=b.clientY+c+e.offsetY;b=b.clientX+f+e.offsetX;var l=d.outerHeight(),p=d.innerHeight(),m=$(window).width()+f-d.outerWidth(),n=$(window).height()+c-d.outerHeight(),g=l>p?g-(l-p):g;maxed=g>n||b>m?!0:!1;0>=b-f&&0>e.offsetX?b=f:b>m&&(b=m);0>=g-c&&0>e.offsetY?g=c:g>n&&(g=n);d.css("top",g+"px");d.css("left",
b+"px");a.showBubble();setTimeout(function(){a.hideBubble()},e.autoHideInterval)});a.mouseout(function(b){a.hideBubble()})};this.init();return this};
$.fn.customDialog=function(b){var c={buttons:{Ok:function(){$(this).dialog("close");dialogOpened=!1}},content:'<form><fieldset><label for="name">Valoare</label><input type="text" name="name" id="name" class="text" ui-widget-content ui-corner-all" /></fieldset></form>',title:"New Value",evalBeforeShow:"",autoUpdateOnSave:!1,id:$(this).attr("id"),bgiframe:!0,autoOpen:!0,modal:!0};b=$.extend(c,b);return this.each(function(){var a=b,e=$(this);dialogOpened=!0;e.append(a.content);allFields=$([]).add($("input select textarea checkbox radio password",
e));tips=$("#validateTips",e);eval(a.evalBeforeShow);e.dialog(a)})};var gsMonthNames="January February March April May June July August September October November December".split(" "),gsDayNames="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");function html_entity_decode(b,c){var a={},e="",d="",h="",d=b.toString();if(!1===(a=get_html_translation_table("HTML_ENTITIES",c)))return!1;delete a["&"];a["&"]="&amp;";for(e in a)h=a[e],d=d.split(h).join(e);return d}
function get_html_translation_table(b,c){var a={},e={},d=0,h="",h={},k={},f={},g={};h[0]="HTML_SPECIALCHARS";h[1]="HTML_ENTITIES";k[0]="ENT_NOQUOTES";k[2]="ENT_COMPAT";k[3]="ENT_QUOTES";f=isNaN(b)?b?b.toUpperCase():"HTML_SPECIALCHARS":h[b];g=isNaN(c)?c?c.toUpperCase():"ENT_COMPAT":k[c];if("HTML_SPECIALCHARS"!==f&&"HTML_ENTITIES"!==f)throw Error("Table: "+f+" not supported");a["38"]="&amp;";"HTML_ENTITIES"===f&&(a["160"]="&nbsp;",a["161"]="&iexcl;",a["162"]="&cent;",a["163"]="&pound;",a["164"]="&curren;",
a["165"]="&yen;",a["166"]="&brvbar;",a["167"]="&sect;",a["168"]="&uml;",a["169"]="&copy;",a["170"]="&ordf;",a["171"]="&laquo;",a["172"]="&not;",a["173"]="&shy;",a["174"]="&reg;",a["175"]="&macr;",a["176"]="&deg;",a["177"]="&plusmn;",a["178"]="&sup2;",a["179"]="&sup3;",a["180"]="&acute;",a["181"]="&micro;",a["182"]="&para;",a["183"]="&middot;",a["184"]="&cedil;",a["185"]="&sup1;",a["186"]="&ordm;",a["187"]="&raquo;",a["188"]="&frac14;",a["189"]="&frac12;",a["190"]="&frac34;",a["191"]="&iquest;",a["192"]=
"&Agrave;",a["193"]="&Aacute;",a["194"]="&Acirc;",a["195"]="&Atilde;",a["196"]="&Auml;",a["197"]="&Aring;",a["198"]="&AElig;",a["199"]="&Ccedil;",a["200"]="&Egrave;",a["201"]="&Eacute;",a["202"]="&Ecirc;",a["203"]="&Euml;",a["204"]="&Igrave;",a["205"]="&Iacute;",a["206"]="&Icirc;",a["207"]="&Iuml;",a["208"]="&ETH;",a["209"]="&Ntilde;",a["210"]="&Ograve;",a["211"]="&Oacute;",a["212"]="&Ocirc;",a["213"]="&Otilde;",a["214"]="&Ouml;",a["215"]="&times;",a["216"]="&Oslash;",a["217"]="&Ugrave;",a["218"]=
"&Uacute;",a["219"]="&Ucirc;",a["220"]="&Uuml;",a["221"]="&Yacute;",a["222"]="&THORN;",a["223"]="&szlig;",a["224"]="&agrave;",a["225"]="&aacute;",a["226"]="&acirc;",a["227"]="&atilde;",a["228"]="&auml;",a["229"]="&aring;",a["230"]="&aelig;",a["231"]="&ccedil;",a["232"]="&egrave;",a["233"]="&eacute;",a["234"]="&ecirc;",a["235"]="&euml;",a["236"]="&igrave;",a["237"]="&iacute;",a["238"]="&icirc;",a["239"]="&iuml;",a["240"]="&eth;",a["241"]="&ntilde;",a["242"]="&ograve;",a["243"]="&oacute;",a["244"]=
"&ocirc;",a["245"]="&otilde;",a["246"]="&ouml;",a["247"]="&divide;",a["248"]="&oslash;",a["249"]="&ugrave;",a["250"]="&uacute;",a["251"]="&ucirc;",a["252"]="&uuml;",a["253"]="&yacute;",a["254"]="&thorn;",a["255"]="&yuml;");"ENT_NOQUOTES"!==g&&(a["34"]="&quot;");"ENT_QUOTES"===g&&(a["39"]="&#39;");a["60"]="&lt;";a["62"]="&gt;";for(d in a)h=String.fromCharCode(d),e[h]=a[d];return e}
function htmlentities(b,c,a,e){var d=this.get_html_translation_table("HTML_ENTITIES",c),h="";b=null==b?"":b+"";if(!d)return!1;c&&"ENT_QUOTES"===c&&(d["'"]="&#039;");if(e||null==e)for(h in d)b=b.split(h).join(d[h]);else b=b.replace(/([\s\S]*?)(&(?:#\d+|#x[\da-f]+|[a-zA-Z][\da-z]*);|$)/g,function(a,b,e){for(h in d)b=b.split(h).join(d[h]);return b+e});return b}function rawurldecode(b){return decodeURIComponent(b)}
function removeStyle(b){$("link[rel=stylesheet]",b).each(function(){$(this,b).replaceWith("")});$("style",b).each(function(){$(this,b).replaceWith("")})}function removeScripts(b){$("script[type='text/javascript']",b).each(function(){$(this,b).replaceWith("")});$("script[language=javascript]",b).each(function(){$(this,b).replaceWith("")})}function getStyles(b){var c=[];$("link[rel=stylesheet]",b).each(function(){c.push($(this,b).attr("href"))});return c}
function getScripts(b){var c=[];$("script[type='text/javascript']",b).each(function(){c.push($(this,b).attr("src"))});$("script[language=javascript]",b).each(function(){c.push($(this,b).attr("srcs"))});return c}function addslashes(b){return(b+"").replace(/([\\"'])/g,"\\$1").replace(/\u0000/g,"\\0")}
elementXpath=function(b){var c=[],a="",e=function(a){switch(a.nodeType){case 2:var b=a.ownerElement;break;case 1:b=a.parentNode;break;default:b=a.parentNode}var e=0,b=b.firstChild,c=1;do 1==b.nodeType&&b.nodeName==a.nodeName&&(b==a?e=c:c++);while(b=b.nextSibling);return e};$(b.elem).parents().each(function(){1==this.nodeType&&c.unshift($(this))});c.push($(b.elem));0<c.length&&$(c).each(function(){if(b.useIndexes){var d=$(this).get(0).hasAttribute("id")&&null!=$(this).get(0).getAttribute("id")&&void 0!=
$(this).get(0).getAttribute("id")?'@id="'+$(this).get(0).getAttribute("id")+'"':e($(this).get(0));a=a+"/"+$(this).get(0).nodeName+"["+d+"]"}else a=a+"/"+$(this).get(0).nodeName+"["+e($(this).get(0))+"]"});return"/"+a};
elementCSSpath=function(b){var c=[],a="",e=function(a){switch(a.nodeType){case 2:var b=a.ownerElement;break;case 1:b=a.parentNode;break;default:b=a.parentNode}var e=0,b=b.firstChild,c=0;do 1==b.nodeType&&b.nodeName==a.nodeName&&(b==a?e=c:c++);while(b=b.nextSibling);return e};$(b.elem).parents().each(function(){1==this.nodeType&&c.unshift($(this))});c.push($(b.elem));0<c.length&&$(c).each(function(){if(b.useIndexes){var d=$(this).get(0).hasAttribute("id")&&null!=$(this).get(0).getAttribute("id")&&
void 0!=$(this).get(0).getAttribute("id")?"#"+$(this).get(0).getAttribute("id"):":eq("+e($(this).get(0))+")";a=a+">"+$(this).get(0).nodeName+d}else a=a+">"+$(this).get(0).nodeName+":eq("+e($(this).get(0))+")"});return a.slice(1)};
(function(b){var c=/["\\\x00-\x1f\x7f-\x9f]/g,a={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};b.toJSON="object"===typeof JSON&&JSON.stringify?JSON.stringify:function(a){if(null===a)return"null";var d=typeof a;if("undefined"!==d){if("number"===d||"boolean"===d)return""+a;if("string"===d)return b.quoteString(a);if("object"===d){if("function"===typeof a.toJSON)return b.toJSON(a.toJSON());if(a.constructor===Date){var c=a.getUTCMonth()+1,k=a.getUTCDate(),f=a.getUTCFullYear(),
d=a.getUTCHours(),g=a.getUTCMinutes(),l=a.getUTCSeconds();a=a.getUTCMilliseconds();10>c&&(c="0"+c);10>k&&(k="0"+k);10>d&&(d="0"+d);10>g&&(g="0"+g);10>l&&(l="0"+l);100>a&&(a="0"+a);10>a&&(a="0"+a);return'"'+f+"-"+c+"-"+k+"T"+d+":"+g+":"+l+"."+a+'Z"'}if(a.constructor===Array){c=[];for(k=0;k<a.length;k++)c.push(b.toJSON(a[k])||"null");return"["+c.join(",")+"]"}k=[];for(f in a){d=typeof f;if("number"===d)c='"'+f+'"';else if("string"===d)c=b.quoteString(f);else continue;d=typeof a[f];"function"!==d&&"undefined"!==
d&&(d=b.toJSON(a[f]),k.push(c+":"+d))}return"{"+k.join(",")+"}"}}};b.evalJSON="object"===typeof JSON&&JSON.parse?JSON.parse:function(a){return eval("("+a+")")};b.secureEvalJSON="object"===typeof JSON&&JSON.parse?JSON.parse:function(a){var b=a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"");if(/^[\],:{}\s]*$/.test(b))return eval("("+a+")");throw new SyntaxError("Error parsing JSON, source is not valid.");
};b.quoteString=function(b){return b.match(c)?'"'+b.replace(c,function(b){var c=a[b];if("string"===typeof c)return c;c=b.charCodeAt();return"\\u00"+Math.floor(c/16).toString(16)+(c%16).toString(16)})+'"':'"'+b+'"'}})(jQuery);
