/**
 * @preserve
 * XMS - Online Web Development
 * 
 * Copyright (c) 2010 Cezar Lucan cezar.lucan@aws-dms.com
 * Licensed under GPL license.
 * http://www.aws-dms.com
 *
 * Date: 2010-10-24
 * The original kvaTree plugin doesnt belong to me and seems is no longer maintained;
 * this is a modified version that fits the needs of this project
 * but all credits for this script go to original developer of kvaTree
 */
(function(a) {
	a.fn.kvaTree = function(b) {
		return a(this).each(function() {
			var c = a(this);
			var e = this;
			var d = null;
			e.options = {
				autoclose : true,
				autoExpandOnAdd : false,
				background : "white",
				imgFolder : "images/",
				overrideEvents : false,
				dragdrop : true,
				dropOk : false,
				onClick : false,
				onDblClick : false,
				onBeforeExpand : false,
				onAfterExpand : false,
				onBeforeCollapse : false,
				onAfterCollapse : false,
				onAddNode : false,
				onEditNode : false,
				onDeleteNode : false,
				onDrag : false,
				onDrop : false
			};
			e.opts = a.extend({}, e.options, b);
			//atasez callback pt checkbox (daca exista) pt rootnode
			$(e).find(":checkbox").on("change", function() {
				if ( typeof e.opts.onNodeCheckedCallback == "function")
					e.opts.onNodeCheckedCallback.apply(this.parentNode, [this.checked]);
				$(e).trigger({
					"type" : "checked",
					"status" : this.checked,
					"target" : this.parentNode
				});
			});

			a.fn.kvaTree.InitKvaTree = function() {
				var f = '<li class="separator"></li>';
				c.find("li:not(.separator)").filter(function() {
					if (a(this).prev("li.separator").get(0)) {
						return false
					} else {
						return true
					}
				}).each(function() {
					a(this).before(f)
				});
				c.find("li > span").not(".sign").not(".clr").addClass("text").attr("unselectable", "on");
				if ((e.opts.dragdrop) && (!false)) {
					e.ClearEmptyNodes();
					e.FillEmptyNodes();
					c.find("li.separator.artificial").hide()
				}
				c.find("li:not(.separator,.node,.leaf)").filter(":has(ul)").addClass("node").end().filter(":not(.node)").addClass("leaf");
				if (false) {
					e.IeSetStyles()
				}
				e.Clean();
				e.AddSigns();
				if (!c.data("kvaTree_binded")) {
					e.BindEvents()
				}
			};
			e.FillEmptyNodes = function() {
				c.find("li.node").each(function() {
					if (!a(this).children("ul").get(0)) {
						a(this).find("span.text").after('<ul><li class="separator artificial"></li></ul>')
					} else {
						if (!a(this).find("> ul > li").get(0)) {
							a(this).find("> ul").append('<li class="separator artificial"></li>')
						}
					}
				})
			};
			e.ClearEmptyNodes = function() {
				c.find("li.separator.artificial").each(function() {
					if (a(this).siblings("li").get(0)) {
						a(this).remove()
					}
				})
			};
			a.fn.kvaTree.AddNode = function(l) {
				var g = c.find("span.ui-state-highlight").get(0);
				if (g) {
					var p = a(g).parents("li:first");
					var h = a(g).parents("li.node:first");
					if ((!h.is(".fixedLevel")) || (l != "node")) {
						var n = (l == "leaf") ? "" : ' class="node"';
						var q = '<li class="separator"></li>';
						var o = "<li" + n + '><span class="text">&nbsp;</span><input type="text" value="New item" /></li>';
						var j = q + o;
						var m = false;
						if (p.is(".leaf")) {
							p.after(j);
							var i = p.nextAll("li:not(.separator):first");
							var f = p.parent();
							m = true
						} else {
							if (p.is(".node")) {
								var k = p.children("ul").get(0);
								if (k) {
									a(k).append(j);
									var i = a(k).children("li:not(.separator):last")
								} else {
									p.append("<ul>" + j + "</ul>");
									var k = p.children("ul").get(0);
									var i = a(k).children("li:not(.separator):last")
								}
								if (e.opts.autoExpandOnAdd) {
									e.ExpandNode(p)
								}
								var f = p;
								m = true
							}
						}
						if (m) {
							a(g).removeClass("ui-state-highlight");
							f.find("input:text").focus().select().blur(function() {
								e.SaveInput(a(this))
							})
						}
						a.fn.kvaTree.InitKvaTree();
						if ( typeof (e.opts.onAddNode) == "function") {
							e.opts.onAddNode(i)
						}
					}
				}
			};
			a.fn.kvaTree.AddNodeTo = function(f, m, n) {
				var h = false;
				c.find("li").each(function() {
					if (this.nodeType == 1) {
						if ( typeof this.documentRef == "object") {
							if (n.parentNode === this.documentRef) {
								h = a(this).children("ul").get(0)
							}
						}
					}
				});
				if (h) {
					var r = a(h).parents("li:first");
					var i = a(h).parents("li.node:first");
					if ((!i.is(".fixedLevel")) || (m != "node")) {
						var q = (m == "leaf") ? "" : ' class="node"';
						var s = '<li class="separator"></li>';
						var p = "<li" + q + '><input type="checkbox" style="position:relative; left: -54px; top: -3px; border: 1px solid;"/><span class="text" style="position:relative; left: -20px; top: -4px;">' + f + "</span>";
						var k = s + p;
						var df = $(k);
						var o = false;

						df.find(":checkbox").on("change", function() {
							if ( typeof e.opts.onNodeCheckedCallback == "function")
								e.opts.onNodeCheckedCallback.apply(this.parentNode, [this.checked]);
							$(e).trigger({
								"type" : "checked",
								"status" : this.checked,
								"target" : this.parentNode
							});
						});

						if (r.is(".leaf")) {
							r.after(df);
							var j = r.nextAll("li:not(.separator):first");
							var g = r.parent();
							o = true
						} else {
							if (r.is(".node")) {
								var l = r.children("ul").get(0);
								if (l) {
									a(l).append(df);
									var j = a(l).children("li:not(.separator):last")
								} else {
									r.append("<ul>" + df + "</ul>");
									var l = r.children("ul").get(0);
									var j = a(l).children("li:not(.separator):last")
								}
								if (e.opts.autoExpandOnAdd) {
									e.ExpandNode(r)
								}
								var g = r;
								o = true
							}
						}
						if (o) {
							a(h).removeClass("ui-state-highlight")
						}
						a.fn.kvaTree.InitKvaTree();
						if ( typeof (e.opts.onAddNode) == "function") {
							e.opts.onAddNode(j, n)
						}
					}
				}
			};
			a.fn.kvaTree.EditNode = function() {
				var g = c.find("span.ui-state-highlight").get(0);
				if (g) {
					var f = a(g).parents("li:first");
					a(g).replaceWith('<span class="text">&nbsp;</span><input type="text" value="' + a(g).text() + '" />');
					f.find("input:text").focus().select().blur(function() {
						e.SaveInput(a(this))
					});
					if ( typeof (e.opts.onEditNode) == "function") {
						e.opts.onEditNode(f)
					}
				}
			};
			a.fn.kvaTree.DeleteNode = function(i) {
				var g = false;
				if (i) {
					c.find("li").each(function() {
						if (this.nodeType == 1) {
							if ( typeof this.documentRef == "object") {
								if (this.documentRef == i) {
									//h = a(this).children("ul").get(0)
									g = this;
								}
							}
						}
					});
				} else {
					g = c.find("span.ui-state-highlight").get(0);
				}

				if (g) {
					var f = a(g).parents("li:first");
					var h = f.parents("li.node:first");
					f.prev("li.separator").remove().end().remove();
					a.fn.kvaTree.InitKvaTree();
					if ( typeof (e.opts.onDeleteNode) == "function") {
						e.opts.onDeleteNode(f, h)
					}
				}
			};
			e.SaveInput = function(f) {
				f.prev("span.text").remove();
				var g = (a.trim(f.get(0).value) != "") ? f.get(0).value : "_____";
				f.replaceWith('<span class="ui-state-highlight text">' + g + "</span>");
				a.fn.kvaTree.InitKvaTree()
			};
			e.IeSetStyles = function() {
				c.find("li.node.open").next("li.separator").css("background", "none");
				c.find("li.node:not(.open) > ul").hide();
				c.find("li.node.open > ul").css("margin-bottom", "1px")
			};
			e.Clean = function() {
				c.find("li:not(.separator)").each(function() {
					if (a(this).next("li:not(.artificial)").get(0)) {
						var g = "url(" + e.opts.imgFolder + "line-vertical.gif) left top repeat-y"
					} else {
						var g = e.opts.background
					}
					a(this).find("span.clr").remove();
					var f = a(this).height();
					var h = (a(this).is(".node")) ? 12 : 8;
					a(this).append('<span class="clr" style="width: 1px; height: ' + f + "px; position: absolute; left: 0; top: " + h + "px; background: " + g + ';"></span>')
				})
			};
			e.AddSigns = function() {
				c.find("li.node").each(function() {
					if (a(this).hasClass("open")) {
						a(this).find("span.sign").remove().end().append('<span class="sign minus"></span>')
					} else {
						a(this).find("span.sign").remove().end().append('<span class="sign plus"></span>')
					}
				})
			};
			e.BindEvents = function() {
				c.click(function(h) {
					var f = a(h.target);
					if (f.is("span.sign")) {
						var g = f.parents("li:eq(0)");
						e.ToggleNode(g)
					} else {
						if (f.is("span.text")) {
							var g = f.parents("li:eq(0)");
							if ( typeof (e.opts.onClick) == "function") {
								if (!e.opts.overrideEvents) {
									c.find(".ui-state-highlight").removeClass("ui-state-highlight");
									f.addClass("ui-state-highlight")
								}
								e.opts.onClick(h, g)
							} else {
								c.find(".ui-state-highlight").removeClass("ui-state-highlight");
								f.addClass("ui-state-highlight")
							}
						}
					}
				});
				c.dblclick(function(h) {
					var f = a(h.target);
					if (f.is("span.text")) {
						var g = f.parents("li:eq(0)");
						if ( typeof (e.opts.onDblClick) == "function") {
							if ((!e.opts.overrideEvents) && (g.is(".node"))) {
								e.ToggleNode(g)
							}
							e.opts.onDblClick(h, g)
						} else {
							if (g.is(".node")) {
								e.ToggleNode(g)
							}
						}
					}
				});
				c.data("kvaTree_binded", 1)
			};
			e.ToggleNode = function(f) {
				if (f.hasClass("open")) {
					e.CollapseNode(f)
				} else {
					e.ExpandNode(f)
				}
				e.Clean()
			};
			e.redrawOpenNode = function(f) {
				if (f.hasClass("open")) { {
						e.CollapseNode(f);
						e.ExpandNode(f);
					}
				} else {
					//e.ExpandNode(f)
				}
				e.Clean()
			};
			e.ExpandNode = function(g) {
				if ( typeof (e.opts.onBeforeExpand) == "function") {
					e.opts.onBeforeExpand(g)
				}
				g.addClass("open");
				if (e.opts.autoclose) {
					g.siblings(".open").each(function() {
						e.CollapseNode(a(this))
					})
				}
				if (false) {
					c.find("li.node.open").next("li.separator").css("background", "none");
					g.children("ul").show().css({
						"margin-bottom" : "1px"
					})
				}
				var f = g.find("span.sign:last");
				f.removeClass("plus").addClass("minus");
				if ( typeof (e.opts.onAfterExpand) == "function") {
					e.opts.onAfterExpand(g)
				}
				$("#nodeListDiv").scrollTo(g);
			};
			e.CollapseNode = function(g) {
				if ( typeof (e.opts.onBeforeCollapse) == "function") {
					e.opts.onBeforeCollapse(g)
				}
				g.removeClass("open");
				if (false) {
					g.children("ul").hide()
				}
				var f = g.find("span.sign:last");
				f.removeClass("minus").addClass("plus");
				if ( typeof (e.opts.onAfterCollapse) == "function") {
					e.opts.onAfterCollapse(g)
				}
			};
			if (a(this).is("ul")) {
				var c = a(this);
				c.addClass("kvaTree");
				a.fn.kvaTree.InitKvaTree()
			}
		})
	}
})(jQuery);
