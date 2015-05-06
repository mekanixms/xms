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
Array.prototype.pickFirst = 1;
Array.prototype.pickLast = 2;

var __xms__ap__push = Array.prototype.push;
var __xms__ap__pop = Array.prototype.pop;
var __xms__ap__shift = Array.prototype.shift;
var __xms__ap__unshift = Array.prototype.unshift;

var __xms__ap__reverse = Array.prototype.reverse;
var __xms__ap__splice = Array.prototype.splice;

Object.defineProperty(Array.prototype, "is_XMS_Smart", {
	enumerable : false,
	configurable : false,
	writable : false,
	value : true
});

Array.prototype.push = function() {
	if ( typeof this.beforePush === "function")
		var check = this.beforePush.apply(this, arguments);

	switch(check) {
	case null:
	case undefined:
		var toret = __xms__ap__push.apply(this, arguments);
		if ( typeof this.afterPush === "function")
			this.afterPush.apply(this, arguments);
		break;
	case false:
		break;
	default:
		var toret = __xms__ap__push.apply(this, arguments);
		if ( typeof this.afterPush === "function")
			this.afterPush.apply(this, arguments);
		break;
	}

	return toret;
}

Array.prototype.unshift = function() {
	if ( typeof this.beforeUnshift === "function")
		var check = this.beforeUnshift.apply(this, arguments);

	switch(check) {
	case null:
	case undefined:
		var toret = __xms__ap__unshift.apply(this, arguments);
		if ( typeof this.afterUnshift === "function")
			this.afterUnshift.apply(this, arguments);
		break;
	case false:
		break;
	default:
		var toret = __xms__ap__unshift.apply(this, arguments);
		if ( typeof this.afterUnshift === "function")
			this.afterUnshift.apply(this, arguments);
		break;
	}

	return toret;
}

Array.prototype.splice = function() {
	if ( typeof this.beforeSplice === "function")
		var check = this.beforeSplice.apply(this, arguments);

	switch(check) {
	case null:
	case undefined:
		var toret = __xms__ap__splice.apply(this, arguments);
		if ( typeof this.afterSplice === "function")
			this.afterSplice.apply(this, arguments);
		break;
	case false:
		break;
	default:
		var toret = __xms__ap__splice.apply(this, arguments);
		if ( typeof this.afterSplice === "function")
			this.afterSplice.apply(this, arguments);
		break;
	}

	return toret;
}

Array.prototype.contains = function(v, strict) {
	var found = false;

	if (strict == undefined)
		strict = false;

	for (var i = 0; i < this.length; i++) {
		if (strict) {
			if (this[i] === v)
				found = true;
		} else if (this[i] == v)
			found = true;
	}
	return found;
};

Array.prototype.removeItem = function(item) {
	var removed = false;

	for (var i = 0; i < this.length; i++)
		if (this[i] === item) {
			removed = this.splice(i, 1);
		}

	if (this.length == 0)
		if ( typeof this.onDepleted == "function")
			this.onDepleted.apply(this);

	return removed;
};

Array.prototype.empty = function(each) {
	if (each == undefined)
		each = true;

	var that = this;

	if (each)
		this.forEach(function(item, index) {
			that.removeItem(item);
		})
	else
		this.splice(0, this.length);

	return true;
};

Array.prototype.unique = function() {
	var arr = [];
	this.forEach(function(item, index) {
		if (!arr.contains(item))
			arr.push(item);
	});
	return arr;
}

Array.prototype.pickOne = function(random, callback) {
	var toRet = false;

	var onItemPicked = this.onItemPicked;
	//default callback este cea atasata obiectului
	if ( typeof callback == "function")
		//daca se da un callback functiei este folosita aceasta in locul celei din obiect
		onItemPicked = callback;

	if (random == null)
		random = Array.prototype.pickLast;

	if (this.length == 0) {
		if ( typeof this.onDepleted == "function")
			this.onDepleted.apply(this);
	} else {
		if (random === true)
			var index = getRandomInt(0, this.length);
		if (random == Array.prototype.pickFirst)
			var index = 0;
		if (random == Array.prototype.pickLast)
			var index = this.length - 1;

		toRet = this.splice(index, 1);
		if ( typeof onItemPicked == "function")
			onItemPicked.apply(this, [toRet, index]);
	}

	return toRet;
}

Array.prototype.pickRandomOne = function(remove, callback) {
	var toRet = null;
	var index = getRandomInt(0, this.length);

	var onItemPicked = this.onItemPicked;
	//default callback este cea atasata obiectului
	if ( typeof callback == "function")
		//daca se da un callback functiei este folosita aceasta in locul celei din obiect
		onItemPicked = callback;

	if (remove)
		toRet = this.splice(index, 1);
	else
		toRet = this[index];

	if ( typeof onItemPicked == "function")
		onItemPicked.apply(this, [toRet, index]);

	return toRet;
}

Array.prototype.assign = function(pos, val) {
	//TODO verificare
	//TODO PT MAI MULTE DIMENSIUNI?[A,B] SAU [A][B]
	pos = parseInt(pos);

	if (pos >= this.length) {
		var bc = this.beforePush;
		var ac = this.afterPush
	} else {
		if ( typeof this.beforeAssign == "function")
			var bc = this.beforeAssign;
		if ( typeof this.beforeAssign == "function")
			var ac = this.afterAssign;
	}

	if ( typeof bc == "function")
		var check = bc.apply(this, [pos, val]);

	switch(check) {
	case null:
	case undefined:
		this[pos] = val;
		if ( typeof ac == "function")
			ac.apply(this, arguments);
		break;
	case false:
		break;
	default:
		this[pos] = val;
		if ( typeof ac == "function")
			ac.apply(this, arguments);
		break;
	}

	return toRet;
}
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}
