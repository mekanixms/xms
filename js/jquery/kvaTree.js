/**
 * @preserve
 * XMS - Online Web Development
 *
 * Copyright (c) 2010 Cezar Lucan cezar.lucan@gmail.com
 * Licensed under GPL license.
 * https://github.com/mekanixms/xms
 *
 * The original kvaTree plugin is unmaintained. This version keeps the
 * editor's lazy outline (expand fills a branch, collapse drops it) and
 * replaces the per-node rebuild, GIF connectors, and shared $.fn methods.
 *
 * API is stored on the root element as element.kvaTree:
 *   mount, add, remove, expand, collapse, toggle, refresh, clearChildren, rowFor
 */
(function ($) {
	$.fn.kvaTree = function (options) {
		return this.each(function () {
			if (this.kvaTree && this.kvaTree.root === this)
				return;
			this.kvaTree = createTree(this, options);
		});
	};

	function createTree(root, options) {
		var opts = $.extend({
			autoclose: true,
			autoExpandOnAdd: false,
			overrideEvents: false,
			onClick: false,
			onDblClick: false,
			onBeforeExpand: false,
			onAfterExpand: false,
			onBeforeCollapse: false,
			onAfterCollapse: false,
			onAddNode: false,
			onDeleteNode: false,
			onNodeCheckedCallback: false
		}, options);
		var byXml = new WeakMap();

		$(root).addClass("kvaTree");

		function asElement(value) {
			if (!value)
				return null;
			if (value.jquery)
				return value.get(0) || null;
			if (value.nodeType === 1)
				return value;
			return null;
		}

		function call(name, arg) {
			if (typeof opts[name] === "function")
				opts[name](arg);
		}

		function unindex(li) {
			if (li.documentRef)
				byXml.delete(li.documentRef);
			var nested = li.querySelectorAll("li");
			var i;
			for (i = 0; i < nested.length; i++) {
				if (nested[i].documentRef)
					byXml.delete(nested[i].documentRef);
			}
		}

		function createRow(name, type, xmlNode) {
			var li = document.createElement("li");
			var checkbox = document.createElement("input");
			var text = document.createElement("span");
			li.className = type === "leaf" ? "leaf" : "node";
			if (li.className === "node") {
				var sign = document.createElement("span");
				sign.className = "sign";
				li.appendChild(sign);
			}
			checkbox.type = "checkbox";
			li.appendChild(checkbox);
			text.className = "text";
			text.textContent = name == null ? "" : String(name);
			li.appendChild(text);
			if (li.className === "node")
				li.appendChild(document.createElement("ul"));
			if (xmlNode) {
				li.documentRef = xmlNode;
				byXml.set(xmlNode, li);
			}
			return li;
		}

		function notifyAdd(li, xmlNode) {
			if (typeof opts.onAddNode === "function")
				opts.onAddNode($(li), xmlNode);
		}

		function mount(name, type, xmlNode) {
			var li = createRow(name, type, xmlNode);
			li.setAttribute("rootnode", "true");
			root.appendChild(li);
			notifyAdd(li, xmlNode);
			return li;
		}

		function ensureUl(parentLi) {
			var $parent = $(parentLi);
			var ul = $parent.children("ul").get(0);
			if (ul)
				return ul;
			$parent.removeClass("leaf").addClass("node");
			if (!$parent.children("span.sign").length) {
				var sign = document.createElement("span");
				sign.className = "sign";
				parentLi.insertBefore(sign, parentLi.firstChild);
			}
			ul = document.createElement("ul");
			parentLi.appendChild(ul);
			return ul;
		}

		function add(name, type, xmlNode) {
			var parentLi;
			if (!xmlNode || !xmlNode.parentNode)
				return null;
			parentLi = byXml.get(xmlNode.parentNode);
			if (!parentLi || !root.contains(parentLi))
				return null;
			var li = createRow(name, type, xmlNode);
			ensureUl(parentLi).appendChild(li);
			if (opts.autoExpandOnAdd)
				expand(parentLi);
			notifyAdd(li, xmlNode);
			return li;
		}

		function resolve(target) {
			var el;
			var mapped;
			if (!target) {
				el = $(root).find("span.ui-state-highlight").closest("li").get(0);
				return el || null;
			}
			el = asElement(target);
			if (el && el.tagName === "LI" && root.contains(el))
				return el;
			if (el && el.documentRef && byXml.has(el.documentRef)) {
				mapped = byXml.get(el.documentRef);
				if (mapped && root.contains(mapped))
					return mapped;
			}
			if (target.jquery)
				target = target.get(0);
			if (target && byXml.has(target)) {
				mapped = byXml.get(target);
				if (mapped && root.contains(mapped))
					return mapped;
			}
			return null;
		}

		function remove(target) {
			var li = resolve(target);
			var parentLi;
			if (!li)
				return null;
			parentLi = $(li).parents("li").get(0) || null;
			if (typeof opts.onDeleteNode === "function")
				opts.onDeleteNode($(li), parentLi ? $(parentLi) : $());
			unindex(li);
			if (li.parentNode)
				li.parentNode.removeChild(li);
			return parentLi;
		}

		function clearChildren(li) {
			var el = asElement(li);
			var ul;
			var nested;
			var i;
			if (!el)
				return;
			ul = $(el).children("ul").get(0);
			if (!ul)
				return;
			nested = ul.querySelectorAll("li");
			for (i = 0; i < nested.length; i++) {
				if (nested[i].documentRef)
					byXml.delete(nested[i].documentRef);
			}
			while (ul.firstChild)
				ul.removeChild(ul.firstChild);
		}

		function expand(li) {
			var el = asElement(li);
			var $el;
			if (!el)
				return;
			$el = $(el);
			if (!$el.hasClass("node") || $el.hasClass("open"))
				return;
			call("onBeforeExpand", $el);
			$el.addClass("open");
			if (opts.autoclose) {
				$el.siblings(".open").each(function () {
					collapse(this);
				});
			}
			call("onAfterExpand", $el);
		}

		function collapse(li) {
			var el = asElement(li);
			var $el;
			if (!el)
				return;
			$el = $(el);
			if (!$el.hasClass("open"))
				return;
			call("onBeforeCollapse", $el);
			$el.removeClass("open");
			call("onAfterCollapse", $el);
		}

		function toggle(li) {
			var el = asElement(li);
			if (!el)
				return;
			if ($(el).hasClass("open"))
				collapse(el);
			else
				expand(el);
		}

		function refresh(li) {
			var el = asElement(li);
			if (!el || !$(el).hasClass("open"))
				return;
			clearChildren(el);
			call("onBeforeExpand", $(el));
		}

		function selectText(span) {
			$(root).find(".ui-state-highlight").removeClass("ui-state-highlight");
			span.addClass("ui-state-highlight");
		}

		$(root).on("click", function (event) {
			var target = $(event.target);
			var li;
			if (target.is("span.sign")) {
				toggle(target.closest("li"));
				return;
			}
			if (!target.is("span.text"))
				return;
			li = target.closest("li");
			if (typeof opts.onClick === "function") {
				if (!opts.overrideEvents)
					selectText(target);
				opts.onClick(event, li);
			} else {
				selectText(target);
			}
		});

		$(root).on("dblclick", function (event) {
			var target = $(event.target);
			var li;
			if (!target.is("span.text"))
				return;
			li = target.closest("li");
			if (typeof opts.onDblClick === "function") {
				if (!opts.overrideEvents && li.hasClass("node"))
					toggle(li);
				opts.onDblClick(event, li);
			} else if (li.hasClass("node")) {
				toggle(li);
			}
		});

		$(root).on("change", "input:checkbox", function () {
			if (typeof opts.onNodeCheckedCallback === "function")
				opts.onNodeCheckedCallback.apply(this.parentNode, [this.checked]);
			$(root).trigger({
				type: "checked",
				status: this.checked,
				target: this.parentNode
			});
		});

		return {
			root: root,
			mount: mount,
			add: add,
			remove: remove,
			expand: expand,
			collapse: collapse,
			toggle: toggle,
			refresh: refresh,
			clearChildren: clearChildren,
			rowFor: function (xmlNode) {
				var li = xmlNode ? byXml.get(xmlNode) : null;
				return li && root.contains(li) ? li : null;
			}
		};
	}
})(jQuery);
