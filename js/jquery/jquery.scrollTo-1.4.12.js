/**
 * @preserve
 * jQuery.scrollTo
 * Copyright (c) 2007-2014 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 * @projectDescription Easy element scrolling using jQuery.
 * @author Ariel Flesler
 * @version 1.4.14
 */
(function(n){n(["jquery"],function(c){function h(b){return c.isFunction(b)||c.isPlainObject(b)?b:{top:b,left:b}}var k=c.scrollTo=function(b,d,a){return c(window).scrollTo(b,d,a)};k.defaults={axis:"xy",duration:0,limit:!0};k.window=function(b){return c(window)._scrollable()};c.fn._scrollable=function(){return this.map(function(){if(this.nodeName&&-1==c.inArray(this.nodeName.toLowerCase(),["iframe","#document","html","body"]))return this;var b=(this.contentWindow||this).document||this.ownerDocument||
this;return/webkit/i.test(navigator.userAgent)||"BackCompat"==b.compatMode?b.body:b.documentElement})};c.fn.scrollTo=function(b,d,a){"object"==typeof d&&(a=d,d=0);"function"==typeof a&&(a={onAfter:a});"max"==b&&(b=9E9);a=c.extend({},k.defaults,a);d=d||a.duration;a.queue=a.queue&&1<a.axis.length;a.queue&&(d/=2);a.offset=h(a.offset);a.over=h(a.over);return this._scrollable().each(function(){function r(b){p.animate(f,d,a.easing,b&&function(){b.call(this,e,a)})}if(null!=b){var l=this,p=c(l),e=b,q,f={},
n=p.is("html,body");switch(typeof e){case "number":case "string":if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(e)){e=h(e);break}e=n?c(e):c(e,this);if(!e.length)return;case "object":if(e.is||e.style)q=(e=c(e)).offset()}var u=c.isFunction(a.offset)&&a.offset(l,e)||a.offset;c.each(a.axis.split(""),function(b,c){var d="x"==c?"Left":"Top",m=d.toLowerCase(),g="scroll"+d,h=l[g],t=k.max(l,c);q?(f[g]=q[m]+(n?0:h-p.offset()[m]),a.margin&&(f[g]-=parseInt(e.css("margin"+d))||0,f[g]-=parseInt(e.css("border"+d+"Width"))||
0),f[g]+=u[m]||0,a.over[m]&&(f[g]+=e["x"==c?"width":"height"]()*a.over[m])):(d=e[m],f[g]=d.slice&&"%"==d.slice(-1)?parseFloat(d)/100*t:d);a.limit&&/^\d+$/.test(f[g])&&(f[g]=0>=f[g]?0:Math.min(f[g],t));!b&&a.queue&&(h!=f[g]&&r(a.onAfterFirst),delete f[g])});r(a.onAfter)}}).end()};k.max=function(b,d){var a="x"==d?"Width":"Height",h="scroll"+a;if(!c(b).is("html,body"))return b[h]-c(b)[a.toLowerCase()]();var a="client"+a,l=b.ownerDocument.documentElement,k=b.ownerDocument.body;return Math.max(l[h],k[h])-
Math.min(l[a],k[a])};return k})})("function"===typeof define&&define.amd?define:function(n,c){"undefined"!==typeof module&&module.exports?module.exports=c(require("jquery")):c(jQuery)});
