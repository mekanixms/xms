/*

 XMS - Online Web Development

 Copyright (c) 2010 Cezar Lucan cezar.lucan@aws-dms.com
 Licensed under GPL license.
 http://www.aws-dms.com

 Date: 2010-10-24
*/
Object.toType=function(b){return function(a){return a===b?"global":{}.toString.call(a).match(/\s([a-z|A-Z]+)/)[1]}}(this);
