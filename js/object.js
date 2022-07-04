/**
 * @preserve
 * XMS - Online Web Development
 * 
 * Copyright (c) 2010 Cezar Lucan cezar.lucan@aws-dms.com
 * Licensed under GPL license.
 * http://www.aws-dms.com
 *
 * Date: 2010-10-24
 */

Object.toType = (function toType(global) {
	return function(obj) {
		if (obj === global) {
			return "global";
		}
		//return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();//original
		return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1];
	}
})(this)