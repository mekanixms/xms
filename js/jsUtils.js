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
 
function typeOf(o) {
	//TODO recunoastere functii native

	//VARIANTE
	//TEST
	//console.log({}.toString.call(o).slice(8, -1)+" =? "+Object.toType(o)+" =? "+({}).toString.call(o).match(/\s([a-zA-Z]+)/)[1]);
	//return {}.toString.call(o).slice(8, -1);
	//return Object.toType(o); //are nevoie de funtia toType definita in mapsn
	return ({}).toString.call(o).match(/\s([a-zA-Z]+)/)[1]
}

//Thanks to http://diveintohtml5.info/detect.html#canvas
function supports_canvas() {
	return !!document.createElement('canvas').getContext;
}

//localStorage and JSON needs to be tested too
function is_html_5_client() {
	if ( typeof JSON.parse == "function" && window.localStorage && window.sessionStorage && supports_canvas())
		return true;
}

//Ex:
/*
$(document).xpathEvaluate("//node()").each(function() {
console.log(this);
});
*/

//Thanks: http://stackoverflow.com/questions/12243661/javascript-use-xpath-in-jquery
$.fn.xpe = function(xpathExpression) {
	// NOTE: vars not declared local for debug purposes
	$this = this.first();
	// Don't make me deal with multiples before coffee

	// Evaluate xpath and retrieve matching nodes
	var xpathResult = this[0].evaluate(xpathExpression, this[0], null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

	var result = [];
	while ( elem = xpathResult.iterateNext()) {
		result.push(elem);
	}

	var $result = jQuery([]).pushStack(result);
	return $result;
}

$.fn.bubble = function(b) {
	var d = {
		template : '<div class="ui-widget ui-state-highlight ui-corner-all"  style="font-weight:bold;padding:0px 10px 0px 10px;position:absolute; z-index:1500;"></div>',
		showEvent : "mouseover",
		hideEvent : "mouseout",
		message : $(this).attr("alt"),
		offsetX : 10,
		offsetY : 10,
		autoHideInterval : 5000
	};
	var c = this;
	c.instanceOf = "bubble";
	c.version = "0.1";
	var e = $.extend({}, d, b);
	if ($("div[id=bubble_Alert]").length == 0) {
		$(e.template).attr("id", "bubble_Alert").appendTo("body").hide()
	}
	var a = $("div[id=bubble_Alert]");
	this.showBubble = function(g) {
		var f = g;
		if (!f) {
			f = e.message
		}
		a.html(f).show()
	};
	this.hideBubble = function() {
		a.html("").hide()
	};
	this.init = function() {
		c.mouseover(function(k) {
			var n = $(window).scrollTop(), o = $(window).scrollLeft(), l = k.clientY + n + e.offsetY, h = k.clientX + o + e.offsetX, m = a.outerHeight(), g = a.innerHeight(), f = $(window).width() + o - a.outerWidth(), j = $(window).height() + n - a.outerHeight();
			l = (m > g) ? l - (m - g) : l;
			maxed = (l > j || h > f) ? true : false;
			if (h - o <= 0 && e.offsetX < 0) {
				h = o
			} else {
				if (h > f) {
					h = f
				}
			}
			if (l - n <= 0 && e.offsetY < 0) {
				l = n
			} else {
				if (l > j) {
					l = j
				}
			}
			a.css("top", l + "px");
			a.css("left", h + "px");
			c.showBubble();
			setTimeout(function() {
				c.hideBubble()
			}, e.autoHideInterval)
		});
		c.mouseout(function(f) {
			c.hideBubble()
		})
	};
	this.init();
	return this
};
$.fn.customDialog = function(options) {
	var defaults = {
		buttons : {
			Ok : function() {
				$(this).dialog("close");
				dialogOpened = false
			}
		},
		content : '<form><fieldset><label for="name">Valoare</label><input type="text" name="name" id="name" class="text" ui-widget-content ui-corner-all" /></fieldset></form>',
		title : "New Value",
		evalBeforeShow : "",
		autoUpdateOnSave : false,
		id : $(this).attr("id"),
		bgiframe : true,
		autoOpen : true,
		modal : true
	};
	var options = $.extend(defaults, options);
	return this.each(function() {
		var o = options;
		var obj = $(this);
		dialogOpened = true;
		obj.append(o.content);
		allFields = $([]).add($("input select textarea checkbox radio password", obj));
		tips = $("#validateTips", obj);
		eval(o.evalBeforeShow);
		var dialog = obj.dialog(o)
	})
};

var gsMonthNames = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
var gsDayNames = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");

function html_entity_decode(c, f) {
	var e = {}, d = "", a = "", b = "";
	a = c.toString();
	if (false === ( e = get_html_translation_table("HTML_ENTITIES", f))) {
		return false
	}
	delete (e["&"]);
	e["&"] = "&amp;";
	for (d in e) {
		b = e[d];
		a = a.split(b).join(d)
	}
	return a
}

function get_html_translation_table(j, g) {
	var d = {}, f = {}, c = 0, a = "";
	var e = {}, b = {};
	var k = {}, h = {};
	e[0] = "HTML_SPECIALCHARS";
	e[1] = "HTML_ENTITIES";
	b[0] = "ENT_NOQUOTES";
	b[2] = "ENT_COMPAT";
	b[3] = "ENT_QUOTES";
	k = !isNaN(j) ? e[j] : j ? j.toUpperCase() : "HTML_SPECIALCHARS";
	h = !isNaN(g) ? b[g] : g ? g.toUpperCase() : "ENT_COMPAT";
	if (k !== "HTML_SPECIALCHARS" && k !== "HTML_ENTITIES") {
		throw new Error("Table: " + k + " not supported")
	}
	d["38"] = "&amp;";
	if (k === "HTML_ENTITIES") {
		d["160"] = "&nbsp;";
		d["161"] = "&iexcl;";
		d["162"] = "&cent;";
		d["163"] = "&pound;";
		d["164"] = "&curren;";
		d["165"] = "&yen;";
		d["166"] = "&brvbar;";
		d["167"] = "&sect;";
		d["168"] = "&uml;";
		d["169"] = "&copy;";
		d["170"] = "&ordf;";
		d["171"] = "&laquo;";
		d["172"] = "&not;";
		d["173"] = "&shy;";
		d["174"] = "&reg;";
		d["175"] = "&macr;";
		d["176"] = "&deg;";
		d["177"] = "&plusmn;";
		d["178"] = "&sup2;";
		d["179"] = "&sup3;";
		d["180"] = "&acute;";
		d["181"] = "&micro;";
		d["182"] = "&para;";
		d["183"] = "&middot;";
		d["184"] = "&cedil;";
		d["185"] = "&sup1;";
		d["186"] = "&ordm;";
		d["187"] = "&raquo;";
		d["188"] = "&frac14;";
		d["189"] = "&frac12;";
		d["190"] = "&frac34;";
		d["191"] = "&iquest;";
		d["192"] = "&Agrave;";
		d["193"] = "&Aacute;";
		d["194"] = "&Acirc;";
		d["195"] = "&Atilde;";
		d["196"] = "&Auml;";
		d["197"] = "&Aring;";
		d["198"] = "&AElig;";
		d["199"] = "&Ccedil;";
		d["200"] = "&Egrave;";
		d["201"] = "&Eacute;";
		d["202"] = "&Ecirc;";
		d["203"] = "&Euml;";
		d["204"] = "&Igrave;";
		d["205"] = "&Iacute;";
		d["206"] = "&Icirc;";
		d["207"] = "&Iuml;";
		d["208"] = "&ETH;";
		d["209"] = "&Ntilde;";
		d["210"] = "&Ograve;";
		d["211"] = "&Oacute;";
		d["212"] = "&Ocirc;";
		d["213"] = "&Otilde;";
		d["214"] = "&Ouml;";
		d["215"] = "&times;";
		d["216"] = "&Oslash;";
		d["217"] = "&Ugrave;";
		d["218"] = "&Uacute;";
		d["219"] = "&Ucirc;";
		d["220"] = "&Uuml;";
		d["221"] = "&Yacute;";
		d["222"] = "&THORN;";
		d["223"] = "&szlig;";
		d["224"] = "&agrave;";
		d["225"] = "&aacute;";
		d["226"] = "&acirc;";
		d["227"] = "&atilde;";
		d["228"] = "&auml;";
		d["229"] = "&aring;";
		d["230"] = "&aelig;";
		d["231"] = "&ccedil;";
		d["232"] = "&egrave;";
		d["233"] = "&eacute;";
		d["234"] = "&ecirc;";
		d["235"] = "&euml;";
		d["236"] = "&igrave;";
		d["237"] = "&iacute;";
		d["238"] = "&icirc;";
		d["239"] = "&iuml;";
		d["240"] = "&eth;";
		d["241"] = "&ntilde;";
		d["242"] = "&ograve;";
		d["243"] = "&oacute;";
		d["244"] = "&ocirc;";
		d["245"] = "&otilde;";
		d["246"] = "&ouml;";
		d["247"] = "&divide;";
		d["248"] = "&oslash;";
		d["249"] = "&ugrave;";
		d["250"] = "&uacute;";
		d["251"] = "&ucirc;";
		d["252"] = "&uuml;";
		d["253"] = "&yacute;";
		d["254"] = "&thorn;";
		d["255"] = "&yuml;"
	}
	if (h !== "ENT_NOQUOTES") {
		d["34"] = "&quot;"
	}
	if (h === "ENT_QUOTES") {
		d["39"] = "&#39;"
	}
	d["60"] = "&lt;";
	d["62"] = "&gt;";
	for (c in d) {
		a = String.fromCharCode(c);
		f[a] = d[c]
	}
	return f
}

function htmlentities(b, f, e, a) {
	var d = this.get_html_translation_table("HTML_ENTITIES", f), c = "";
	b = b == null ? "" : b + "";
	if (!d) {
		return false
	}
	if (f && f === "ENT_QUOTES") {
		d["'"] = "&#039;"
	}
	if (!!a || a == null) {
		for (c in d) {
			b = b.split(c).join(d[c])
		}
	} else {
		b = b.replace(/([\s\S]*?)(&(?:#\d+|#x[\da-f]+|[a-zA-Z][\da-z]*);|$)/g, function(j, h, g) {
			for (c in d) {
				h = h.split(c).join(d[c])
			}
			return h + g
		})
	}
	return b
}

function rawurldecode(a) {
	return decodeURIComponent(a)
}

function removeStyle(a) {
	$("link[rel=stylesheet]", a).each(function() {
		$(this, a).replaceWith("")
	});
	$("style", a).each(function() {
		$(this, a).replaceWith("")
	})
}

function removeScripts(a) {
	$("script[type='text/javascript']", a).each(function() {
		$(this, a).replaceWith("")
	});
	$("script[language=javascript]", a).each(function() {
		$(this, a).replaceWith("")
	})
}

function getStyles(a) {
	var b = [];
	$("link[rel=stylesheet]", a).each(function() {
		b.push($(this, a).attr("href"))
	});
	return b
}

function getScripts(a) {
	var b = [];
	$("script[type='text/javascript']", a).each(function() {
		b.push($(this, a).attr("src"))
	});
	$("script[language=javascript]", a).each(function() {
		b.push($(this, a).attr("srcs"))
	});
	return b
}

function addslashes(a) {
	return (a + "").replace(/([\\"'])/g, "\\$1").replace(/\u0000/g, "\\0")
}

elementXpath = function(d) {
	var c = new Array();
	var b = $(d.elem).parents();
	var a = "";
	var e = function(h) {
		switch (h.nodeType) {
		case 2:
			var g = h.ownerElement;
			break;
		case 1:
			var g = h.parentNode;
			break;
		default:
			var g = h.parentNode;
			break
		}
		var k = 0;
		var j = g.firstChild;
		var f = 1;
		do {
			if (j.nodeType == 1) {
				if (j.nodeName == h.nodeName) {
					if (j == h) {
						k = f
					} else {
						f++
					}
				}
			}
		} while (j = j.nextSibling);
		return k
	};
	b.each(function() {
		if (this.nodeType == 1) {
			c.unshift($(this))
		}
	});
	c.push($(d.elem));
	if (c.length > 0) {
		$(c).each(function() {
			if (!d.useIndexes) {
				a = a + "/" + $(this).get(0).nodeName + "[" + e($(this).get(0)) + "]"
			} else {
				if ($(this).get(0).hasAttribute("id") && $(this).get(0).getAttribute("id") != null && $(this).get(0).getAttribute("id") != undefined) {
					var f = '@id="' + $(this).get(0).getAttribute("id") + '"'
				} else {
					var f = e($(this).get(0))
				}
				a = a + "/" + $(this).get(0).nodeName + "[" + f + "]"
			}
		})
	}
	return "/" + a
};
elementCSSpath = function(d) {
	var c = new Array();
	var b = $(d.elem).parents();
	var a = "";
	var e = function(h) {
		switch (h.nodeType) {
		case 2:
			var g = h.ownerElement;
			break;
		case 1:
			var g = h.parentNode;
			break;
		default:
			var g = h.parentNode;
			break
		}
		var k = 0;
		var j = g.firstChild;
		var f = 0;
		do {
			if (j.nodeType == 1) {
				if (j.nodeName == h.nodeName) {
					if (j == h) {
						k = f
					} else {
						f++
					}
				}
			}
		} while (j = j.nextSibling);
		return k
	};
	b.each(function() {
		if (this.nodeType == 1) {
			c.unshift($(this))
		}
	});
	c.push($(d.elem));
	if (c.length > 0) {
		$(c).each(function() {
			if (!d.useIndexes) {
				a = a + ">" + $(this).get(0).nodeName + ":eq(" + e($(this).get(0)) + ")"
			} else {
				if ($(this).get(0).hasAttribute("id") && $(this).get(0).getAttribute("id") != null && $(this).get(0).getAttribute("id") != undefined) {
					var f = "#" + $(this).get(0).getAttribute("id")
				} else {
					var f = ":eq(" + e($(this).get(0)) + ")"
				}
				a = a + ">" + $(this).get(0).nodeName + f
			}
		})
	}
	return a.slice(1)
};

(function($) {
	var escapeable = /["\\\x00-\x1f\x7f-\x9f]/g, meta = {
		"\b" : "\\b",
		"\t" : "\\t",
		"\n" : "\\n",
		"\f" : "\\f",
		"\r" : "\\r",
		'"' : '\\"',
		"\\" : "\\\\"
	};
	$.toJSON = typeof JSON === "object" && JSON.stringify ? JSON.stringify : function(o) {
		if (o === null) {
			return "null"
		}
		var type = typeof o;
		if (type === "undefined") {
			return undefined
		}
		if (type === "number" || type === "boolean") {
			return "" + o
		}
		if (type === "string") {
			return $.quoteString(o)
		}
		if (type === "object") {
			if ( typeof o.toJSON === "function") {
				return $.toJSON(o.toJSON())
			}
			if (o.constructor === Date) {
				var month = o.getUTCMonth() + 1, day = o.getUTCDate(), year = o.getUTCFullYear(), hours = o.getUTCHours(), minutes = o.getUTCMinutes(), seconds = o.getUTCSeconds(), milli = o.getUTCMilliseconds();
				if (month < 10) {
					month = "0" + month
				}
				if (day < 10) {
					day = "0" + day
				}
				if (hours < 10) {
					hours = "0" + hours
				}
				if (minutes < 10) {
					minutes = "0" + minutes
				}
				if (seconds < 10) {
					seconds = "0" + seconds
				}
				if (milli < 100) {
					milli = "0" + milli
				}
				if (milli < 10) {
					milli = "0" + milli
				}
				return '"' + year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds + "." + milli + 'Z"'
			}
			if (o.constructor === Array) {
				var ret = [];
				for (var i = 0; i < o.length; i++) {
					ret.push($.toJSON(o[i]) || "null")
				}
				return "[" + ret.join(",") + "]"
			}
			var name, val, pairs = [];
			for (var k in o) {
				type = typeof k;
				if (type === "number") {
					name = '"' + k + '"'
				} else {
					if (type === "string") {
						name = $.quoteString(k)
					} else {
						continue
					}
				}
				type = typeof o[k];
				if (type === "function" || type === "undefined") {
					continue
				}
				val = $.toJSON(o[k]);
				pairs.push(name + ":" + val)
			}
			return "{" + pairs.join(",") + "}"
		}
	};
	$.evalJSON = typeof JSON === "object" && JSON.parse ? JSON.parse : function(src) {
		return eval("(" + src + ")")
	};
	$.secureEvalJSON = typeof JSON === "object" && JSON.parse ? JSON.parse : function(src) {
		var filtered = src.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "");
		if (/^[\],:{}\s]*$/.test(filtered)) {
			return eval("(" + src + ")")
		} else {
			throw new SyntaxError("Error parsing JSON, source is not valid.")
		}
	};
	$.quoteString = function(string) {
		if (string.match(escapeable)) {
			return '"' + string.replace(escapeable, function(a) {
				var c = meta[a];
				if ( typeof c === "string") {
					return c
				}
				c = a.charCodeAt();
				return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16)
			}) + '"'
		}
		return '"' + string + '"'
	}
})(jQuery)