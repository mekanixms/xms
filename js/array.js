/*

 XMS - Online Web Development

 Copyright (c) 2010 Cezar Lucan cezar.lucan@aws-dms.com
 Licensed under GPL license.
 http://www.aws-dms.com

 Date: 2010-10-24
*/
Array.prototype.pickFirst=1;Array.prototype.pickLast=2;var __xms__ap__push=Array.prototype.push,__xms__ap__pop=Array.prototype.pop,__xms__ap__shift=Array.prototype.shift,__xms__ap__unshift=Array.prototype.unshift,__xms__ap__reverse=Array.prototype.reverse,__xms__ap__splice=Array.prototype.splice;Object.defineProperty(Array.prototype,"is_XMS_Smart",{enumerable:!1,configurable:!1,writable:!1,value:!0});
Array.prototype.push=function(){if("function"===typeof this.beforePush)var a=this.beforePush.apply(this,arguments);switch(a){case null:case void 0:var b=__xms__ap__push.apply(this,arguments);"function"===typeof this.afterPush&&this.afterPush.apply(this,arguments);break;case !1:break;default:b=__xms__ap__push.apply(this,arguments),"function"===typeof this.afterPush&&this.afterPush.apply(this,arguments)}return b};
Array.prototype.unshift=function(){if("function"===typeof this.beforeUnshift)var a=this.beforeUnshift.apply(this,arguments);switch(a){case null:case void 0:var b=__xms__ap__unshift.apply(this,arguments);"function"===typeof this.afterUnshift&&this.afterUnshift.apply(this,arguments);break;case !1:break;default:b=__xms__ap__unshift.apply(this,arguments),"function"===typeof this.afterUnshift&&this.afterUnshift.apply(this,arguments)}return b};
Array.prototype.splice=function(){if("function"===typeof this.beforeSplice)var a=this.beforeSplice.apply(this,arguments);switch(a){case null:case void 0:var b=__xms__ap__splice.apply(this,arguments);"function"===typeof this.afterSplice&&this.afterSplice.apply(this,arguments);break;case !1:break;default:b=__xms__ap__splice.apply(this,arguments),"function"===typeof this.afterSplice&&this.afterSplice.apply(this,arguments)}return b};
Array.prototype.contains=function(a,b){var c=!1;void 0==b&&(b=!1);for(var d=0;d<this.length;d++)b?this[d]===a&&(c=!0):this[d]==a&&(c=!0);return c};Array.prototype.removeItem=function(a){for(var b=!1,c=0;c<this.length;c++)this[c]===a&&(b=this.splice(c,1));0==this.length&&"function"==typeof this.onDepleted&&this.onDepleted.apply(this);return b};Array.prototype.empty=function(){return this.splice(0,this.length)};
Array.prototype.unique=function(){var a=[];this.forEach(function(b,c){a.contains(b)||a.push(b)});return a};
Array.prototype.pickOne=function(a,b){var c=!1,d=this.onItemPicked;"function"==typeof b&&(d=b);null==a&&(a=Array.prototype.pickLast);if(0==this.length)"function"==typeof this.onDepleted&&this.onDepleted.apply(this);else{if(!0===a)var e=getRandomInt(0,this.length);a==Array.prototype.pickFirst&&(e=0);a==Array.prototype.pickLast&&(e=this.length-1);c=this.splice(e,1);if("function"==typeof d){var f=arguments;f[0]=c;f[1]=e;d.apply(this,f)}}return c};
Array.prototype.pickRandomOne=function(a,b){var c=null,d=getRandomInt(0,this.length),e=this.onItemPicked;"function"==typeof b&&(e=b);c=a?this.splice(d,1):this[d];if("function"==typeof e){var f=arguments;f[0]=c;f[1]=d;e.apply(this,f)}return c};
Array.prototype.assign=function(a,b){a=parseInt(a);if(a>=this.length)var c=this.beforePush,d=this.afterPush;else"function"==typeof this.beforeAssign&&(c=this.beforeAssign),"function"==typeof this.beforeAssign&&(d=this.afterAssign);if("function"==typeof c)var e=c.apply(this,[a,b]);switch(e){case null:case void 0:this[a]=b;"function"==typeof d&&d.apply(this,arguments);break;case !1:break;default:this[a]=b,"function"==typeof d&&d.apply(this,arguments)}return toRet};
function getRandomInt(a,b){return Math.floor(Math.random()*(b-a))+a};
