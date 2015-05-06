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
$(document).ready(function() {
	$.fn.xmleditorlogin = function(c) {
		var i = this;
		i.defaults = {
			retries : 3,
			modOpt : {
				close : false,
				containerCss : {
					height : "30px",
					width : "300px",
					border : "0px"
				}
			},
			inputFormsContainer : "#inputFormsContainer",
			userContainer : "tr:eq(0)",
			passContainer : "tr:eq(1)",
			accessGranted : "#allowed",
			accessDenied : "#denied",
			user : "#user",
			pass : "#pass"
		};
		i.o = $.extend({}, i.defaults, c);
		var n = i.o;
		var k = 0;
		var s = $(n.inputFormsContainer, i);
		var d = $(n.userContainer, s);
		var e = $(n.userContainer, i);
		var r = $(n.accessGranted, i);
		var l = $(n.accessDenied, i);
		var t = $(n.user, i);
		var b = $(n.pass, i);
		var g = "";
		var q = function(u) {
			var o = $.extend({}, {
				user : t.val(),
				pass : u
			}, {
				cat : "LOGIN"
			});
			$.ajax({
				url : "xmlserver.php",
				type : "POST",
				async : false,
				cache : false,
				data : o,
				dataType : "text",
				success : function(v) {
					g = v
				},
				error : function(v, x, w) {
					alert(x)
				}
			});
			if ($("login", g).html() == "allowed") {
				return true
			} else {
				alert($("login", g).html());
				k += 1;
				return false
			}
		};
		var h = function() {
			r.show();
			setTimeout(function() {
				window.location.reload()
			}, 1000)
		};
		var f = function() {
			l.show()
		};
		var j = function() {
			b.trigger("focus")
		};
		var m = function() {
			if (k <= n.retries - 1) {
				if (q(b.val())) {
					h()
				} else {
					p()
				}
			} else {
				f()
			}
		};
		var p = function() {
			r.hide();
			l.hide();
			t.val("");
			b.val("");
			t.trigger("focus");
		};
        t.bind("keyup", "return", j).bind("keyup", "esc", p);
        b.bind("keyup", "return", m).bind("keyup", "esc", p);
		i.init = function() {
			t.trigger("focus");
			p();
		};
		i.init();
		return i
	};
	var a = $("#inForm").xmleditorlogin()
}); 