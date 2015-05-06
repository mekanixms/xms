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

function smartObject(defaultObject) {
	var o = new Object(null);

	//helper la accesare in cazul in care obiectul e parametru al unei functii si nu sim care e
	o.obj = o;

	o.overwrite = false;

	o.defaultObject = Array;
	if (defaultObject != null)
		o.defaultObject = defaultObject;

	o.content = {};

	o.getTypeOf = function(obj) {
		return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1]
	}

	o.onCreateException = function(message) {
		this.message = message;
		this.name = "OVERWRITE FORBIDDEN";
		this.toString = function() {
			return this.message + " " + this.name;
		}
	}

	o.create = function(key, type) {
		var go = true;
		var errorMessage;

		if (!o.overwrite && o.has(key)) {
			go = false;
			errorMessage = "Property exists";
		}

		if (go) {
			if (type == null)
				type = new o.defaultObject;

			var n_o = Object.defineProperty(o.content, key, {
				enumerable : true,
				configurable : true,
				writable : true,
				value : type
			});

			if ( typeof o.onPropertyCreated == "function")
				o.onPropertyCreated.apply(o, [key, o.content[key]]);

			if (o.getTypeOf(type) == "Array")
				if (type.is_XMS_Smart)
					if ( typeof o.onSmartPropertyCreated == "function")
						o.onSmartPropertyCreated.apply(o, [key, o.content[key]]);

			return o.content[key];
		} else
			throw new o.onCreateException(errorMessage);

		return go;
	}

	o.has = function(property) {
		var toret = false;

		if (o.getTypeOf(property) == "Function")
			var check = property();
		else
			var check = property;

		switch(o.getTypeOf(check)) {
			case "String":
				if (o.get(check))
					toret = true;
				break;
			/*
			 default:
			 for (var key in o.content)
			 if (o.content[key] === check)
			 toret = true;
			 break;*/

		}
		return toret;
	}

	o.find = function(property) {
		var toret = false;

		if (o.getTypeOf(property) == "Function")
			var check = property();
		else
			var check = property;

		for (var key in o.content)
		if (o.content[key] === check)
			toret = key;

		return toret;
	}

	o.findItem = function(property) {
		var toret = false;

		if (o.getTypeOf(property) == "Function")
			var check = property();
		else
			var check = property;

		for (var key in o.content)
		switch(o.getTypeOf(o.content[key])) {
			case "Object":
				for (var index in o.content[key])
				if (o.content[key][index] === check)
					toret = {
						key : key,
						index : index
					};
				break;
			case "Array":
				var io = o.content[key].indexOf(check);
				if (io != -1)
					toret = {
						key : key,
						index : io
					};
				break;
			default:
				if (o.content[key] === check)
					//not array or object
					toret = {
						key : key
					};
				break;
		}

		return toret;
	}

	o.set = function(key, val) {

		if ( typeof o.beforeSet == "function")
			var check = o.beforeSet.apply(this, arguments);

		switch(check) {
			case false:
				break;
			case null:
			case undefined:
			default:
				if (!o.has(key))
					o.create(key);

				if ( typeof val == "function")
					o.content[key] = val();
				else
					o.content[key] = val;

				if ( typeof o.afterSet == "function")
					o.afterSet.apply(this, arguments);
				break;
		}
	}

	o.get = function(key) {
		return o.content[key];
	}

	o.del = function(key) {
		if (o.has(key)) {
			if ( typeof o.beforeDelete == "function")
				o.beforeDelete.apply(this, arguments);
			delete o.content[key];

			if ( typeof o.afterDelete == "function")
				o.afterDelete.apply(this, arguments);

			return true;
		} else
			return false;
	}

	o.delItem = function(item) {
		//TODO: test pe {{}}; pe {[merge]}
		var found = o.findItem(item);

		if (found) {
			if ( typeof o.beforeDeleteItem == "function")
				var check = o.beforeDeleteItem.apply(this, arguments);

			switch(check) {
				case false:
					break;

				case null:
				case undefined:
				default:
					if (found.hasOwnProperty("index")) {
						switch(o.getTypeOf(o.content[found.key])) {
							case "Array":
								var oldlength = o.content[found.key].length;
								o.content[found.key].splice(o.content[found.key].indexOf(item), 1);
								if (oldlength - 1 == o.content[found.key].length)
									return true;
								else
									return false;
								break;
							case "Object":
								delete o.content[found.key][found.index];
								if (o.content[found.key].hasOwnProperty(found.index))
									return false;
								else
									return true;
								break;
						}

					} else
						o.del(found.key);

					if ( typeof o.afterDeleteItem == "function")
						o.afterDeleteItem.apply(this, arguments);

					break;
			}
		} else
			return false;
	}

	o.init = function(defaultContent) {
		if (defaultContent != null)
			for (var key in defaultContent)
			o.create(key, defaultContent[key]);
	}

	return o;
}