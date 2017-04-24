/*

 XMS - Online Web Development

 Copyright (c) 2010 Cezar Lucan cezar.lucan@aws-dms.com
 Licensed under GPL license.
 http://www.aws-dms.com

 Date: 2010-10-24
*/
function smartObject(e){var a=Object(null);a.obj=a;a.overwrite=!1;a.defaultObject=Array;null!=e&&(a.defaultObject=e);a.content={};a.getTypeOf=function(a){return{}.toString.call(a).match(/\s([a-z|A-Z]+)/)[1]};a.onCreateException=function(a){this.message=a;this.name="OVERWRITE FORBIDDEN";this.toString=function(){return this.message+" "+this.name}};a.create=function(b,c){var d=!0,f;!a.overwrite&&a.has(b)&&(d=!1,f="Property exists");if(d)return null==c&&(c=new a.defaultObject),Object.defineProperty(a.content,
b,{enumerable:!0,configurable:!0,writable:!0,value:c}),"function"==typeof a.onPropertyCreated&&a.onPropertyCreated.apply(a,[b,a.content[b]]),"Array"==a.getTypeOf(c)&&c.is_XMS_Smart&&"function"==typeof a.onSmartPropertyCreated&&a.onSmartPropertyCreated.apply(a,[b,a.content[b]]),a.content[b];throw new a.onCreateException(f);};a.has=function(b){var c=!1;b="Function"==a.getTypeOf(b)?b():b;switch(a.getTypeOf(b)){case "String":a.get(b)&&(c=!0)}return c};a.find=function(b){var c=!1;b="Function"==a.getTypeOf(b)?
b():b;for(var d in a.content)a.content[d]===b&&(c=d);return c};a.findItem=function(b){var c=!1;b="Function"==a.getTypeOf(b)?b():b;for(var d in a.content)switch(a.getTypeOf(a.content[d])){case "Object":for(var f in a.content[d])a.content[d][f]===b&&(c={key:d,index:f});break;case "Array":var e=a.content[d].indexOf(b);-1!=e&&(c={key:d,index:e});break;default:a.content[d]===b&&(c={key:d})}return c};a.set=function(b,c){if("function"==typeof a.beforeSet)var d=a.beforeSet.apply(this,arguments);switch(d){case !1:break;
default:a.has(b)||a.create(b),a.content[b]="function"==typeof c?c():c,"function"==typeof a.afterSet&&a.afterSet.apply(this,arguments)}};a.get=function(b){return a.content[b]};a.del=function(b){return a.has(b)?("function"==typeof a.beforeDelete&&a.beforeDelete.apply(this,arguments),delete a.content[b],"function"==typeof a.afterDelete&&a.afterDelete.apply(this,arguments),!0):!1};a.delItem=function(b){var c=a.findItem(b);if(c){if("function"==typeof a.beforeDeleteItem)var d=a.beforeDeleteItem.apply(this,
arguments);switch(d){case !1:break;default:if(c.hasOwnProperty("index"))switch(a.getTypeOf(a.content[c.key])){case "Array":return d=a.content[c.key].length,a.content[c.key].splice(a.content[c.key].indexOf(b),1),d-1==a.content[c.key].length?!0:!1;case "Object":return delete a.content[c.key][c.index],a.content[c.key].hasOwnProperty(c.index)?!1:!0}else a.del(c.key);"function"==typeof a.afterDeleteItem&&a.afterDeleteItem.apply(this,arguments)}}else return!1};a.init=function(b){if(null!=b)for(var c in b)a.create(c,
b[c])};return a};
